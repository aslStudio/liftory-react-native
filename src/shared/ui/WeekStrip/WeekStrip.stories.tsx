import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView } from 'react-native'
import { fn } from 'storybook/test'

import { useTheme } from '@/shared/lib/theme/use-theme'

import type { WeekDay } from './model'
import { WeekStrip } from './WeekStrip'

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

const days: WeekDay[] = [
    { label: 'M', date: 22, state: 'done', tag: 'Push' },
    { label: 'T', date: 23, state: 'done', tag: 'Pull' },
    { label: 'W', date: 24, state: 'rest', tag: 'Rest' },
    { label: 'T', date: 25, state: 'missed', tag: 'Legs' },
    { label: 'F', date: 26, state: 'planned', tag: 'Push', today: true },
    { label: 'S', date: 27, state: 'planned', tag: 'Pull' },
    { label: 'S', date: 28, state: 'rest', tag: 'Rest' },
]

const meta = {
    title: 'Shared/WeekStrip',
    component: WeekStrip,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
    args: {
        days,
        onPressDay: fn(),
        onLongPressDay: fn(),
    },
} satisfies Meta<typeof WeekStrip>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }
