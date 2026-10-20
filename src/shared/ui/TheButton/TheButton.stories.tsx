import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView, View } from 'react-native'
import { fn } from 'storybook/test'

import { useTheme } from '@/shared/lib/theme/use-theme'

import { TheButton } from './TheButton'

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
    title: 'Shared/TheButton',
    component: TheButton,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
    args: {
        title: 'Start Workout',
        variant: 'primary',
        size: 'md',
        block: false,
        disabled: false,
        onPress: fn(),
    },
    argTypes: {
        variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
        size: { control: 'select', options: ['sm', 'md', 'lg'] },
        icon: { control: 'select', options: [undefined, 'play', 'plus'] },
        block: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
} satisfies Meta<typeof TheButton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: 'Песочница' }

export const Variants: Story = {
    name: 'Варианты',
    render: (args) => (
        <View style={{ gap: 16, alignItems: 'flex-start' }}>
            {(['primary', 'secondary', 'ghost', 'danger'] as const).map((variant) => (
                <TheButton
                    {...args}
                    key={variant}
                    variant={variant}
                    title={`Button / ${variant}`}
                />
            ))}
        </View>
    ),
}

export const Sizes: Story = {
    name: 'Размеры',
    render: (args) => (
        <View style={{ gap: 16, alignItems: 'flex-start' }}>
            {(['sm', 'md', 'lg'] as const).map((size) => (
                <TheButton {...args} key={size} size={size} title={`Размер ${size}`} />
            ))}
        </View>
    ),
}

export const WithIcon: Story = {
    name: 'С иконкой',
    args: { icon: 'play' },
}

export const Block: Story = {
    name: 'На всю ширину',
    args: { block: true },
}

export const Disabled: Story = {
    name: 'Заблокирована',
    args: { disabled: true },
}
