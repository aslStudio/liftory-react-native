import type { Theme } from '@/shared/lib/theme/use-theme'

export function weekSegmentColor(
    theme: Theme,
    weekNumber: number,
    currentWeek: number,
    deloadWeek: number | undefined,
) {
    const c = theme.colors
    if (weekNumber < currentWeek) return c.accent
    if (weekNumber === deloadWeek) return c.strokeStrong
    return c.surface3
}
