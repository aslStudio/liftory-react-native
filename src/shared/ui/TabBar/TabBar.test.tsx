import { fireEvent, render, screen } from '@/shared/lib/test-utils'

import { TabBar } from './TabBar'

const items = [
    { id: 'today', label: 'Today', icon: 'calendar' as const },
    { id: 'progress', label: 'Progress', icon: 'chart' as const },
]

describe('TabBar', () => {
    it('renders every item as a tab', () => {
        render(<TabBar items={items} active="today" />)
        expect(screen.getByRole('tab', { name: 'Today' })).toBeTruthy()
        expect(screen.getByRole('tab', { name: 'Progress' })).toBeTruthy()
    })

    it('marks the active tab as selected', () => {
        render(<TabBar items={items} active="progress" />)
        expect(
            screen.getByRole('tab', { name: 'Progress' }).props.accessibilityState,
        ).toMatchObject({
            selected: true,
        })
        expect(screen.getByRole('tab', { name: 'Today' }).props.accessibilityState).toMatchObject({
            selected: false,
        })
    })

    it('calls onChange with the pressed tab id', () => {
        const onChange = jest.fn()
        render(<TabBar items={items} active="today" onChange={onChange} />)

        fireEvent.press(screen.getByRole('tab', { name: 'Progress' }))

        expect(onChange).toHaveBeenCalledWith('progress')
    })

    it('matches the snapshot', () => {
        const { toJSON } = render(<TabBar items={items} active="today" />)
        expect(toJSON()).toMatchSnapshot()
    })
})
