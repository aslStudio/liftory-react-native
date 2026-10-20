import CloudKit
import Foundation

struct LiftoryCloudRecord: Codable {
  let id: String
  let kind: String
  let revision: Int64
  let writer: String
  let deleted: Int
  let payload: String

  init(_ record: CKRecord) throws {
    guard record.recordType == "LiftoryRecordV1",
      (record["schemaVersion"] as? NSNumber)?.intValue == 1,
      let kind = record["kind"] as? String,
      let revision = record["revision"] as? NSNumber,
      let writer = record["writer"] as? String,
      let deleted = record["deleted"] as? NSNumber,
      let payload = record["payload"] as? String
    else { throw CloudFailure("SCHEMA_MISMATCH") }
    self.id = record.recordID.recordName
    self.kind = kind
    self.revision = revision.int64Value
    self.writer = writer
    self.deleted = deleted.intValue
    self.payload = payload
  }

  func wins(over other: LiftoryCloudRecord) -> Bool {
    if deleted != other.deleted { return deleted > other.deleted }
    if revision != other.revision { return revision > other.revision }
    return writer > other.writer
  }

  func fill(_ record: CKRecord) {
    record["schemaVersion"] = 1 as NSNumber
    record["kind"] = kind as NSString
    record["revision"] = NSNumber(value: revision)
    record["writer"] = writer as NSString
    record["deleted"] = NSNumber(value: deleted)
    record["payload"] = payload as NSString
  }
}

struct CloudFailure: LocalizedError {
  let code: String
  let diagnostic: String?
  init(_ code: String, diagnostic: String? = nil) {
    self.code = code
    self.diagnostic = diagnostic
  }
  var errorDescription: String? {
    "LIFTORY_CLOUD_\(code)" + (diagnostic.map { " [\($0)]" } ?? "")
  }
}

