import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView, Text, View } from 'react-native'

import { ICONS } from '@/shared/config/icons'
import { useTheme } from '@/shared/lib/theme/use-theme'

import { Icon } from './Icon'

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
    title: 'Shared/Icon',
    component: Icon,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
    args: {
        name: 'play',
        size: 24,
        strokeWidth: 2,
    },
    argTypes: {
        name: { control: 'select', options: Object.keys(ICONS) },
        size: { control: 'number' },
        strokeWidth: { control: 'number' },
        color: { control: 'color' },
    },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }

function AllIconsGrid() {
    const theme = useTheme()
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
            {Object.keys(ICONS).map((name) => (
                <View key={name} style={{ alignItems: 'center', gap: 6, width: 72 }}>
                    <Icon name={name as keyof typeof ICONS} size={24} />
                    <Text style={{ fontSize: 11, color: theme.colors.inkSecondary }}>{name}</Text>
                </View>
            ))}
        </View>
    )
}

export const AllIcons: Story = {
    name: 'Все иконки',
    render: () => <AllIconsGrid />,
}

export const Sizes: Story = {
    name: 'Размеры',
    render: (args) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            {[12, 16, 20, 24, 32, 48].map((size) => (
                <Icon {...args} key={size} size={size} />
            ))}
        </View>
    ),
}
