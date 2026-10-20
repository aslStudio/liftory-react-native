import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

import type { IconName } from '@/shared/ui/Icon'

export type CardProps = {
    title?: string
    icon?: IconName
    action?: ReactNode
    children?: ReactNode
    /** Gap between children. Default 12. */
    gap?: number
    style?: StyleProp<ViewStyle>
}

export const DEFAULT_CARD_GAP = 12
export const CARD_PADDING = 16
export const CARD_HEADER_GAP = 8
export const CARD_HEADER_MARGIN_BOTTOM = 12
export const CARD_HEADER_MIN_HEIGHT = 32
