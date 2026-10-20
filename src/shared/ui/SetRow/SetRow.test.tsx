import { fireEvent, render, screen } from '@/shared/lib/test-utils'

import { SetHeader, SetRow } from './SetRow'

describe('SetHeader', () => {
    it('renders the column labels (hidden from the a11y tree — importantForAccessibility="no-hide-descendants")', () => {
        render(<SetHeader />)
        const opts = { includeHiddenElements: true }
        expect(screen.getByText('Set', opts)).toBeTruthy()
        expect(screen.getByText('Previous', opts)).toBeTruthy()
        expect(screen.getByText('kg', opts)).toBeTruthy()
        expect(screen.getByText('Reps', opts)).toBeTruthy()
        expect(screen.getByText('RPE', opts)).toBeTruthy()
    })
})

describe('SetRow', () => {
    it('renders the set index as the badge for a working set', () => {
        render(<SetRow index={2} previous="80 × 8" />)
        expect(screen.getByText('2')).toBeTruthy()
    })

    it('renders "W" for a warmup set and "D" for a drop set', () => {
        render(<SetRow type="warmup" previous="40 × 10" />)
        expect(screen.getByText('W')).toBeTruthy()
    })

    it('falls back to an em dash when there is no previous value', () => {
        render(<SetRow index={1} />)
        expect(screen.getByText('—')).toBeTruthy()
    })

    it('is uncontrolled (defaultValue) without onChange', () => {
        render(<SetRow index={1} weight="82.5" />)
        expect(screen.getByLabelText('Weight, kg').props.defaultValue).toBe('82.5')
        expect(screen.getByLabelText('Weight, kg').props.value).toBeUndefined()
    })

    it('is controlled (value) with onChange and reports patches', () => {
        const onChange = jest.fn()
        render(<SetRow index={1} weight="82.5" onChange={onChange} />)

        fireEvent.changeText(screen.getByLabelText('Weight, kg'), '85')

        expect(onChange).toHaveBeenCalledWith({ weight: '85' })
        expect(screen.getByLabelText('Weight, kg').props.value).toBe('82.5')
    })

    it('shows the suggested values as placeholders', () => {
        render(<SetRow index={3} suggested={{ weight: '82.5', reps: '6–8', rpe: '9' }} />)
        expect(screen.getByLabelText('Weight, kg').props.placeholder).toBe('82.5')
    })

    it('calls onToggle when the check is pressed', () => {
        const onToggle = jest.fn()
        render(<SetRow index={1} onToggle={onToggle} />)

        fireEvent.press(screen.getByRole('button'))

        expect(onToggle).toHaveBeenCalledTimes(1)
    })

    it('exposes the done state via the checked accessibility state', () => {
        render(<SetRow index={1} done onToggle={jest.fn()} />)
        expect(screen.getByRole('button').props.accessibilityState).toMatchObject({ checked: true })
    })

    it.each(['warmup', 'working', 'drop'] as const)(
        'matches the snapshot for type="%s"',
        (type) => {
            const { toJSON } = render(<SetRow index={1} type={type} previous="80 × 8" />)
            expect(toJSON()).toMatchSnapshot()
        },
    )

    it('matches the snapshot when done', () => {
        const { toJSON } = render(<SetRow index={1} weight="82.5" reps="8" done />)
        expect(toJSON()).toMatchSnapshot()
    })

    it('matches the snapshot for a new PR', () => {
        const { toJSON } = render(<SetRow index={1} weight="82.5" reps="8" done pr />)
        expect(toJSON()).toMatchSnapshot()
    })
})
