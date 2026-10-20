import type { Theme } from '@/shared/lib/theme/use-theme'

import type { StreakHistoryEntry } from './model'

export function historyBarColor(theme: Theme, entry: StreakHistoryEntry) {
    const c = theme.colors
    if (entry === 'freeze') return c.info
    return entry ? c.accent : c.surface3
}
