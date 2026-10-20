import type { Theme } from '@/shared/lib/theme/use-theme'

import { PADDING } from './model'

export function resolveDomain(points: number[], min: number | undefined, max: number | undefined) {
    let lo = min ?? Math.min(...points)
    let hi = max ?? Math.max(...points)
    if (hi === lo) {
        hi += 1
        lo -= 1
    }
    return { lo, hi }
}

export function makeScales(
    width: number,
    height: number,
    pointCount: number,
    lo: number,
    hi: number,
) {
    const x = (index: number) =>
        PADDING.left +
        (width - PADDING.left - PADDING.right) * (pointCount === 1 ? 0.5 : index / (pointCount - 1))
    const y = (value: number) =>
        PADDING.top + (height - PADDING.top - PADDING.bottom) * (1 - (value - lo) / (hi - lo))
    return { x, y }
}

export function buildPath(points: number[], x: (i: number) => number, y: (v: number) => number) {
    return points
        .map((value, index) => `${index ? 'L' : 'M'}${x(index).toFixed(1)} ${y(value).toFixed(1)}`)
        .join(' ')
}

export function toneColor(theme: Theme, tone: 'accent' | 'info') {
    return tone === 'info' ? theme.colors.info : theme.colors.accent
}

export const axisTextProps = (theme: Theme) => ({
    fill: theme.colors.inkTertiary,
    fontSize: 10,
    fontWeight: '500' as const,
})
