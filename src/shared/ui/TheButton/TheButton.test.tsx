import { fireEvent, render, screen } from '@/shared/lib/test-utils'

import { TheButton } from './TheButton'

describe('TheButton', () => {
    it('renders its title', () => {
        render(<TheButton title="Start Workout" onPress={jest.fn()} />)
        expect(screen.getByText('Start Workout')).toBeTruthy()
    })

    it('calls onPress when pressed', () => {
        const onPress = jest.fn()
        render(<TheButton title="Start Workout" onPress={onPress} />)

        fireEvent.press(screen.getByRole('button'))

        expect(onPress).toHaveBeenCalledTimes(1)
    })

    it('does not call onPress when disabled', () => {
        const onPress = jest.fn()
        render(<TheButton title="Start Workout" onPress={onPress} disabled />)

        fireEvent.press(screen.getByRole('button'))

        expect(onPress).not.toHaveBeenCalled()
    })

    it('exposes the disabled accessibility state', () => {
        render(<TheButton title="Start Workout" onPress={jest.fn()} disabled />)
        expect(screen.getByRole('button').props.accessibilityState).toMatchObject({
            disabled: true,
        })
    })

    it.each(['primary', 'secondary', 'ghost', 'danger'] as const)(
        'matches the snapshot for variant="%s"',
        (variant) => {
            const { toJSON } = render(
                <TheButton title="Start Workout" onPress={jest.fn()} variant={variant} />,
            )
            expect(toJSON()).toMatchSnapshot()
        },
    )

    it.each(['sm', 'md', 'lg'] as const)('matches the snapshot for size="%s"', (size) => {
        const { toJSON } = render(
            <TheButton title="Start Workout" onPress={jest.fn()} size={size} />,
        )
        expect(toJSON()).toMatchSnapshot()
    })

    it('matches the snapshot with an icon', () => {
        const { toJSON } = render(
            <TheButton title="Start Workout" onPress={jest.fn()} icon="play" />,
        )
        expect(toJSON()).toMatchSnapshot()
    })

    it('matches the snapshot when blocked to full width', () => {
        const { toJSON } = render(<TheButton title="Start Workout" onPress={jest.fn()} block />)
        expect(toJSON()).toMatchSnapshot()
    })
})
