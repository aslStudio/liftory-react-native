import type { StyleProp, ViewStyle } from 'react-native'

import type { IconName } from '@/shared/ui/Icon'

export type TabItem = { id: string; label: string; icon: IconName }

export type TabBarProps = {
    items: TabItem[]
    active: string
    onChange?: (id: string) => void
    style?: StyleProp<ViewStyle>
}

export const TAB_ICON_SIZE = 22
export const TAB_MIN_WIDTH = 76
