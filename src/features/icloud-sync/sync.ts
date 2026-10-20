import { requireOptionalNativeModule } from 'expo'
import { Platform } from 'react-native'

import type { CloudRecord } from '@/entities/training/model'
import { getDirtyRecords, mergeRecords, metadata, setMetadata } from '@/entities/training/store'

type CloudModule = {
    account(): Promise<string>
    pull(account: string, allowCreate: boolean): Promise<string>
    push(records: string, account: string): Promise<string>
}

const module =
    Platform.OS === 'ios' ? requireOptionalNativeModule<CloudModule>('LiftoryCloud') : null

export const cloudAvailability =
    Platform.OS !== 'ios' ? 'unsupported' : module ? 'ready' : 'rebuild'
let running: Promise<void> | null = null

async function performSync() {
    if (!module)
        throw new Error(
            cloudAvailability === 'rebuild'
                ? 'Rebuild the iOS app to enable iCloud.'
                : 'iCloud sync is available on iOS only.',
        )
    const account = await module.account()
    const bound = await metadata('cloud.account')
    if (bound && bound !== account) {
        throw new Error(
            'This local database is linked to another iCloud account. Sign back into the original account to sync.',
        )
    }
    if (!bound) await setMetadata('cloud.account', account)

    const remote = JSON.parse(
        await module.pull(account, (await metadata('cloud.initialized')) !== 'true'),
    ) as CloudRecord[]
    await mergeRecords(remote)
    const dirty = await getDirtyRecords()
    for (let index = 0; index < dirty.length; index += 40) {
        const saved = JSON.parse(
            await module.push(JSON.stringify(dirty.slice(index, index + 40)), account),
        ) as CloudRecord[]
        await mergeRecords(saved)
    }
    await setMetadata('cloud.initialized', 'true')
    await setMetadata('cloud.lastSync', new Date().toISOString())
}

export function syncICloud(): Promise<void> {
    running ??= performSync().finally(() => {
        running = null
    })
    return running
}
