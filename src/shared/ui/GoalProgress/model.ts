export type GoalProgressProps = {
    title: string
    subtitle?: string
    current: number
    target: number
    unit?: string
    /** Left meta label: "Max Weight", "This week". */
    kind?: string
}
