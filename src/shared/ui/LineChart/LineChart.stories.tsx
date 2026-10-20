import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { Card } from '@/shared/ui/Card'

import { LineChart } from './LineChart'

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
    title: 'Shared/LineChart',
    component: LineChart,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
    args: {
        points: [92, 94, 94, 97, 99, 100, 103],
        labels: ['Aug 4', '', 'Aug 18', '', 'Sep 1', '', 'Sep 15'],
        unit: 'kg',
        label: 'Estimated 1RM, kg',
    },
} satisfies Meta<typeof LineChart>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
    name: 'Песочница',
    render: (args) => (
        <Card title="Estimated 1RM" icon="trend">
            <LineChart {...args} />
        </Card>
    ),
}

export const InfoTone: Story = {
    name: 'Тон info',
    args: { tone: 'info' },
}

export const SinglePoint: Story = {
    name: 'Одна точка',
    args: { points: [100], labels: ['Sep 15'] },
}
