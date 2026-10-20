import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView, View } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'

import { SetHeader, SetRow } from './SetRow'

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
    title: 'Shared/SetRow',
    component: SetRow,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
    args: {
        index: 1,
        previous: '80 × 8',
    },
} satisfies Meta<typeof SetRow>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
    name: 'Песочница',
    render: (args) => (
        <View style={{ gap: 4 }}>
            <SetHeader />
            <SetRow {...args} />
        </View>
    ),
}

export const FullTable: Story = {
    name: 'Таблица подходов',
    render: () => (
        <View style={{ gap: 4 }}>
            <SetHeader />
            <SetRow type="warmup" previous="40 × 10" weight="40" reps="10" done />
            <SetRow index={1} previous="80 × 8" weight="82.5" reps="8" rpe="8" done pr />
            <SetRow index={2} previous="80 × 8" weight="82.5" reps="7" rpe="9" done />
            <SetRow
                index={3}
                previous="80 × 8"
                suggested={{ weight: '82.5', reps: '6–8', rpe: '9' }}
            />
        </View>
    ),
}
