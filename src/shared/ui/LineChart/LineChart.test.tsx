import Svg from 'react-native-svg'

import { fireEvent, render, screen } from '@/shared/lib/test-utils'

import { LineChart } from './LineChart'

function layout(width: number) {
    return { nativeEvent: { layout: { x: 0, y: 0, width, height: 140 } } }
}

describe('LineChart', () => {
    it('is accessible via its label', () => {
        render(<LineChart points={[1, 2, 3]} label="Estimated 1RM" />)
        expect(screen.getByLabelText('Estimated 1RM')).toBeTruthy()
    })

    it('renders nothing inside until a layout width is known', () => {
        const { toJSON } = render(<LineChart points={[1, 2, 3]} />)
        expect(toJSON()).toMatchSnapshot('before layout')
    })

    it('renders the SVG once a layout width is measured', () => {
        render(<LineChart points={[92, 94, 97, 103]} />)
        fireEvent(screen.getByLabelText('Chart'), 'layout', layout(300))
        expect(screen.UNSAFE_getByType(Svg)).toBeTruthy()
    })

    it('matches the snapshot with labels and a unit after layout', () => {
        const { toJSON } = render(
            <LineChart
                points={[92, 94, 94, 97, 99, 100, 103]}
                labels={['Aug 4', '', 'Aug 18', '', 'Sep 1', '', 'Sep 15']}
                unit="kg"
                label="Estimated 1RM, kg"
            />,
        )
        fireEvent(screen.getByLabelText('Estimated 1RM, kg'), 'layout', layout(300))
        expect(toJSON()).toMatchSnapshot('after layout')
    })

    it('matches the snapshot with a single point', () => {
        const { toJSON } = render(<LineChart points={[100]} />)
        fireEvent(screen.getByLabelText('Chart'), 'layout', layout(300))
        expect(toJSON()).toMatchSnapshot('single point')
    })

    it('matches the snapshot with the info tone', () => {
        const { toJSON } = render(<LineChart points={[1, 2, 3]} tone="info" />)
        fireEvent(screen.getByLabelText('Chart'), 'layout', layout(300))
        expect(toJSON()).toMatchSnapshot('info tone')
    })
})
