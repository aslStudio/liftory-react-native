import { render, screen } from '@/shared/lib/test-utils'

import { StreakCard } from './StreakCard'

describe('StreakCard', () => {
    it('renders the week count and pluralizes correctly', () => {
        render(<StreakCard weeks={8} completed={23} />)
        expect(screen.getByText('8 weeks on track')).toBeTruthy()
    })

    it('uses the singular form for one week', () => {
        render(<StreakCard weeks={1} completed={3} />)
        expect(screen.getByText('1 week on track')).toBeTruthy()
    })

    it('appends the best streak when given', () => {
        render(<StreakCard weeks={8} completed={23} best={11} />)
        expect(screen.getByText('23 planned workouts completed · Best 11')).toBeTruthy()
    })

    it('omits the best streak when not given', () => {
        render(<StreakCard weeks={8} completed={23} />)
        expect(screen.getByText('23 planned workouts completed')).toBeTruthy()
    })

    it('does not render a history bar without history', () => {
        render(<StreakCard weeks={8} completed={23} />)
        expect(screen.queryByLabelText(/Last \d+ weeks/)).toBeNull()
    })

    it('renders the history summary label', () => {
        render(<StreakCard weeks={8} completed={23} history={[true, false, 'freeze']} />)
        expect(screen.getByLabelText('Last 3 weeks')).toBeTruthy()
    })

    it('matches the snapshot with history', () => {
        const { toJSON } = render(
            <StreakCard
                weeks={8}
                completed={23}
                best={11}
                history={[false, true, true, true, 'freeze', true, true, true, true, true]}
            />,
        )
        expect(toJSON()).toMatchSnapshot()
    })

    it('matches the snapshot without history', () => {
        const { toJSON } = render(<StreakCard weeks={1} completed={3} />)
        expect(toJSON()).toMatchSnapshot()
    })
})
