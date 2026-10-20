import { StyleSheet } from 'react-native'

import type { Theme } from '@/shared/lib/theme/use-theme'

import type { TheButtonVariant } from './model'

export const useStyles = () =>
    StyleSheet.create({
        root: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
    })

export function resolveButtonColors(theme: Theme, variant: TheButtonVariant) {
    const c = theme.colors
    const background = {
        primary: c.accent,
        secondary: c.surface3,
        ghost: 'transparent',
        danger: c.surface3,
    }[variant]
    const pressedBackground = variant === 'primary' ? c.accentPressed : background
    const foreground = {
        primary: c.onAccent,
        secondary: c.ink,
        ghost: c.accentText,
        danger: c.danger,
    }[variant]
    return { background, pressedBackground, foreground }
}
