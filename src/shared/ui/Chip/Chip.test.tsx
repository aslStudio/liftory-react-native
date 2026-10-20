import { render, screen } from '@/shared/lib/test-utils'

import { Chip } from './Chip'

describe('Chip', () => {
    it('renders its label', () => {
        render(<Chip label="Week 3 of 6" />)
        expect(screen.getByText('Week 3 of 6')).toBeTruthy()
    })

    it.each(['neutral', 'accent', 'success', 'pr', 'solid'] as const)(
        'matches the snapshot for tone="%s"',
        (tone) => {
            const { toJSON } = render(<Chip label="New PR" tone={tone} />)
            expect(toJSON()).toMatchSnapshot()
        },
    )

    it('matches the snapshot with an icon', () => {
        const { toJSON } = render(<Chip label="New PR" tone="pr" icon="trophy" />)
        expect(toJSON()).toMatchSnapshot()
    })
})
