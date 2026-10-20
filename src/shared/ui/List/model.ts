import type { StyleProp, ViewStyle } from 'react-native'

import type { IconName } from '@/shared/ui/Icon'

export type ListAccessory = 'chevron' | 'drag' | 'add'

export const ACCESSORY_ICON: Record<ListAccessory, IconName> = {
    chevron: 'chevron-right',
    drag: 'grip',
    add: 'plus-circle',
}

export type ListProps = {
    children: React.ReactNode
    style?: StyleProp<ViewStyle>
}

export type ListRowProps = {
    title: string
    subtitle?: string
    value?: string
    icon?: IconName
    accessory?: ListAccessory
    /** `accent` = an item you can add (Create Workout → All Exercises). */
    tone?: 'default' | 'accent'
    onPress?: () => void
}
