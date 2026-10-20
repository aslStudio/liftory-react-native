import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView } from 'react-native'
import { fn } from 'storybook/test'

import { useTheme } from '@/shared/lib/theme/use-theme'

import { RestTimer } from './RestTimer'

function Canvas({ children }: { children: React.ReactNode }) {
    const theme = useTheme()
    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: theme.colors.bg }}
            contentContainerStyle={{ padding: 20, gap: 20 }}
        >
            {children}
        </ScrollView>
    )
}

const meta = {
    title: 'Shared/RestTimer',
    component: RestTimer,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
    args: {
        remaining: 84,
        total: 120,
        next: 'Bench press · Set 3 · 82.5 kg',
        onMinus: fn(),
        onPlus: fn(),
        onSkip: fn(),
    },
} satisfies Meta<typeof RestTimer>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }

export const AlmostDone: Story = {
    name: 'Почти закончился',
    args: { remaining: 4 },
}

export const WithoutNext: Story = {
    name: 'Без следующего упражнения',
    args: { next: undefined },
}
