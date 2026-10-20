import { fireEvent, render, screen } from '@/shared/lib/test-utils'

import { SegmentedControl } from './SegmentedControl'

describe('SegmentedControl', () => {
    it('renders every option as a tab', () => {
        render(<SegmentedControl options={['Exercises', 'Stats']} />)
        expect(screen.getByRole('tab', { name: 'Exercises' })).toBeTruthy()
        expect(screen.getByRole('tab', { name: 'Stats' })).toBeTruthy()
    })

    it('defaults to selecting the first option uncontrolled', () => {
        render(<SegmentedControl options={['Exercises', 'Stats']} />)
        expect(
            screen.getByRole('tab', { name: 'Exercises' }).props.accessibilityState,
        ).toMatchObject({
            selected: true,
        })
    })

    it('respects a controlled value', () => {
        render(<SegmentedControl options={['Exercises', 'Stats']} value="Stats" />)
        expect(screen.getByRole('tab', { name: 'Stats' }).props.accessibilityState).toMatchObject({
            selected: true,
        })
    })

    it('calls onChange with the pressed option', () => {
        const onChange = jest.fn()
        render(
            <SegmentedControl
                options={['Exercises', 'Stats']}
                value="Exercises"
                onChange={onChange}
            />,
        )

        fireEvent.press(screen.getByRole('tab', { name: 'Stats' }))

        expect(onChange).toHaveBeenCalledWith('Stats')
    })

    it('matches the snapshot', () => {
        const { toJSON } = render(
            <SegmentedControl options={['Exercises', 'Stats']} value="Exercises" />,
        )
        expect(toJSON()).toMatchSnapshot()
    })
})
