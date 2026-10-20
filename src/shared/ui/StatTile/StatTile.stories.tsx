import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView, View } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'

import { StatTile } from './StatTile'

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
    title: 'Shared/StatTile',
    component: StatTile,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
    args: {
        label: 'Record weight',
        value: '82.5',
        unit: 'kg',
        delta: '+2.5 kg',
    },
} satisfies Meta<typeof StatTile>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }

export const Grid: Story = {
    name: 'Сетка 2 в ряд',
    render: () => (
        <View style={{ flexDirection: 'row', gap: 8 }}>
            <StatTile label="Record weight" value="82.5" unit="kg" delta="+2.5 kg" />
            <StatTile label="Total volume" value="17 600" unit="kg" />
        </View>
    ),
}

export const NegativeDelta: Story = {
    name: 'Отрицательная дельта',
    args: { value: '80', delta: '−2.5 kg' },
}

export const WithoutDelta: Story = {
    name: 'Без дельты',
    args: { delta: undefined },
}
