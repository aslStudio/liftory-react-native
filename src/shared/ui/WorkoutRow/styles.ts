import type { Theme } from '@/shared/lib/theme/use-theme'

export function checkCircleStyle(theme: Theme, done: boolean | undefined) {
    const c = theme.colors
    return {
        borderColor: done ? c.accent : c.strokeStrong,
        backgroundColor: done ? c.accent : 'transparent',
    }
}

export function rowContainerStyle(theme: Theme) {
    return {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 12,
        paddingVertical: 10,
        paddingRight: 10,
        paddingLeft: 14,
        backgroundColor: theme.colors.surface2,
        borderRadius: theme.radius.md,
    }
}
