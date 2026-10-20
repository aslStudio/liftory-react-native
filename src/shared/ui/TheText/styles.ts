import type { StyleProp, TextStyle } from 'react-native'

import { type as typography } from '@/shared/config/theme'

import type { TheTextVariant } from './model'

export function buildTextStyle(
    variant: TheTextVariant,
    color: string,
    style?: StyleProp<TextStyle>,
): StyleProp<TextStyle> {
    return [typography[variant] as TextStyle, { color }, style]
}
