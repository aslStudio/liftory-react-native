import AsyncStorage from '@react-native-async-storage/async-storage'
import {
    createContext,
    type PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import { Appearance, useColorScheme as useSystemColorScheme } from 'react-native'

import type { ColorScheme } from '@/shared/config/theme'

const STORAGE_KEY = 'liftory.theme.mode'

export type ThemeMode = 'light' | 'dark' | 'system'

const THEME_MODES: ThemeMode[] = ['light', 'dark', 'system']

type ThemeModeContextValue = {
    themeMode: ThemeMode
    setThemeMode: (mode: ThemeMode) => void
    resolvedScheme: ColorScheme
    themeModeStorageError: string | null
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

/** Liftory is dark-first — the initial (pre-hydration) mode is `dark`, not `system`. */
export function ThemeModeProvider({ children }: PropsWithChildren) {
    const systemScheme = useSystemColorScheme()
    const [themeMode, setThemeModeState] = useState<ThemeMode>('dark')
    const [themeModeStorageError, setStorageError] = useState<string | null>(null)
    const changed = useRef(false)
    const writes = useRef(Promise.resolve())

    useEffect(() => {
        let active = true
        AsyncStorage.getItem(STORAGE_KEY)
            .then((saved) => {
                if (
                    active &&
                    !changed.current &&
                    saved &&
                    THEME_MODES.includes(saved as ThemeMode)
                ) {
                    setThemeModeState(saved as ThemeMode)
                }
            })
            .catch(() => {
                if (active) setStorageError('Could not load the saved theme — using dark.')
            })
        return () => {
            active = false
        }
    }, [])

    const setThemeMode = useCallback((mode: ThemeMode) => {
        if (!THEME_MODES.includes(mode)) return
        changed.current = true
        setThemeModeState(mode)
        // Preserve selection order even when the user taps several modes quickly.
        writes.current = writes.current
            .then(() => AsyncStorage.setItem(STORAGE_KEY, mode))
            .then(() => setStorageError(null))
            .catch(() => setStorageError('Could not save the selected theme.'))
    }, [])

    const resolvedScheme: ColorScheme =
        themeMode === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : themeMode

    // Keeps native UIKit chrome (alerts, the system tab bar) in sync with an
    // explicit in-app choice — otherwise it only ever follows the device setting.
    useEffect(() => {
        Appearance.setColorScheme(themeMode === 'system' ? 'unspecified' : themeMode)
    }, [themeMode])

    return (
        <ThemeModeContext
            value={{ themeMode, setThemeMode, resolvedScheme, themeModeStorageError }}
        >
            {children}
        </ThemeModeContext>
    )
}

export function useThemeMode() {
    const context = useContext(ThemeModeContext)
    if (!context) throw new Error('useThemeMode must be used within ThemeModeProvider')
    return context
}
