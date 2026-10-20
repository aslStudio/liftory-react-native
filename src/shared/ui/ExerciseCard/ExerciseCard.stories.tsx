import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView } from 'react-native'
import { fn } from 'storybook/test'

import { useTheme } from '@/shared/lib/theme/use-theme'

import { ExerciseCard } from './ExerciseCard'

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
    title: 'Shared/ExerciseCard',
    component: ExerciseCard,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
    args: {
        name: 'Barbell Bench Press',
        muscle: 'Chest · Triceps',
        onAddSet: fn(),
        onReplace: fn(),
        onMore: fn(),
    },
} satisfies Meta<typeof ExerciseCard>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
    name: 'Песочница',
    args: {
        group: 'Superset A',
        recommendation: {
            value: '82.5 kg × 6–8',
            reason: 'Last time 80 kg × 8 on all sets — top of range reached.',
        },
        note: 'Pause 1s on chest',
        sets: [
            { type: 'warmup', previous: '40 × 10', weight: '40', reps: '10', done: true },
            {
                index: 1,
                previous: '80 × 8',
                weight: '82.5',
                reps: '8',
                rpe: '8',
                done: true,
                pr: true,
            },
            { index: 2, previous: '80 × 8', weight: '82.5', reps: '7', rpe: '9', done: true },
            { index: 3, previous: '80 × 8', suggested: { weight: '82.5', reps: '6–8', rpe: '9' } },
        ],
    },
}

export const Minimal: Story = {
    name: 'Минимальная карточка',
    args: { name: 'Squat', muscle: undefined },
}
