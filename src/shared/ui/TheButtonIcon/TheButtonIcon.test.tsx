import { fireEvent, render, screen } from '@/shared/lib/test-utils'

import { TheButtonIcon } from './TheButtonIcon'

describe('TheButtonIcon', () => {
    it('is announced to VoiceOver via its required label', () => {
        render(<TheButtonIcon icon="play" label="Start workout" onPress={jest.fn()} />)
        expect(screen.getByLabelText('Start workout')).toBeTruthy()
    })

    it('calls onPress when pressed', () => {
        const onPress = jest.fn()
        render(<TheButtonIcon icon="play" label="Start workout" onPress={onPress} />)

        fireEvent.press(screen.getByRole('button'))

        expect(onPress).toHaveBeenCalledTimes(1)
    })

    it.each(['accent', 'surface', 'glass', 'plain'] as const)(
        'matches the snapshot for variant="%s"',
        (variant) => {
            const { toJSON } = render(
                <TheButtonIcon
                    icon="play"
                    label="Start workout"
                    onPress={jest.fn()}
                    variant={variant}
                />,
            )
            expect(toJSON()).toMatchSnapshot()
        },
    )

    it.each(['sm', 'md', 'lg'] as const)('matches the snapshot for size="%s"', (size) => {
        const { toJSON } = render(
            <TheButtonIcon icon="play" label="Start workout" onPress={jest.fn()} size={size} />,
        )
        expect(toJSON()).toMatchSnapshot()
    })
})
