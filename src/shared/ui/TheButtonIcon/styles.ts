import type { Theme } from '@/shared/lib/theme/use-theme'

import type { TheButtonIconVariant } from './model'

export function resolveButtonIconColors(theme: Theme, variant: TheButtonIconVariant) {
    const c = theme.colors
    const background = {
        accent: c.accent,
        surface: c.surface3,
        glass: c.glass,
        plain: 'transparent',
    }[variant]
    const pressedBackground = variant === 'accent' ? c.accentPressed : background
    const foreground = { accent: c.onAccent, surface: c.ink, glass: c.ink, plain: c.inkSecondary }[
        variant
    ]
    return { background, pressedBackground, foreground }
}
