import type { Theme } from '@/shared/lib/theme/use-theme'

import { TRACK_GAP, TRACK_PADDING } from './model'

export function trackStyle(theme: Theme) {
    return {
        flexDirection: 'row' as const,
        gap: TRACK_GAP,
        padding: TRACK_PADDING,
        backgroundColor: theme.colors.surface2,
        borderRadius: theme.radius.pill,
    }
}

export function segmentColors(theme: Theme, selected: boolean) {
    return { textColor: selected ? theme.colors.ink : theme.colors.inkSecondary }
}
