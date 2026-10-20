import type { StyleProp, ViewStyle } from 'react-native'

export type StatTileProps = {
    label: string
    value: string | number
    unit?: string
    /** Must start with "+" or "−"; colored AND signed. */
    delta?: string
    style?: StyleProp<ViewStyle>
}
