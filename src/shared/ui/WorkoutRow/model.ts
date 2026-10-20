export type WorkoutRowProps = {
    title: string
    done?: boolean
    status?: string
    onStart?: () => void
    /** Pass `false` to hide the trash button. */
    onDelete?: (() => void) | false
}

export const CHECK_CIRCLE_SIZE = 22
