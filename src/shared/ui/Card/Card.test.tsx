import { Text } from 'react-native'

import { render, screen } from '@/shared/lib/test-utils'

import { Card } from './Card'

describe('Card', () => {
    it('renders its children', () => {
        render(
            <Card>
                <Text>Body content</Text>
            </Card>,
        )
        expect(screen.getByText('Body content')).toBeTruthy()
    })

    it('renders no header when there is no title', () => {
        render(
            <Card>
                <Text>Body content</Text>
            </Card>,
        )
        expect(screen.queryByRole('header')).toBeNull()
    })

    it('renders the title as an accessibility header', () => {
        render(<Card title="Stats" />)
        expect(screen.getByRole('header', { name: 'Stats' })).toBeTruthy()
    })

    it('renders the action slot next to the title', () => {
        render(<Card title="Stats" action={<Text>Add</Text>} />)
        expect(screen.getByText('Add')).toBeTruthy()
    })

    it('matches the snapshot with a title, icon and action', () => {
        const { toJSON } = render(
            <Card title="Stats" icon="chart" action={<Text>Add</Text>}>
                <Text>Body content</Text>
            </Card>,
        )
        expect(toJSON()).toMatchSnapshot()
    })

    it('matches the snapshot without a header', () => {
        const { toJSON } = render(
            <Card>
                <Text>Body content</Text>
            </Card>,
        )
        expect(toJSON()).toMatchSnapshot()
    })
})
