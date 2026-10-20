import { fireEvent, render, screen } from '@/shared/lib/test-utils'

import { WorkoutRow } from './WorkoutRow'

describe('WorkoutRow', () => {
    it('renders the title', () => {
        render(<WorkoutRow title="Chest day" />)
        expect(screen.getByText('Chest day')).toBeTruthy()
    })

    it('shows "Not completed" by default', () => {
        render(<WorkoutRow title="Chest day" />)
        expect(screen.getByText('Not completed')).toBeTruthy()
    })

    it('shows "Completed this week" when done', () => {
        render(<WorkoutRow title="Back day" done />)
        expect(screen.getByText('Completed this week')).toBeTruthy()
    })

    it('shows a custom status over the default', () => {
        render(<WorkoutRow title="Leg day" status="Rescheduled to Friday" />)
        expect(screen.getByText('Rescheduled to Friday')).toBeTruthy()
    })

    it('calls onStart when the play button is pressed', () => {
        const onStart = jest.fn()
        render(<WorkoutRow title="Chest day" onStart={onStart} />)

        fireEvent.press(screen.getByLabelText('Start Chest day'))

        expect(onStart).toHaveBeenCalledTimes(1)
    })

    it('hides the delete button when onDelete is false', () => {
        render(<WorkoutRow title="Chest day" onDelete={false} />)
        expect(screen.queryByLabelText('Remove Chest day')).toBeNull()
    })

    it('matches the snapshot when not done', () => {
        const { toJSON } = render(<WorkoutRow title="Chest day" />)
        expect(toJSON()).toMatchSnapshot()
    })

    it('matches the snapshot when done', () => {
        const { toJSON } = render(<WorkoutRow title="Back day" done />)
        expect(toJSON()).toMatchSnapshot()
    })
})
