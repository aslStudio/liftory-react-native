import type { StyleProp, ViewStyle } from 'react-native'

export type RestTimerProps = {
    /** Seconds left. */
    remaining: number
    /** Total rest seconds. */
    total: number
    next?: string
    onMinus?: () => void
    onPlus?: () => void
    onSkip?: () => void
    style?: StyleProp<ViewStyle>
}

export const RING_SIZE = 64
export const RING_RADIUS = 26
export const RING_STROKE_WIDTH = 5
export const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

export function formatTime(seconds: number) {
    const value = Math.max(0, Math.round(seconds))
    return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`
}
