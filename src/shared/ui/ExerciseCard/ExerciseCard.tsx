import { View } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { Card } from '@/shared/ui/Card'
import { Chip } from '@/shared/ui/Chip'
import { Icon } from '@/shared/ui/Icon'
import { SetHeader, SetRow } from '@/shared/ui/SetRow'
import { TheButton } from '@/shared/ui/TheButton'
import { TheButtonIcon } from '@/shared/ui/TheButtonIcon'
import { TheText } from '@/shared/ui/TheText'

import type { ExerciseCardProps } from './model'
import { iconTileStyle, recommendationStyle } from './styles'

/** Active-workout exercise: header (swap / more) · recommendation strip · set table · Add Set. */
export function ExerciseCard({
    name,
    muscle,
    group,
    recommendation,
    sets = [],
    note,
    onAddSet,
    onReplace,
    onMore,
}: ExerciseCardProps) {
    const theme = useTheme()
    const c = theme.colors

    return (
        <Card gap={0}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 12,
                    marginBottom: 12,
                }}
            >
                <View style={iconTileStyle(theme)}>
                    <Icon name="dumbbell" size={22} color={c.accentText} />
                </View>
                <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                    {group ? (
                        <Chip tone="accent" label={group} style={{ marginBottom: 2 }} />
                    ) : null}
                    <TheText variant="headline">{name}</TheText>
                    {muscle ? (
                        <TheText variant="footnote" color={c.inkSecondary}>
                            {muscle}
                        </TheText>
                    ) : null}
                </View>
                <TheButtonIcon
                    icon="swap"
                    label="Replace exercise"
                    variant="plain"
                    size="sm"
                    onPress={onReplace}
                />
                <TheButtonIcon
                    icon="more"
                    label="Exercise options"
                    variant="plain"
                    size="sm"
                    onPress={onMore}
                />
            </View>

            {recommendation ? (
                <View style={recommendationStyle(theme)}>
                    <View style={{ paddingTop: 1 }}>
                        <Icon name="trend" size={18} color={c.accentText} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <TheText variant="caption2" color={c.accentText}>
                            Recommended
                        </TheText>
                        <TheText
                            style={{ marginTop: 2, fontVariant: ['tabular-nums'] }}
                            variant="headline"
                        >
                            {recommendation.value}
                        </TheText>
                        {recommendation.reason ? (
                            <TheText variant="footnote" color={c.inkSecondary}>
                                {recommendation.reason}
                            </TheText>
                        ) : null}
                    </View>
                </View>
            ) : null}

            <SetHeader />
            <View style={{ gap: 4 }}>
                {sets.map((set, index) => (
                    <SetRow key={index} {...set} />
                ))}
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    marginTop: 8,
                }}
            >
                <TheButton
                    title="Add Set"
                    variant="ghost"
                    size="sm"
                    icon="plus"
                    onPress={onAddSet}
                />
                {note ? (
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                            flexShrink: 1,
                        }}
                    >
                        <Icon name="note" size={14} color={c.inkSecondary} />
                        <TheText variant="footnote" color={c.inkSecondary} numberOfLines={1}>
                            {note}
                        </TheText>
                    </View>
                ) : null}
            </View>
        </Card>
    )
}
