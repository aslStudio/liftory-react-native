import { Text, View } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { TheText } from '@/shared/ui/TheText'

import type { StatTileProps } from './model'
import { isNegativeDelta, statTileContainerStyle } from './styles'

/** Label over a big tabular number. Lay out 2 per row with 8pt gaps. */
export function StatTile({ label, value, unit, delta, style }: StatTileProps) {
    const theme = useTheme()
    const c = theme.colors
    const negative = !!delta && isNegativeDelta(delta)

    return (
        <View style={[statTileContainerStyle(theme), style]}>
            <TheText variant="footnote" color={c.inkSecondary}>
                {label}
            </TheText>
            <Text numberOfLines={1} adjustsFontSizeToFit>
                <TheText variant="numericMd" color={c.ink}>
                    {value}
                </TheText>
                {unit ? (
                    <TheText
                        color={c.inkSecondary}
                        style={{ fontSize: 15, lineHeight: 20, fontWeight: '500' }}
                    >
                        {' ' + unit}
                    </TheText>
                ) : null}
            </Text>
            {delta ? (
                <TheText
                    color={negative ? c.danger : c.success}
                    style={{
                        fontSize: 12,
                        lineHeight: 16,
                        fontWeight: '600',
                        fontVariant: ['tabular-nums'],
                    }}
                >
                    {delta}
                </TheText>
            ) : null}
        </View>
    )
}
