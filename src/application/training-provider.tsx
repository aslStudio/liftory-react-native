import {
    createContext,
    type PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import { AppState } from 'react-native'

import { cloudAvailability, syncICloud } from '@/features/icloud-sync/sync'

import type {
    EntityByKind,
    EntityKind,
    Exercise,
    FitnessProfile,
    Goal,
    Measurement,
    Program,
    Workout,
    WorkoutTemplate,
} from '@/entities/training/model'
import {
    database,
    deleteEntity,
    listEntities,
    metadata,
    saveEntity,
} from '@/entities/training/store'

type TrainingData = {
    exercises: Exercise[]
    templates: WorkoutTemplate[]
    programs: Program[]
    workouts: Workout[]
    measurements: Measurement[]
    goals: Goal[]
    profiles: FitnessProfile[]
}

type TrainingContextValue = TrainingData & {
    ready: boolean
    error: string | null
    cloud: {
        availability: typeof cloudAvailability
        syncing: boolean
        error: string | null
        lastSync: string | null
    }
    refresh: () => Promise<void>
    save: <K extends EntityKind>(kind: K, entity: EntityByKind[K]) => Promise<void>
    remove: (kind: EntityKind, id: string) => Promise<void>
    sync: () => Promise<void>
}

const empty: TrainingData = {
    exercises: [],
    templates: [],
    programs: [],
    workouts: [],
    measurements: [],
    goals: [],
    profiles: [],
}
const TrainingContext = createContext<TrainingContextValue | null>(null)

export function TrainingProvider({ children }: PropsWithChildren) {
    const [data, setData] = useState<TrainingData>(empty)
    const [ready, setReady] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [cloud, setCloud] = useState<TrainingContextValue['cloud']>({
        availability: cloudAvailability,
        syncing: false,
        error: null,
        lastSync: null,
    })
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const refresh = useCallback(async () => {
        const [exercises, templates, programs, workouts, measurements, goals, profiles] =
            await Promise.all([
                listEntities('exercise'),
                listEntities('template'),
                listEntities('program'),
                listEntities('workout'),
                listEntities('measurement'),
                listEntities('goal'),
                listEntities('profile'),
            ])
        setData({ exercises, templates, programs, workouts, measurements, goals, profiles })
    }, [])

    const sync = useCallback(async () => {
        if (cloudAvailability !== 'ready') return
        setCloud((old) => ({ ...old, syncing: true, error: null }))
        try {
            await syncICloud()
            await refresh()
            setCloud((old) => ({ ...old, syncing: false, lastSync: new Date().toISOString() }))
        } catch (cause) {
            setCloud((old) => ({
                ...old,
                syncing: false,
                error: cause instanceof Error ? cause.message : 'iCloud sync failed.',
            }))
        }
    }, [refresh])

    useEffect(() => {
        let active = true
        void database()
            .then(async () => {
                await refresh()
                const lastSync = await metadata('cloud.lastSync')
                if (active) {
                    setReady(true)
                    setCloud((old) => ({ ...old, lastSync }))
                    void sync()
                }
            })
            .catch((cause) => {
                if (active) {
                    setReady(true)
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : 'Could not open the local database.',
                    )
                }
            })
        return () => {
            active = false
        }
    }, [refresh, sync])

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active' && ready) void sync()
        })
        return () => subscription.remove()
    }, [ready, sync])

    const queueSync = useCallback(() => {
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            void sync()
        }, 1500)
    }, [sync])

    useEffect(
        () => () => {
            if (timer.current) clearTimeout(timer.current)
        },
        [],
    )

    const save = useCallback(
        async <K extends EntityKind>(kind: K, entity: EntityByKind[K]) => {
            await saveEntity(kind, entity)
            await refresh()
            queueSync()
        },
        [refresh, queueSync],
    )

    const remove = useCallback(
        async (kind: EntityKind, id: string) => {
            await deleteEntity(kind, id)
            await refresh()
            queueSync()
        },
        [refresh, queueSync],
    )

    return (
        <TrainingContext value={{ ...data, ready, error, cloud, refresh, save, remove, sync }}>
            {children}
        </TrainingContext>
    )
}

export function useTraining() {
    const context = useContext(TrainingContext)
    if (!context) throw new Error('useTraining must be used inside TrainingProvider')
    return context
}
