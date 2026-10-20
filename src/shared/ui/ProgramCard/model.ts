export type ProgramCardProps = {
    name: string
    meta?: string
    week: number
    totalWeeks: number
    /** 0–1 progress inside the current week. */
    weekProgress?: number
    deloadWeek?: number
    next?: string
    onStart?: () => void
}

export const WEEK_SEGMENT_HEIGHT = 6
