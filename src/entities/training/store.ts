import AsyncStorage from '@react-native-async-storage/async-storage'
import { randomUUID } from 'expo-crypto'
import * as SQLite from 'expo-sqlite'

import { builtInExercises } from './catalog'
import { compareRecords } from './merge'
import type { CloudRecord, EntityByKind, EntityKind } from './model'

type Row = CloudRecord & { dirty: number }
const WRITER_KEY = 'liftory.device.id'
let databasePromise: Promise<SQLite.SQLiteDatabase> | undefined
let writerPromise: Promise<string> | undefined
let writeQueue = Promise.resolve()

function exclusive<T>(task: (tx: SQLite.SQLiteDatabase) => Promise<T>): Promise<T> {
    const operation = writeQueue.then(async () => {
        const db = await database()
        let result: T | undefined
        await db.withExclusiveTransactionAsync(async (tx) => {
            result = await task(tx)
        })
        return result as T
    })
    writeQueue = operation.then(
        () => undefined,
        () => undefined,
    )
    return operation
}

async function writerId() {
    writerPromise ??= (async () => {
        const saved = await AsyncStorage.getItem(WRITER_KEY)
        if (saved) return saved
        const id = randomUUID()
        await AsyncStorage.setItem(WRITER_KEY, id)
        return id
    })()
    return writerPromise
}

export async function database() {
    databasePromise ??= (async () => {
        const db = await SQLite.openDatabaseAsync('liftory.db')
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS records (
                id TEXT PRIMARY KEY NOT NULL,
                kind TEXT NOT NULL,
                payload TEXT NOT NULL,
                revision INTEGER NOT NULL,
                writer TEXT NOT NULL,
                deleted INTEGER NOT NULL DEFAULT 0,
                dirty INTEGER NOT NULL DEFAULT 1
            );
            CREATE INDEX IF NOT EXISTS records_kind_visible ON records(kind, deleted);
            CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);
        `)
        await db.withExclusiveTransactionAsync(async (tx) => {
            for (const exercise of builtInExercises) {
                await tx.runAsync(
                    `INSERT OR IGNORE INTO records(id,kind,payload,revision,writer,deleted,dirty)
                     VALUES(?, 'exercise', ?, 0, 'builtin', 0, 0)`,
                    exercise.id,
                    JSON.stringify(exercise),
                )
            }
        })
        return db
    })()
    return databasePromise
}

export async function listEntities<K extends EntityKind>(kind: K): Promise<EntityByKind[K][]> {
    const db = await database()
    const rows = await db.getAllAsync<{ payload: string }>(
        'SELECT payload FROM records WHERE kind = ? AND deleted = 0 ORDER BY rowid DESC',
        kind,
    )
    return rows.map((row) => JSON.parse(row.payload) as EntityByKind[K])
}

export async function getEntity<K extends EntityKind>(kind: K, id: string) {
    const db = await database()
    const row = await db.getFirstAsync<{ payload: string }>(
        'SELECT payload FROM records WHERE kind = ? AND id = ? AND deleted = 0',
        kind,
        id,
    )
    return row ? (JSON.parse(row.payload) as EntityByKind[K]) : null
}

export async function saveEntity<K extends EntityKind>(kind: K, entity: EntityByKind[K]) {
    const writer = await writerId()
    await exclusive(async (tx) => {
        const old = await tx.getFirstAsync<{ revision: number }>(
            'SELECT revision FROM records WHERE id = ?',
            entity.id,
        )
        await tx.runAsync(
            `INSERT INTO records(id,kind,payload,revision,writer,deleted,dirty) VALUES(?,?,?,?,?,0,1)
             ON CONFLICT(id) DO UPDATE SET kind=excluded.kind,payload=excluded.payload,
             revision=excluded.revision,writer=excluded.writer,deleted=0,dirty=1`,
            entity.id,
            kind,
            JSON.stringify(entity),
            (old?.revision ?? 0) + 1,
            writer,
        )
    })
}

export async function deleteEntity(kind: EntityKind, id: string) {
    const writer = await writerId()
    await exclusive(async (tx) => {
        const old = await tx.getFirstAsync<Row>('SELECT * FROM records WHERE id = ?', id)
        if (!old || old.kind !== kind || old.writer === 'builtin') return
        await tx.runAsync(
            'UPDATE records SET revision=?,writer=?,deleted=1,dirty=1 WHERE id=?',
            old.revision + 1,
            writer,
            id,
        )
    })
}

export async function getDirtyRecords(): Promise<CloudRecord[]> {
    const db = await database()
    return db.getAllAsync<CloudRecord>(
        'SELECT id,kind,payload,revision,writer,deleted FROM records WHERE dirty = 1',
    )
}

export async function mergeRecords(remote: CloudRecord[]) {
    await exclusive(async (tx) => {
        for (const record of remote) {
            const local = await tx.getFirstAsync<Row>(
                'SELECT * FROM records WHERE id = ?',
                record.id,
            )
            if (local?.writer === 'builtin') continue
            if (!local || compareRecords(record, local) > 0) {
                await tx.runAsync(
                    `INSERT INTO records(id,kind,payload,revision,writer,deleted,dirty) VALUES(?,?,?,?,?,?,0)
                     ON CONFLICT(id) DO UPDATE SET kind=excluded.kind,payload=excluded.payload,
                     revision=excluded.revision,writer=excluded.writer,deleted=excluded.deleted,dirty=0`,
                    record.id,
                    record.kind,
                    record.payload,
                    record.revision,
                    record.writer,
                    record.deleted,
                )
            } else if (compareRecords(record, local) === 0) {
                await tx.runAsync(
                    'UPDATE records SET dirty=0 WHERE id=? AND revision=? AND writer=?',
                    local.id,
                    local.revision,
                    local.writer,
                )
            } else if (!local.dirty) {
                await tx.runAsync('UPDATE records SET dirty=1 WHERE id=?', local.id)
            }
        }
    })
}

export async function metadata(key: string): Promise<string | null> {
    const db = await database()
    return (
        (await db.getFirstAsync<{ value: string }>('SELECT value FROM metadata WHERE key=?', key))
            ?.value ?? null
    )
}

export async function setMetadata(key: string, value: string) {
    await exclusive(async (tx) => {
        await tx.runAsync(
            'INSERT INTO metadata(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',
            key,
            value,
        )
    })
}
