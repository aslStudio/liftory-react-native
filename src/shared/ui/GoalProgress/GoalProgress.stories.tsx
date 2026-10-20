import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'

import { GoalProgress } from './GoalProgress'

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
    title: 'Shared/GoalProgress',
    component: GoalProgress,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
    args: {
        title: 'Bench Press 120 kg',
        subtitle: 'Exercise goal',
        kind: 'Max Weight',
        current: 82.5,
        target: 120,
        unit: 'kg',
    },
} satisfies Meta<typeof GoalProgress>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }

export const Reached: Story = {
    name: 'Цель достигнута',
    args: { current: 120 },
}
