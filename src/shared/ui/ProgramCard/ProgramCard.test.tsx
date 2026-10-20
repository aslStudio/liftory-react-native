import { fireEvent, render, screen } from '@/shared/lib/test-utils'

import { ProgramCard } from './ProgramCard'

describe('ProgramCard', () => {
    it('renders the program name and week chip', () => {
        render(<ProgramCard name="Push / Pull / Legs" week={3} totalWeeks={6} />)
        expect(screen.getByText('Push / Pull / Legs')).toBeTruthy()
        expect(screen.getByText('Week 3 of 6')).toBeTruthy()
    })

    it('renders a Deload chip only on the deload week', () => {
        render(<ProgramCard name="Push / Pull / Legs" week={6} totalWeeks={6} deloadWeek={6} />)
        expect(screen.getByText('Deload')).toBeTruthy()
    })

    it('does not render a Deload chip outside the deload week', () => {
        render(<ProgramCard name="Push / Pull / Legs" week={3} totalWeeks={6} deloadWeek={6} />)
        expect(screen.queryByText('Deload')).toBeNull()
    })

    it('renders the meta line when given', () => {
        render(
            <ProgramCard
                name="Push / Pull / Legs"
                week={3}
                totalWeeks={6}
                meta="6 weeks · 6 workouts / week"
            />,
        )
        expect(screen.getByText('6 weeks · 6 workouts / week')).toBeTruthy()
    })

    it('renders the Next section with a Start button only when next is given', () => {
        render(
            <ProgramCard
                name="Push / Pull / Legs"
                week={3}
                totalWeeks={6}
                next="Push — Today, 18:00"
            />,
        )
        expect(screen.getByText('Push — Today, 18:00')).toBeTruthy()
        expect(screen.getByText('Start')).toBeTruthy()
    })

    it('does not render the Next section without next', () => {
        render(<ProgramCard name="Push / Pull / Legs" week={3} totalWeeks={6} />)
        expect(screen.queryByText('Start')).toBeNull()
    })

    it('calls onStart when Start is pressed', () => {
        const onStart = jest.fn()
        render(
            <ProgramCard
                name="Push / Pull / Legs"
                week={3}
                totalWeeks={6}
                next="Push — Today, 18:00"
                onStart={onStart}
            />,
        )

        fireEvent.press(screen.getByText('Start'))

        expect(onStart).toHaveBeenCalledTimes(1)
    })

    it('matches the snapshot fully populated', () => {
        const { toJSON } = render(
            <ProgramCard
                name="Push / Pull / Legs"
                meta="6 weeks · 6 workouts / week"
                week={3}
                totalWeeks={6}
                weekProgress={0.5}
                deloadWeek={6}
                next="Push — Today, 18:00"
            />,
        )
        expect(toJSON()).toMatchSnapshot()
    })

    it('matches the snapshot minimal', () => {
        const { toJSON } = render(<ProgramCard name="Push / Pull / Legs" week={1} totalWeeks={6} />)
        expect(toJSON()).toMatchSnapshot()
    })
})
