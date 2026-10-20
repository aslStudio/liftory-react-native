import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView, View } from 'react-native'

import { type as typography } from '@/shared/config/theme'
import { useTheme } from '@/shared/lib/theme/use-theme'

import { TheText } from './TheText'

function Canvas({ children }: { children: React.ReactNode }) {
    const theme = useTheme()
    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: theme.colors.bg }}
            contentContainerStyle={{ padding: 20, gap: 16 }}
        >
            {children}
        </ScrollView>
    )
}

const meta = {
    title: 'Shared/TheText',
    component: TheText,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
    args: {
        children: 'Bench Press 82.5 kg',
        variant: 'body',
    },
    argTypes: {
        variant: { control: 'select', options: Object.keys(typography) },
        color: { control: 'color' },
    },
} satisfies Meta<typeof TheText>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }

export const Variants: Story = {
    name: 'Все варианты',
    render: () => (
        <View style={{ gap: 10 }}>
            {(Object.keys(typography) as (keyof typeof typography)[]).map((variant) => (
                <TheText key={variant} variant={variant}>
                    {variant} — Bench Press 82.5 kg
                </TheText>
            ))}
        </View>
    ),
}

export const Colors: Story = {
    name: 'Цвета',
    render: () => {
        function ColorSamples() {
            const theme = useTheme()
            const colors: { label: string; value: string }[] = [
                { label: 'ink', value: theme.colors.ink },
                { label: 'inkSecondary', value: theme.colors.inkSecondary },
                { label: 'inkTertiary', value: theme.colors.inkTertiary },
                { label: 'accentText', value: theme.colors.accentText },
                { label: 'success', value: theme.colors.success },
                { label: 'danger', value: theme.colors.danger },
            ]
            return (
                <View style={{ gap: 10 }}>
                    {colors.map(({ label, value }) => (
                        <TheText key={label} variant="headline" color={value}>
                            {label}
                        </TheText>
                    ))}
                </View>
            )
        }
        return <ColorSamples />
    },
}
