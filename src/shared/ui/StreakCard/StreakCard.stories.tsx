import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'

import { StreakCard } from './StreakCard'

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
    title: 'Shared/StreakCard',
    component: StreakCard,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
    args: {
        weeks: 8,
        completed: 23,
        best: 11,
        history: [false, true, true, true, 'freeze', true, true, true, true, true],
    },
} satisfies Meta<typeof StreakCard>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }

export const WithoutHistory: Story = {
    name: 'Без истории недель',
    args: { history: undefined },
}

export const SingleWeek: Story = {
    name: 'Одна неделя',
    args: { weeks: 1, completed: 3, best: undefined, history: undefined },
}
