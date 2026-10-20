import {
    type Colors,
    palette,
    radius,
    shadow,
    space,
    type as typography,
} from '@/shared/config/theme'

import { useThemeMode } from './theme-mode-provider'

export function useTheme() {
    const { resolvedScheme, themeMode, setThemeMode, themeModeStorageError } = useThemeMode()

    return {
        colors: palette[resolvedScheme] as Colors,
        type: typography,
        space,
        radius,
        shadow: shadow[resolvedScheme],
        colorScheme: resolvedScheme,
        themeMode,
        setThemeMode,
        themeModeStorageError,
    }
}

export type Theme = ReturnType<typeof useTheme>
