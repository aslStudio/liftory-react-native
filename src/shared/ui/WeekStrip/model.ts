export type DayState = 'done' | 'planned' | 'rest' | 'missed' | 'empty'

export type WeekDay = {
    label: string
    date: number
    state?: DayState
    tag?: string
    today?: boolean
}

export type WeekStripProps = {
    days: WeekDay[]
    onPressDay?: (index: number) => void
    onLongPressDay?: (index: number) => void
}

export const DOT_SIZE = 36
export const TODAY_RING_SIZE = 43
