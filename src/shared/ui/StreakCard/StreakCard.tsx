import { View } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { Card } from '@/shared/ui/Card'
import { Icon } from '@/shared/ui/Icon'
import { TheText } from '@/shared/ui/TheText'

import { FLAME_CIRCLE_SIZE, type StreakCardProps } from './model'
import { historyBarColor } from './styles'

/** Streak in weeks on plan (not daily workouts). */
export function StreakCard({ weeks, completed, best, history }: StreakCardProps) {
    const theme = useTheme()
    const c = theme.colors

    return (
        <Card gap={14}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View
                    style={{
                        width: FLAME_CIRCLE_SIZE,
                        height: FLAME_CIRCLE_SIZE,
                        borderRadius: FLAME_CIRCLE_SIZE / 2,
                        backgroundColor: c.accentSoft,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon name="flame" size={24} color={c.accentText} />
                </View>
                <View style={{ flex: 1 }}>
                    <TheText variant="numericLg">
                        {weeks}
                        <TheText variant="headline">
                            {weeks === 1 ? ' week on track' : ' weeks on track'}
                        </TheText>
                    </TheText>
                    <TheText variant="footnote" color={c.inkSecondary}>
                        {`${completed} planned workouts completed${best ? ` · Best ${best}` : ''}`}
                    </TheText>
                </View>
            </View>
            {history ? (
                <View
                    style={{ flexDirection: 'row', gap: 4 }}
                    accessible
                    accessibilityLabel={`Last ${history.length} weeks`}
                >
                    {history.map((entry, index) => (
                        <View
                            key={index}
                            style={{
                                flex: 1,
                                height: 6,
                                borderRadius: theme.radius.pill,
                                backgroundColor: historyBarColor(theme, entry),
                            }}
                        />
                    ))}
                </View>
            ) : null}
        </Card>
    )
}
