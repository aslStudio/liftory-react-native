import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { ThemeModeProvider } from '@/shared/lib/theme/theme-mode-provider'
import { useTheme } from '@/shared/lib/theme/use-theme'

import { TrainingProvider } from './training-provider'

export default function AppLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ThemeModeProvider>
                    <TrainingProvider>
                        <RootStack />
                    </TrainingProvider>
                </ThemeModeProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    )
}

function RootStack() {
    const theme = useTheme()
    const baseTheme = theme.colorScheme === 'dark' ? DarkTheme : DefaultTheme
    return (
        <ThemeProvider
            value={{
                ...baseTheme,
                colors: {
                    ...baseTheme.colors,
                    background: theme.colors.bg,
                    card: theme.colors.surface1,
                    border: theme.colors.stroke,
                    primary: theme.colors.accent,
                    text: theme.colors.ink,
                },
            }}
        >
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: theme.colors.bg },
                }}
            >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="workout" />
                <Stack.Screen name="library" />
                <Stack.Screen name="program-editor" />
                <Stack.Screen name="template-editor" />
                <Stack.Screen name="history" />
                <Stack.Screen name="fitness-profile" />
            </Stack>
        </ThemeProvider>
    )
}
