import type { Theme } from '@/shared/lib/theme/use-theme'

export function listContainerStyle(theme: Theme) {
    return {
        backgroundColor: theme.colors.surface2,
        borderRadius: theme.radius.md,
        overflow: 'hidden' as const,
    }
}

export function listDividerStyle(theme: Theme) {
    return { height: 1, marginLeft: 14, backgroundColor: theme.colors.stroke }
}
