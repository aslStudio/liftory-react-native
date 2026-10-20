export type StreakHistoryEntry = boolean | 'freeze'

export type StreakCardProps = {
    weeks: number
    completed: number
    best?: number
    /** Oldest first: true = on plan, false = missed, 'freeze' = Streak Freeze used. */
    history?: StreakHistoryEntry[]
}

export const FLAME_CIRCLE_SIZE = 48
