import type { CloudRecord } from './model'

export function compareRecords(a: CloudRecord, b: CloudRecord): number {
    if (a.deleted !== b.deleted) return a.deleted - b.deleted
    if (a.revision !== b.revision) return a.revision - b.revision
    if (a.writer !== b.writer) return a.writer < b.writer ? -1 : 1
    if (a.payload !== b.payload) return a.payload < b.payload ? -1 : 1
    return 0
}
