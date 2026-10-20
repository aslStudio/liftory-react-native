import type { Theme } from '@/shared/lib/theme/use-theme'

export function barStyle(theme: Theme) {
    return {
        flexDirection: 'row' as const,
        gap: 4,
        padding: 6,
        alignSelf: 'center' as const,
        backgroundColor: theme.colors.glass,
        borderWidth: 1,
        borderColor: theme.colors.stroke,
        borderRadius: theme.radius.pill,
    }
}

export function tabForeground(theme: Theme, active: boolean) {
    return active ? theme.colors.accentText : theme.colors.ink
}
