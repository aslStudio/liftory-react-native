/** Column widths shared by SetHeader and SetRow (pt). Middle column flexes. */
export const SET_COLUMNS = {
    badge: 28,
    weight: 64,
    reps: 52,
    rpe: 44,
    check: 32,
    gap: 8,
    padX: 6,
} as const

export type SetValues = { weight?: string; reps?: string; rpe?: string }

export type SetRowType = 'warmup' | 'working' | 'drop'

export type SetRowProps = SetValues & {
    index?: number
    type?: SetRowType
    previous?: string
    /** Shown as placeholders; tapping the check with empty fields should accept them. */
    suggested?: SetValues
    done?: boolean
    pr?: boolean
    onChange?: (patch: SetValues) => void
    onToggle?: () => void
}
