import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView, View } from 'react-native'
import { fn } from 'storybook/test'

import { useTheme } from '@/shared/lib/theme/use-theme'

import { TheButtonIcon } from './TheButtonIcon'

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
    title: 'Shared/TheButtonIcon',
    component: TheButtonIcon,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
    args: {
        icon: 'play',
        label: 'Start workout',
        variant: 'surface',
        size: 'md',
        onPress: fn(),
    },
    argTypes: {
        icon: { control: 'select', options: ['play', 'pause', 'skip', 'trash', 'plus'] },
        variant: { control: 'select', options: ['accent', 'surface', 'glass', 'plain'] },
        size: { control: 'select', options: ['sm', 'md', 'lg'] },
    },
} satisfies Meta<typeof TheButtonIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }

export const Variants: Story = {
    name: 'Варианты',
    render: (args) => (
        <View style={{ flexDirection: 'row', gap: 16 }}>
            {(['accent', 'surface', 'glass', 'plain'] as const).map((variant) => (
                <TheButtonIcon {...args} key={variant} variant={variant} />
            ))}
        </View>
    ),
}

export const Sizes: Story = {
    name: 'Размеры',
    render: (args) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            {(['sm', 'md', 'lg'] as const).map((size) => (
                <TheButtonIcon {...args} key={size} size={size} />
            ))}
        </View>
    ),
}
