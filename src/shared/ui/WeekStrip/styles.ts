import type { Theme } from '@/shared/lib/theme/use-theme'

import type { DayState } from './model'

export function dayDotColors(theme: Theme, state: DayState) {
    const c = theme.colors
    return {
        done: { background: c.accent, border: c.accent, foreground: c.onAccent },
        planned: { background: 'transparent', border: c.accent, foreground: c.ink },
        rest: { background: 'transparent', border: 'transparent', foreground: c.inkTertiary },
        missed: { background: c.surface3, border: c.surface3, foreground: c.inkSecondary },
        empty: { background: 'transparent', border: 'transparent', foreground: c.ink },
    }[state]
}
