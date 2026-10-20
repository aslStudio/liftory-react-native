import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView, View } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'

import { Chip } from './Chip'

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
    title: 'Shared/Chip',
    component: Chip,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
    args: {
        label: 'Week 3 of 6',
        tone: 'neutral',
    },
    argTypes: {
        tone: { control: 'select', options: ['neutral', 'accent', 'success', 'pr', 'solid'] },
        icon: { control: 'select', options: [undefined, 'trophy', 'trend'] },
    },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }

export const Tones: Story = {
    name: 'Тона',
    render: () => (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Chip label="Warm-up" tone="neutral" />
            <Chip tone="accent" label="Week 3 of 6" />
            <Chip tone="success" icon="trend" label="+2.5 kg" />
            <Chip tone="pr" icon="trophy" label="New PR" />
            <Chip tone="solid" label="Deload" />
        </View>
    ),
}
