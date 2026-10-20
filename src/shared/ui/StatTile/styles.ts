import type { Theme } from '@/shared/lib/theme/use-theme'

export function statTileContainerStyle(theme: Theme) {
    return {
        flex: 1,
        backgroundColor: theme.colors.surface2,
        borderRadius: theme.radius.md,
        paddingVertical: 12,
        paddingHorizontal: 14,
        gap: 2,
    }
}

export function isNegativeDelta(delta: string) {
    return delta.startsWith('−') || delta.startsWith('-')
}
