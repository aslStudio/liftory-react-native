import type { TextProps } from 'react-native'

import type { TypeVariant } from '@/shared/config/theme'

export type TheTextVariant = TypeVariant

export type TheTextProps = TextProps & {
    /** Key into `theme.type.*` — defaults to `'body'`. */
    variant?: TheTextVariant
    /** Defaults to `theme.colors.ink`. */
    color?: string
}

export const DEFAULT_THE_TEXT_VARIANT: TheTextVariant = 'body'
