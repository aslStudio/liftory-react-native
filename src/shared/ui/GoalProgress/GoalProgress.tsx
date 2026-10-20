import { View } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { TheText } from '@/shared/ui/TheText'

import type { GoalProgressProps } from './model'
import { goalProgress, goalTone } from './styles'

/** Goal with % and a 6pt bar; turns green when reached. */
export function GoalProgress({ title, subtitle, current, target, unit, kind }: GoalProgressProps) {
    const theme = useTheme()
    const c = theme.colors
    const { fraction, reached } = goalProgress(current, target)
    const tone = goalTone(theme, reached)

    return (
        <View style={{ padding: 14, backgroundColor: c.surface2, borderRadius: theme.radius.md }}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 12,
                }}
            >
                <View style={{ flex: 1 }}>
                    <TheText variant="headline">{title}</TheText>
                    {subtitle ? (
                        <TheText variant="footnote" color={c.inkSecondary}>
                            {subtitle}
                        </TheText>
                    ) : null}
                </View>
                <TheText
                    color={reached ? c.success : c.accentText}
                    style={{
                        fontSize: 15,
                        lineHeight: 20,
                        fontWeight: '600',
                        fontVariant: ['tabular-nums'],
                    }}
                >
                    {Math.round(fraction * 100)}%
                </TheText>
            </View>
            <View
                accessible
                accessibilityRole="progressbar"
                accessibilityValue={{ min: 0, max: target, now: current }}
                style={{
                    height: 6,
                    marginTop: 12,
                    marginBottom: 8,
                    borderRadius: theme.radius.pill,
                    backgroundColor: c.surface3,
                    overflow: 'hidden',
                }}
            >
                <View
                    style={{
                        width: `${fraction * 100}%`,
                        height: '100%',
                        borderRadius: theme.radius.pill,
                        backgroundColor: tone,
                    }}
                />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TheText variant="caption" color={c.inkSecondary}>
                    {kind ?? ''}
                </TheText>
                <TheText variant="caption" style={{ fontVariant: ['tabular-nums'] }}>
                    {`${current} / ${target}${unit ? ' ' + unit : ''}`}
                </TheText>
            </View>
        </View>
    )
}
