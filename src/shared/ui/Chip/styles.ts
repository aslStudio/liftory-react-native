import type { Theme } from '@/shared/lib/theme/use-theme'

import type { ChipTone } from './model'

export function resolveChipColors(theme: Theme, tone: ChipTone) {
    const c = theme.colors
    const background = {
        neutral: c.surface3,
        accent: c.accentSoft,
        success: c.successSoft,
        pr: c.prSoft,
        solid: c.accent,
    }[tone]
    const foreground = {
        neutral: c.inkSecondary,
        accent: c.accentText,
        success: c.success,
        pr: c.pr,
        solid: c.onAccent,
    }[tone]
    return { background, foreground }
}
