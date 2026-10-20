import { fireEvent, render, screen } from '@/shared/lib/test-utils'

import { formatTime } from './model'
import { RestTimer } from './RestTimer'

describe('formatTime', () => {
    it('formats seconds as m:ss', () => {
        expect(formatTime(84)).toBe('1:24')
        expect(formatTime(5)).toBe('0:05')
        expect(formatTime(120)).toBe('2:00')
    })

    it('clamps negative values to zero', () => {
        expect(formatTime(-5)).toBe('0:00')
    })
})

describe('RestTimer', () => {
    it('exposes the remaining time via accessibility label', () => {
        render(<RestTimer remaining={84} total={120} />)
        expect(screen.getByLabelText('Rest 1:24')).toBeTruthy()
    })

    it('renders the formatted countdown', () => {
        render(<RestTimer remaining={84} total={120} />)
        expect(screen.getByText('1:24')).toBeTruthy()
    })

    it('renders the next exercise when given', () => {
        render(<RestTimer remaining={84} total={120} next="Bench press · Set 3 · 82.5 kg" />)
        expect(screen.getByText('Next: Bench press · Set 3 · 82.5 kg')).toBeTruthy()
    })

    it('calls onMinus/onPlus/onSkip', () => {
        const onMinus = jest.fn()
        const onPlus = jest.fn()
        const onSkip = jest.fn()
        render(
            <RestTimer
                remaining={84}
                total={120}
                onMinus={onMinus}
                onPlus={onPlus}
                onSkip={onSkip}
            />,
        )

        fireEvent.press(screen.getByLabelText('Minus 15 seconds'))
        fireEvent.press(screen.getByLabelText('Plus 15 seconds'))
        fireEvent.press(screen.getByLabelText('Skip rest'))

        expect(onMinus).toHaveBeenCalledTimes(1)
        expect(onPlus).toHaveBeenCalledTimes(1)
        expect(onSkip).toHaveBeenCalledTimes(1)
    })

    it('matches the snapshot with a next exercise', () => {
        const { toJSON } = render(
            <RestTimer remaining={84} total={120} next="Bench press · Set 3 · 82.5 kg" />,
        )
        expect(toJSON()).toMatchSnapshot()
    })

    it('matches the snapshot near the end of the rest', () => {
        const { toJSON } = render(<RestTimer remaining={2} total={120} />)
        expect(toJSON()).toMatchSnapshot()
    })
})
