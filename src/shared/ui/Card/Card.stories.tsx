import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView, View } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { TheButtonIcon } from '@/shared/ui/TheButtonIcon'
import { TheText } from '@/shared/ui/TheText'

import { Card } from './Card'

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
    title: 'Shared/Card',
    component: Card,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
    args: {
        title: 'Stats',
        icon: 'chart',
    },
    argTypes: {
        icon: { control: 'select', options: [undefined, 'chart', 'trend', 'trophy'] },
        gap: { control: 'number' },
    },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
    name: 'Песочница',
    args: {
        children: <TheText>Record weight 82.5 kg</TheText>,
    },
}

export const WithAction: Story = {
    name: 'С действием в шапке',
    args: {
        action: <TheButtonIcon icon="plus" label="Add" size="sm" />,
        children: <TheText>Record weight 82.5 kg</TheText>,
    },
}

export const WithoutHeader: Story = {
    name: 'Без заголовка',
    args: {
        title: undefined,
        icon: undefined,
        children: <TheText>Body content without a header</TheText>,
    },
}

export const MultipleChildren: Story = {
    name: 'Несколько детей',
    args: {
        children: (
            <View style={{ gap: 12 }}>
                <TheText>Sessions — 12</TheText>
                <TheText>Total volume — 17 600 kg</TheText>
            </View>
        ),
    },
}
