import type { StyleProp, ViewStyle } from 'react-native'

import type { IconName } from '@/shared/ui/Icon'

export type ChipTone = 'neutral' | 'accent' | 'success' | 'pr' | 'solid'

export type ChipProps = {
    label: string
    tone?: ChipTone
    icon?: IconName
    style?: StyleProp<ViewStyle>
}

export const CHIP_HEIGHT = 22
export const CHIP_PADDING_X = 8
export const CHIP_GAP = 4
export const CHIP_ICON_SIZE = 12
export const CHIP_ICON_STROKE_WIDTH = 2.5
