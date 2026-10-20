import Svg from 'react-native-svg'

import { render } from '@/shared/lib/test-utils'

import { Icon } from './Icon'

describe('Icon', () => {
    it('is decorative (not announced) without a label', () => {
        const { UNSAFE_getByType } = render(<Icon name="play" />)
        const svg = UNSAFE_getByType(Svg)
        expect(svg.props.accessible).toBe(false)
    })

    it('is announced to VoiceOver when given a label', () => {
        const { getByLabelText } = render(<Icon name="trash" label="Delete set" />)
        expect(getByLabelText('Delete set')).toBeTruthy()
    })

    it.each(['play', 'pause', 'trash', 'check', 'trophy'] as const)(
        'matches the snapshot for name="%s"',
        (name) => {
            const { toJSON } = render(<Icon name={name} />)
            expect(toJSON()).toMatchSnapshot()
        },
    )

    it('matches the snapshot with a custom size and color', () => {
        const { toJSON } = render(<Icon name="flame" size={32} color="#F98A2C" strokeWidth={2.5} />)
        expect(toJSON()).toMatchSnapshot()
    })
})
