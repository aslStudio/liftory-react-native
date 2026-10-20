import type { SetRowProps } from '@/shared/ui/SetRow'

export type ExerciseRecommendation = { value: string; reason?: string }

export type ExerciseCardProps = {
    name: string
    muscle?: string
    /** Superset label, e.g. "Superset A". */
    group?: string
    /** Always pass a reason — a recommendation is never shown without its "why". */
    recommendation?: ExerciseRecommendation
    sets?: SetRowProps[]
    note?: string
    onAddSet?: () => void
    onReplace?: () => void
    onMore?: () => void
}

export const EXERCISE_ICON_TILE_SIZE = 44
