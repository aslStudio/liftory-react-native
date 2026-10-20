import type { Theme } from '@/shared/lib/theme/use-theme'

export function containerStyle(theme: Theme) {
    return {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 12,
        paddingVertical: 8,
        paddingLeft: 8,
        paddingRight: 10,
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.glass,
        borderWidth: 1,
        borderColor: theme.colors.stroke,
    }
}

export function adjustButtonStyle(theme: Theme) {
    return {
        height: 32,
        paddingHorizontal: 10,
        borderRadius: theme.radius.pill,
        backgroundColor: theme.colors.surface3,
        justifyContent: 'center' as const,
    }
}
