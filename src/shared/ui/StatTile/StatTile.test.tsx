import { render, screen } from '@/shared/lib/test-utils'

import { StatTile } from './StatTile'

describe('StatTile', () => {
    it('renders the label and value', () => {
        render(<StatTile label="Record weight" value="82.5" />)
        expect(screen.getByText('Record weight')).toBeTruthy()
        expect(screen.getByText('82.5')).toBeTruthy()
    })

    it('renders the unit next to the value', () => {
        render(<StatTile label="Record weight" value="82.5" unit="kg" />)
        expect(screen.getByText(' kg')).toBeTruthy()
    })

    it('renders without a delta when none is given', () => {
        render(<StatTile label="Record weight" value="82.5" />)
        expect(screen.queryByText(/^[+−-]/)).toBeNull()
    })

    it('matches the snapshot with a positive delta', () => {
        const { toJSON } = render(
            <StatTile label="Record weight" value="82.5" unit="kg" delta="+2.5 kg" />,
        )
        expect(toJSON()).toMatchSnapshot()
    })

    it('matches the snapshot with a negative delta', () => {
        const { toJSON } = render(
            <StatTile label="Record weight" value="80" unit="kg" delta="−2.5 kg" />,
        )
        expect(toJSON()).toMatchSnapshot()
    })

    it('matches the snapshot without a unit or delta', () => {
        const { toJSON } = render(<StatTile label="Total volume" value="17 600" />)
        expect(toJSON()).toMatchSnapshot()
    })
})
