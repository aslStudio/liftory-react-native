import { fireEvent, render, screen } from '@/shared/lib/test-utils'

import { List, ListCaption, ListRow } from './List'

describe('List', () => {
    it('renders its rows', () => {
        render(
            <List>
                <ListRow title="Bench press" />
                <ListRow title="Deadlift" />
            </List>,
        )
        expect(screen.getByText('Bench press')).toBeTruthy()
        expect(screen.getByText('Deadlift')).toBeTruthy()
    })

    it('matches the snapshot with two rows', () => {
        const { toJSON } = render(
            <List>
                <ListRow title="Bench press" subtitle="4 sets · 6–8 reps" accessory="drag" />
                <ListRow title="Deadlift" tone="accent" accessory="add" onPress={() => {}} />
            </List>,
        )
        expect(toJSON()).toMatchSnapshot()
    })
})

describe('ListCaption', () => {
    it('renders its text', () => {
        render(<ListCaption>Selected Exercises</ListCaption>)
        expect(screen.getByText('Selected Exercises')).toBeTruthy()
    })
})

describe('ListRow', () => {
    it('renders the subtitle and value', () => {
        render(<ListRow title="Bench press" subtitle="4 sets" value="82.5 kg" />)
        expect(screen.getByText('4 sets')).toBeTruthy()
        expect(screen.getByText('82.5 kg')).toBeTruthy()
    })

    it('is only pressable when given onPress', () => {
        const onPress = jest.fn()
        render(<ListRow title="Deadlift" onPress={onPress} />)

        fireEvent.press(screen.getByRole('button'))

        expect(onPress).toHaveBeenCalledTimes(1)
    })

    it('is not a button without onPress', () => {
        render(<ListRow title="Deadlift" />)
        expect(screen.queryByRole('button')).toBeNull()
    })

    it.each(['chevron', 'drag', 'add'] as const)(
        'matches the snapshot for accessory="%s"',
        (accessory) => {
            const { toJSON } = render(<ListRow title="Deadlift" accessory={accessory} />)
            expect(toJSON()).toMatchSnapshot()
        },
    )
})
