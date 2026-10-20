import { StyleSheet } from 'react-native'

import { palette, type as typography } from '@/shared/config/theme'
import { render, screen } from '@/shared/lib/test-utils'

import { TheText } from './TheText'

function flatStyle(text: ReturnType<typeof screen.getByText>) {
    return StyleSheet.flatten(text.props.style)
}

describe('TheText', () => {
    it('renders its children', () => {
        render(<TheText>Hello</TheText>)
        expect(screen.getByText('Hello')).toBeTruthy()
    })

    it('defaults to the body variant and ink color', () => {
        render(<TheText>Hello</TheText>)
        expect(flatStyle(screen.getByText('Hello'))).toMatchObject({
            ...typography.body,
            color: palette.dark.ink,
        })
    })

    it('applies a custom variant', () => {
        render(<TheText variant="largeTitle">Hello</TheText>)
        expect(flatStyle(screen.getByText('Hello'))).toMatchObject(typography.largeTitle)
    })

    it('applies a custom color over the theme default', () => {
        render(<TheText color="#F98A2C">Hello</TheText>)
        expect(flatStyle(screen.getByText('Hello'))).toMatchObject({ color: '#F98A2C' })
    })

    it('forwards standard Text props', () => {
        render(<TheText numberOfLines={1}>Hello</TheText>)
        expect(screen.getByText('Hello').props.numberOfLines).toBe(1)
    })

    it.each(Object.keys(typography) as (keyof typeof typography)[])(
        'matches the snapshot for variant="%s"',
        (variant) => {
            const { toJSON } = render(<TheText variant={variant}>Sample</TheText>)
            expect(toJSON()).toMatchSnapshot()
        },
    )
})
