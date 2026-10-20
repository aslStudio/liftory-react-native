export type LineChartTone = 'accent' | 'info'

export type LineChartProps = {
    points: number[]
    /** Same length as points; '' to skip a label. Use dates like "Sep 15". */
    labels?: string[]
    unit?: string
    min?: number
    max?: number
    height?: number
    tone?: LineChartTone
    label?: string
}

export const PADDING = { left: 8, right: 36, top: 22, bottom: 22 } as const
export const DEFAULT_HEIGHT = 140
export const GRID_LINE_COUNT = 4
