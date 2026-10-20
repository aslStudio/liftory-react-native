import { fireEvent, render, screen } from '@/shared/lib/test-utils'

import type { WeekDay } from './model'
import { WeekStrip } from './WeekStrip'

const days: WeekDay[] = [
    { label: 'M', date: 22, state: 'done', tag: 'Push' },
    { label: 'T', date: 23, state: 'done', tag: 'Pull' },
    { label: 'W', date: 24, state: 'rest', tag: 'Rest' },
    { label: 'T', date: 25, state: 'missed', tag: 'Legs' },
    { label: 'F', date: 26, state: 'planned', tag: 'Push', today: true },
    { label: 'S', date: 27, state: 'planned', tag: 'Pull' },
    { label: 'S', date: 28, state: 'rest', tag: 'Rest' },
]

describe('WeekStrip', () => {
    it('renders a column for every day', () => {
        render(<WeekStrip days={days} />)
        expect(screen.getAllByText(/Push|Pull|Rest|Legs/).length).toBeGreaterThanOrEqual(7)
    })

    it('shows the date instead of a checkmark unless done', () => {
        render(<WeekStrip days={days} />)
        expect(screen.getByText('24')).toBeTruthy()
    })

    it('calls onPressDay with the pressed index', () => {
        const onPressDay = jest.fn()
        render(<WeekStrip days={days} onPressDay={onPressDay} />)

        fireEvent.press(screen.getByLabelText('M 22, Push done'))

        expect(onPressDay).toHaveBeenCalledWith(0)
    })

    it('calls onLongPressDay with the pressed index', () => {
        const onLongPressDay = jest.fn()
        render(<WeekStrip days={days} onLongPressDay={onLongPressDay} />)

        fireEvent(screen.getByLabelText('M 22, Push done'), 'longPress')

        expect(onLongPressDay).toHaveBeenCalledWith(0)
    })

    it('matches the snapshot', () => {
        const { toJSON } = render(<WeekStrip days={days} />)
        expect(toJSON()).toMatchSnapshot()
    })
})
