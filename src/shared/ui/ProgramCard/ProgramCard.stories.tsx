import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView } from 'react-native'
import { fn } from 'storybook/test'

import { useTheme } from '@/shared/lib/theme/use-theme'

import { ProgramCard } from './ProgramCard'

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
    title: 'Shared/ProgramCard',
    component: ProgramCard,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
    args: {
        name: 'Push / Pull / Legs',
        meta: '6 weeks · 6 workouts / week',
        week: 3,
        totalWeeks: 6,
        weekProgress: 0.5,
        next: 'Push — Today, 18:00',
        onStart: fn(),
    },
} satisfies Meta<typeof ProgramCard>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }

export const DeloadWeek: Story = {
    name: 'Deload неделя',
    args: { week: 6, deloadWeek: 6, next: 'Light Push — Today, 18:00' },
}

export const WithoutNext: Story = {
    name: 'Без следующей тренировки',
    args: { next: undefined },
}
