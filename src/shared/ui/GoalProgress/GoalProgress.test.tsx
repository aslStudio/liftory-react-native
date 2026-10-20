import { render, screen } from '@/shared/lib/test-utils'

import { GoalProgress } from './GoalProgress'

describe('GoalProgress', () => {
    it('renders the title and progress fraction', () => {
        render(<GoalProgress title="Bench Press 120 kg" current={82.5} target={120} />)
        expect(screen.getByText('Bench Press 120 kg')).toBeTruthy()
        expect(screen.getByText('69%')).toBeTruthy()
    })

    it('exposes the progress bar accessibility value', () => {
        render(<GoalProgress title="Bench Press 120 kg" current={82.5} target={120} />)
        expect(screen.getByRole('progressbar').props.accessibilityValue).toMatchObject({
            min: 0,
            max: 120,
            now: 82.5,
        })
    })

    it('renders current / target with the unit', () => {
        render(<GoalProgress title="Bench Press 120 kg" current={82.5} target={120} unit="kg" />)
        expect(screen.getByText('82.5 / 120 kg')).toBeTruthy()
    })

    it('shows 100% and the reached tone when the target is met', () => {
        render(<GoalProgress title="Bench Press 120 kg" current={120} target={120} />)
        expect(screen.getByText('100%')).toBeTruthy()
    })

    it('clamps progress at 100% past the target', () => {
        render(<GoalProgress title="Bench Press 120 kg" current={140} target={120} />)
        expect(screen.getByText('100%')).toBeTruthy()
    })

    it('matches the snapshot in progress', () => {
        const { toJSON } = render(
            <GoalProgress
                title="Bench Press 120 kg"
                subtitle="Exercise goal"
                kind="Max Weight"
                current={82.5}
                target={120}
                unit="kg"
            />,
        )
        expect(toJSON()).toMatchSnapshot()
    })

    it('matches the snapshot when reached', () => {
        const { toJSON } = render(
            <GoalProgress title="4 workouts / week" current={4} target={4} kind="Weekly goal" />,
        )
        expect(toJSON()).toMatchSnapshot()
    })
})
