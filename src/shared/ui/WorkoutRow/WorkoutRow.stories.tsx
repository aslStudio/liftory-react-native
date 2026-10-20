import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView, View } from 'react-native'
import { fn } from 'storybook/test'

import { useTheme } from '@/shared/lib/theme/use-theme'

import { WorkoutRow } from './WorkoutRow'

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
    title: 'Shared/WorkoutRow',
    component: WorkoutRow,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
    args: {
        title: 'Chest day',
        onStart: fn(),
    },
} satisfies Meta<typeof WorkoutRow>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }

export const States: Story = {
    name: 'Состояния',
    render: (args) => (
        <View style={{ gap: 8 }}>
            <WorkoutRow {...args} title="Chest day" />
            <WorkoutRow {...args} title="Back day" done />
            <WorkoutRow {...args} title="Leg day" status="Rescheduled to Friday" />
            <WorkoutRow {...args} title="Rest day" onDelete={false} />
        </View>
    ),
}
