import { fireEvent, render, screen } from '@/shared/lib/test-utils'

import { ExerciseCard } from './ExerciseCard'

describe('ExerciseCard', () => {
    it('renders the exercise name and muscle group', () => {
        render(<ExerciseCard name="Barbell Bench Press" muscle="Chest · Triceps" />)
        expect(screen.getByText('Barbell Bench Press')).toBeTruthy()
        expect(screen.getByText('Chest · Triceps')).toBeTruthy()
    })

    it('renders the superset chip when a group is given', () => {
        render(<ExerciseCard name="Barbell Bench Press" group="Superset A" />)
        expect(screen.getByText('Superset A')).toBeTruthy()
    })

    it('never shows a recommendation without checking its reason', () => {
        render(
            <ExerciseCard
                name="Barbell Bench Press"
                recommendation={{ value: '82.5 kg × 6–8', reason: 'Top of range reached.' }}
            />,
        )
        expect(screen.getByText('82.5 kg × 6–8')).toBeTruthy()
        expect(screen.getByText('Top of range reached.')).toBeTruthy()
    })

    it('renders one SetRow per entry in sets', () => {
        render(
            <ExerciseCard
                name="Barbell Bench Press"
                sets={[
                    { index: 1, previous: '80 × 8', weight: '82.5', reps: '8' },
                    { index: 2, previous: '80 × 8', weight: '82.5', reps: '7' },
                ]}
            />,
        )
        expect(screen.getAllByLabelText('Weight, kg')).toHaveLength(2)
    })

    it('calls onAddSet when "Add Set" is pressed', () => {
        const onAddSet = jest.fn()
        render(<ExerciseCard name="Barbell Bench Press" onAddSet={onAddSet} />)

        fireEvent.press(screen.getByText('Add Set'))

        expect(onAddSet).toHaveBeenCalledTimes(1)
    })

    it('calls onReplace/onMore from the header icon buttons', () => {
        const onReplace = jest.fn()
        const onMore = jest.fn()
        render(<ExerciseCard name="Barbell Bench Press" onReplace={onReplace} onMore={onMore} />)

        fireEvent.press(screen.getByLabelText('Replace exercise'))
        fireEvent.press(screen.getByLabelText('Exercise options'))

        expect(onReplace).toHaveBeenCalledTimes(1)
        expect(onMore).toHaveBeenCalledTimes(1)
    })

    it('renders the note with its icon', () => {
        render(<ExerciseCard name="Barbell Bench Press" note="Pause 1s on chest" />)
        expect(screen.getByText('Pause 1s on chest')).toBeTruthy()
    })

    it('matches the snapshot fully populated', () => {
        const { toJSON } = render(
            <ExerciseCard
                name="Barbell Bench Press"
                muscle="Chest · Triceps"
                group="Superset A"
                recommendation={{
                    value: '82.5 kg × 6–8',
                    reason: 'Last time 80 kg × 8 on all sets — top of range reached.',
                }}
                note="Pause 1s on chest"
                sets={[
                    { type: 'warmup', previous: '40 × 10', weight: '40', reps: '10', done: true },
                    {
                        index: 1,
                        previous: '80 × 8',
                        weight: '82.5',
                        reps: '8',
                        rpe: '8',
                        done: true,
                        pr: true,
                    },
                    {
                        index: 2,
                        previous: '80 × 8',
                        suggested: { weight: '82.5', reps: '6–8', rpe: '9' },
                    },
                ]}
            />,
        )
        expect(toJSON()).toMatchSnapshot()
    })

    it('matches the snapshot minimal (no group, recommendation or note)', () => {
        const { toJSON } = render(<ExerciseCard name="Squat" />)
        expect(toJSON()).toMatchSnapshot()
    })
})
