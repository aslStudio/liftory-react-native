import { StyleSheet } from 'react-native'

import type { Theme } from '@/shared/lib/theme/use-theme'

import {
    CARD_HEADER_GAP,
    CARD_HEADER_MARGIN_BOTTOM,
    CARD_HEADER_MIN_HEIGHT,
    CARD_PADDING,
} from './model'

export const useStyles = () =>
    StyleSheet.create({
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: CARD_HEADER_GAP,
            marginBottom: CARD_HEADER_MARGIN_BOTTOM,
            minHeight: CARD_HEADER_MIN_HEIGHT,
        },
        title: {
            flex: 1,
        },
    })

export function cardContainerStyle(theme: Theme) {
    return {
        backgroundColor: theme.colors.surface1,
        borderWidth: 1,
        borderColor: theme.colors.stroke,
        borderRadius: theme.radius.lg,
        padding: CARD_PADDING,
    }
}
