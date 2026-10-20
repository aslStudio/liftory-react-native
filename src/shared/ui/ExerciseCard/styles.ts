import type { Theme } from '@/shared/lib/theme/use-theme'

import { EXERCISE_ICON_TILE_SIZE } from './model'

export function iconTileStyle(theme: Theme) {
    return {
        width: EXERCISE_ICON_TILE_SIZE,
        height: EXERCISE_ICON_TILE_SIZE,
        borderRadius: 12,
        backgroundColor: theme.colors.surface2,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    }
}

export function recommendationStyle(theme: Theme) {
    return {
        flexDirection: 'row' as const,
        alignItems: 'flex-start' as const,
        gap: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 12,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.accentSoft,
    }
}
