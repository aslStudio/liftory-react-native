import type { PropsWithChildren, ReactNode } from 'react'
import { Pressable, ScrollView, TextInput, type TextInputProps, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { TheText } from '@/shared/ui/TheText'

export function TrainingLayout({
    title,
    subtitle,
    children,
    action,
    onBack,
    tabs = false,
}: PropsWithChildren<{
    title: string
    subtitle?: string
    action?: ReactNode
    onBack?: () => void
    tabs?: boolean
}>) {
    const theme = useTheme()
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.bg }}
            edges={['top', 'left', 'right']}
        >
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    width: '100%',
                    maxWidth: 680,
                    alignSelf: 'center',
                    padding: 20,
                    paddingBottom: tabs ? 28 : 44,
                    gap: 20,
                }}
            >
                {onBack ? (
                    <Pressable
                        accessibilityRole="button"
                        onPress={onBack}
                        style={{ minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' }}
                    >
                        <TheText color={theme.colors.accentText}>‹ Back</TheText>
                    </Pressable>
                ) : null}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                    <View style={{ flex: 1, gap: 4 }}>
                        <TheText variant="largeTitle">{title}</TheText>
                        {subtitle ? (
                            <TheText color={theme.colors.inkSecondary}>{subtitle}</TheText>
                        ) : null}
                    </View>
                    {action}
                </View>
                {children}
            </ScrollView>
        </SafeAreaView>
    )
}

export function SectionHeading({ title, detail }: { title: string; detail?: string }) {
    const theme = useTheme()
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: 12,
            }}
        >
            <TheText variant="title2">{title}</TheText>
            {detail ? (
                <TheText variant="footnote" color={theme.colors.inkSecondary}>
                    {detail}
                </TheText>
            ) : null}
        </View>
    )
}

export function TrainingField({ label, ...props }: TextInputProps & { label: string }) {
    const theme = useTheme()
    return (
        <View style={{ gap: 8 }}>
            <TheText variant="footnote" color={theme.colors.inkSecondary}>
                {label}
            </TheText>
            <TextInput
                {...props}
                accessibilityLabel={label}
                placeholderTextColor={theme.colors.inkTertiary}
                style={[
                    {
                        minHeight: 48,
                        borderRadius: theme.radius.md,
                        paddingHorizontal: 14,
                        color: theme.colors.ink,
                        backgroundColor: theme.colors.surface2,
                        fontSize: 16,
                    },
                    props.style,
                ]}
            />
        </View>
    )
}

export function TrainingRow({
    title,
    subtitle,
    trailing,
    onPress,
}: {
    title: string
    subtitle?: string
    trailing?: ReactNode
    onPress?: () => void
}) {
    const theme = useTheme()
    return (
        <Pressable
            accessibilityRole={onPress ? 'button' : undefined}
            onPress={onPress}
            style={({ pressed }) => ({
                minHeight: 58,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.surface1,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                opacity: pressed ? 0.7 : 1,
            })}
        >
            <View style={{ flex: 1, gap: 3 }}>
                <TheText variant="headline">{title}</TheText>
                {subtitle ? (
                    <TheText variant="footnote" color={theme.colors.inkSecondary}>
                        {subtitle}
                    </TheText>
                ) : null}
            </View>
            {trailing ?? (onPress ? <TheText color={theme.colors.inkTertiary}>›</TheText> : null)}
        </Pressable>
    )
}