// This transport never opens the public database. Tokens are deliberately not
// persisted yet: a paginated full zone read also recovers interrupted first syncs.
actor CloudStore {
  private let container = CKContainer(identifier: "iCloud.vladAstahov.gymTracker.GymTracker")
  private let zone = CKRecordZone.ID(zoneName: "LiftoryV1", ownerName: CKCurrentUserDefaultName)
  private var database: CKDatabase { container.privateCloudDatabase }
  private var fetchedRecords: [CKRecord.ID: CKRecord] = [:]
  private var fetchedAccount: String?

  func account() async throws -> String {
    switch try await container.accountStatus() {
    case .available: return try await container.userRecordID().recordName
    case .noAccount: throw CloudFailure("NO_ACCOUNT")
    case .restricted: throw CloudFailure("RESTRICTED")
    case .temporarilyUnavailable, .couldNotDetermine: throw CloudFailure("UNAVAILABLE")
    @unknown default: throw CloudFailure("UNAVAILABLE")
    }
  }

  func verify(_ expected: String) async throws {
    guard try await account() == expected else { throw CloudFailure("ACCOUNT_CHANGED") }
  }

  func pull(account: String, allowCreate: Bool) async throws -> [LiftoryCloudRecord] {
    try await verify(account)
    do { _ = try await database.recordZone(for: zone) }
    catch let error as CKError where error.code == .zoneNotFound || error.code == .unknownItem || error.code == .userDeletedZone {
      guard allowCreate else { throw CloudFailure("REMOTE_RESET") }
      _ = try await database.save(CKRecordZone(zoneID: zone))
    }
    var token: CKServerChangeToken?
    var records: [CKRecord.ID: CKRecord] = [:]
    var more = true
    while more {
      let page = try await database.recordZoneChanges(inZoneWith: zone, since: token, resultsLimit: 200)
      // App deletions are tombstone records, not physical CloudKit deletions.
      // An externally removed record/zone needs explicit recovery, never resurrection.
      guard page.deletions.isEmpty else { throw CloudFailure("REMOTE_RESET") }
      for (id, result) in page.modificationResultsByID {
        let record = try result.get().record
        _ = try LiftoryCloudRecord(record)
        records[id] = record
      }
      token = page.changeToken
      more = page.moreComing
    }
    try await verify(account)
    fetchedRecords = records
    fetchedAccount = account
    return try records.values.map { try LiftoryCloudRecord($0) }
  }

  func push(_ entries: [LiftoryCloudRecord], account: String) async throws -> [LiftoryCloudRecord] {
    try await verify(account)
    guard fetchedAccount == account, entries.count <= 40 else { throw CloudFailure("UNAVAILABLE") }
    var resolved: [String: LiftoryCloudRecord] = [:]
    var candidates: [CKRecord] = []
    for entry in entries {
      guard entry.payload.utf8.count < 700_000 else { throw CloudFailure("RECORD_TOO_LARGE") }
      let id = CKRecord.ID(recordName: entry.id, zoneID: zone)
      let record = fetchedRecords[id] ?? CKRecord(recordType: "LiftoryRecordV1", recordID: id)
      if fetchedRecords[id] != nil {
        let server = try LiftoryCloudRecord(record)
        if !entry.wins(over: server) {
          resolved[entry.id] = server
          continue
        }
      }
      entry.fill(record)
      candidates.append(record)
    }
    if !candidates.isEmpty {
      // The full pull already supplied the change tags. Batch normal uploads;
      // only records changed on the server since that pull need a fresh fetch.
      try await verify(account)
      let results = try await database.modifyRecords(saving: candidates, deleting: [], savePolicy: .ifServerRecordUnchanged, atomically: false)
      for entry in entries where resolved[entry.id] == nil {
        let id = CKRecord.ID(recordName: entry.id, zoneID: zone)
        guard let result = results.saveResults[id] else { throw CloudFailure("UNAVAILABLE") }
        do {
          let saved = try result.get()
          fetchedRecords[id] = saved
          resolved[entry.id] = try LiftoryCloudRecord(saved)
        } catch let error as CKError where error.code == .serverRecordChanged {
          resolved[entry.id] = try await save(entry, account: account)
          fetchedRecords.removeValue(forKey: id)
        }
      }
    }
    try await verify(account)
    return try entries.map {
      guard let result = resolved[$0.id] else { throw CloudFailure("UNAVAILABLE") }
      return result
    }
  }

  private func save(_ entry: LiftoryCloudRecord, account: String) async throws -> LiftoryCloudRecord {
    let id = CKRecord.ID(recordName: entry.id, zoneID: zone)
    for _ in 0..<5 {
      let fetched: CKRecord?
      do {
        fetched = try await database.record(for: id)
      } catch let error as CKError where error.code == .unknownItem {
        fetched = nil
      }
      let record = fetched ?? CKRecord(recordType: "LiftoryRecordV1", recordID: id)
      if let fetched {
        let server = try LiftoryCloudRecord(fetched)
        if !entry.wins(over: server) { return server }
      }
      entry.fill(record)
      do {
        try await verify(account)
        let results = try await database.modifyRecords(saving: [record], deleting: [], savePolicy: .ifServerRecordUnchanged, atomically: false)
        guard let result = results.saveResults[id] else { throw CloudFailure("UNAVAILABLE") }
        return try LiftoryCloudRecord(result.get())
      } catch let error as CKError where error.code == .serverRecordChanged {
        continue // Refetch the change tag and re-evaluate the deterministic winner.
      }
    }
    throw CloudFailure("CONFLICT")
  }
}

// Preserve the actionable per-record failure, rather than masking it as partialFailure.
func cloudFailure(_ error: CKError) -> CloudFailure {
  if error.code == .partialFailure,
     let nested = error.partialErrorsByItemID?.values.compactMap({ $0 as? CKError })
      .first(where: { $0.code != .batchRequestFailed }) {
    return cloudFailure(nested)
  }
  let diagnostic = "CK_\(error.code.rawValue)"
  let detail = error.localizedDescription.lowercased()
  if (error.code == .serverRejectedRequest || error.code == .invalidArguments || error.code == .unknownItem),
     detail.contains("schema") || detail.contains("record type") || detail.contains("recordtype") {
    return CloudFailure("SCHEMA_NOT_DEPLOYED", diagnostic: diagnostic)
  }
  let code: String
  switch error.code {
  case .notAuthenticated: code = "NO_ACCOUNT"
  case .quotaExceeded: code = "QUOTA"
  case .networkFailure, .networkUnavailable: code = "OFFLINE"
  case .zoneNotFound, .userDeletedZone: code = "REMOTE_RESET"
  case .badContainer, .badDatabase, .missingEntitlement, .permissionFailure, .serverRejectedRequest:
    code = "CONFIGURATION"
  case .requestRateLimited, .serviceUnavailable, .zoneBusy: code = "RETRY_LATER"
  default: code = "UNAVAILABLE"
  }
  // Never include record names, account identifiers or payloads in diagnostics.
  return CloudFailure(code, diagnostic: diagnostic)
}

func cloudCall<T>(_ action: () async throws -> T) async throws -> T {
  do { return try await action() }
  catch let error as CKError { throw cloudFailure(error) }
}
