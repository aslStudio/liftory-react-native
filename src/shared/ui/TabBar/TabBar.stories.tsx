import type { Meta, StoryObj } from '@storybook/react-native'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import { fn } from 'storybook/test'

import { useTheme } from '@/shared/lib/theme/use-theme'

import { TabBar } from './TabBar'

function Canvas({ children }: { children: React.ReactNode }) {
    const theme = useTheme()
    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: theme.colors.bg }}
            contentContainerStyle={{ padding: 20, paddingTop: 80, gap: 20 }}
        >
            {children}
        </ScrollView>
    )
}

const items = [
    { id: 'today', label: 'Today', icon: 'calendar' as const },
    { id: 'programs', label: 'Programs', icon: 'dumbbell' as const },
    { id: 'progress', label: 'Progress', icon: 'chart' as const },
    { id: 'profile', label: 'Profile', icon: 'user' as const },
]

const meta = {
    title: 'Shared/TabBar',
    component: TabBar,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
    args: {
        items,
        active: 'today',
        onChange: fn(),
    },
} satisfies Meta<typeof TabBar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }

export const Controlled: Story = {
    name: 'Управляемый',
    render: (args) => {
        function Demo() {
            const [active, setActive] = useState(args.active)
            return <TabBar {...args} active={active} onChange={setActive} />
        }
        return <Demo />
    },
}
