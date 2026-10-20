import type { StyleProp, ViewStyle } from 'react-native'

import type { IconName } from '@/shared/ui/Icon'

export type TheButtonIconVariant = 'accent' | 'surface' | 'glass' | 'plain'
export type TheButtonIconSize = 'sm' | 'md' | 'lg'

export type TheButtonIconProps = {
    icon: IconName
    /** Required for VoiceOver. */
    label: string
    variant?: TheButtonIconVariant
    size?: TheButtonIconSize
    onPress?: () => void
    style?: StyleProp<ViewStyle>
}

export const BOX: Record<TheButtonIconSize, number> = { sm: 32, md: 40, lg: 52 }
export const GLYPH: Record<TheButtonIconSize, number> = { sm: 16, md: 18, lg: 22 }
