import type { StyleProp, ViewStyle } from 'react-native'

import type { IconName } from '@/shared/ui/Icon'

export type TheButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type TheButtonSize = 'sm' | 'md' | 'lg'

export type TheButtonProps = {
    title: string
    variant?: TheButtonVariant
    size?: TheButtonSize
    icon?: IconName
    /** Stretch to the parent's width instead of hugging the content. */
    block?: boolean
    disabled?: boolean
    onPress?: () => void
    style?: StyleProp<ViewStyle>
}

export const HEIGHT: Record<TheButtonSize, number> = { sm: 32, md: 44, lg: 52 }
export const PADDING_X: Record<TheButtonSize, number> = { sm: 14, md: 20, lg: 24 }
export const GHOST_PADDING_X = 8
export const ICON_SIZE: Record<TheButtonSize, number> = { sm: 16, md: 18, lg: 18 }
export const GAP: Record<TheButtonSize, number> = { sm: 6, md: 8, lg: 8 }
