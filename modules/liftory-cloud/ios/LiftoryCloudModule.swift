import ExpoModulesCore

public final class LiftoryCloudModule: Module {
  private let store = CloudStore()

  public func definition() -> ModuleDefinition {
    Name("LiftoryCloud")
    AsyncFunction("account") { () async throws -> String in
      try await cloudCall { try await self.store.account() }
    }
    AsyncFunction("pull") { (account: String, allowCreate: Bool) async throws -> String in
      try await cloudCall {
        let records = try await self.store.pull(account: account, allowCreate: allowCreate)
        return String(decoding: try JSONEncoder().encode(records), as: UTF8.self)
      }
    }
    AsyncFunction("push") { (json: String, account: String) async throws -> String in
      try await cloudCall {
        let entries = try JSONDecoder().decode([LiftoryCloudRecord].self, from: Data(json.utf8))
        let records = try await self.store.push(entries, account: account)
        return String(decoding: try JSONEncoder().encode(records), as: UTF8.self)
      }
    }
  }
}
