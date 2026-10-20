import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { fn } from 'storybook/test'

import { useTheme } from '@/shared/lib/theme/use-theme'

import { SegmentedControl } from './SegmentedControl'

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
    title: 'Shared/SegmentedControl',
    component: SegmentedControl,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
    args: {
        options: ['Exercises', 'Stats'],
        onChange: fn(),
    },
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }

export const Controlled: Story = {
    name: 'Управляемый',
    render: (args) => {
        function Demo() {
            const [value, setValue] = useState(args.options[0])
            return <SegmentedControl options={args.options} value={value} onChange={setValue} />
        }
        return <Demo />
    },
}

export const ThreeOptions: Story = {
    name: 'Три сегмента',
    args: { options: ['Day', 'Week', 'Month'] },
}
