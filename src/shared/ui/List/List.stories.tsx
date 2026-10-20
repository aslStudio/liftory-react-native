import type { Meta, StoryObj } from '@storybook/react-native'
import { ScrollView, View } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'

import { List, ListCaption, ListRow } from './List'

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
    title: 'Shared/List',
    component: List,
    decorators: [
        (Story) => (
            <Canvas>
                <Story />
            </Canvas>
        ),
    ],
    args: {
        children: null,
    },
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
    name: 'Песочница',
    render: () => (
        <View style={{ gap: 12 }}>
            <ListCaption>Selected Exercises</ListCaption>
            <List>
                <ListRow title="Bench press" subtitle="4 sets · 6–8 reps" accessory="drag" />
                <ListRow
                    title="Incline dumbbell press"
                    subtitle="3 sets · 8–10 reps"
                    accessory="drag"
                />
            </List>
            <ListCaption>All Exercises</ListCaption>
            <List>
                <ListRow title="Bent-over row" tone="accent" accessory="add" onPress={() => {}} />
                <ListRow title="Deadlift" tone="accent" accessory="add" onPress={() => {}} />
            </List>
        </View>
    ),
}

export const Accessories: Story = {
    name: 'Аксессуары',
    render: () => (
        <List>
            <ListRow title="Chevron" accessory="chevron" onPress={() => {}} />
            <ListRow title="Drag" accessory="drag" />
            <ListRow title="Add" tone="accent" accessory="add" onPress={() => {}} />
        </List>
    ),
}

export const WithValue: Story = {
    name: 'Со значением справа',
    render: () => (
        <List>
            <ListRow title="Bench press" value="82.5 kg" />
            <ListRow title="Deadlift" value="140 kg" />
        </List>
    ),
}
