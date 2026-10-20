import type { Theme } from '@/shared/lib/theme/use-theme'

import type { SetRowType } from './model'

export function badgeColors(theme: Theme, type: SetRowType) {
    const c = theme.colors
    return {
        warmup: { background: c.accentSoft, foreground: c.accentText },
        drop: { background: c.surface2, foreground: c.info },
        working: { background: c.surface3, foreground: c.ink },
    }[type]
}

export function rowColors(theme: Theme, done: boolean | undefined, pr: boolean | undefined) {
    const c = theme.colors
    const background = pr ? c.prSoft : done ? c.accentSoft : 'transparent'
    const checkBackground = pr ? c.pr : done ? c.accent : c.surface3
    const checkForeground = pr ? c.bg : done ? c.onAccent : c.inkTertiary
    return { background, checkBackground, checkForeground }
}
