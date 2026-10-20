import { View } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { Icon } from '@/shared/ui/Icon'
import { TheText } from '@/shared/ui/TheText'

import { type CardProps, DEFAULT_CARD_GAP } from './model'
import { cardContainerStyle, useStyles } from './styles'

/** surface-1 section: 20pt radius, 1pt hairline, 16pt padding. Never nest cards. */
export function Card({ title, icon, action, children, gap = DEFAULT_CARD_GAP, style }: CardProps) {
    const theme = useTheme()
    const styles = useStyles()

    return (
        <View style={[cardContainerStyle(theme), style]}>
            {title ? (
                <View style={styles.header}>
                    {icon ? <Icon name={icon} size={18} /> : null}
                    <TheText variant="headline" style={styles.title} accessibilityRole="header">
                        {title}
                    </TheText>
                    {action}
                </View>
            ) : null}
            <View style={{ gap }}>{children}</View>
        </View>
    )
}
