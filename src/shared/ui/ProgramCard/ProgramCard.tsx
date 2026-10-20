import { View } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { Card } from '@/shared/ui/Card'
import { Chip } from '@/shared/ui/Chip'
import { TheButton } from '@/shared/ui/TheButton'
import { TheText } from '@/shared/ui/TheText'

import { type ProgramCardProps, WEEK_SEGMENT_HEIGHT } from './model'
import { weekSegmentColor } from './styles'

/** Active Training Program on Today: week chip · name · week segments · next workout. */
export function ProgramCard({
    name,
    meta,
    week,
    totalWeeks,
    weekProgress = 0,
    deloadWeek,
    next,
    onStart,
}: ProgramCardProps) {
    const theme = useTheme()
    const c = theme.colors

    return (
        <Card gap={6}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
                <Chip tone="accent" label={`Week ${week} of ${totalWeeks}`} />
                {deloadWeek === week ? <Chip label="Deload" /> : null}
            </View>
            <TheText variant="title2" style={{ marginTop: 4 }}>
                {name}
            </TheText>
            {meta ? (
                <TheText variant="footnote" color={c.inkSecondary}>
                    {meta}
                </TheText>
            ) : null}
            <View
                style={{ flexDirection: 'row', gap: 4, marginTop: 10, marginBottom: 6 }}
                accessible
                accessibilityLabel={`Week ${week} of ${totalWeeks}`}
            >
                {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((weekNumber) => (
                    <View
                        key={weekNumber}
                        style={{
                            flex: 1,
                            height: WEEK_SEGMENT_HEIGHT,
                            borderRadius: theme.radius.pill,
                            overflow: 'hidden',
                            backgroundColor: weekSegmentColor(theme, weekNumber, week, deloadWeek),
                        }}
                    >
                        {weekNumber === week ? (
                            <View
                                style={{
                                    width: `${Math.round(weekProgress * 100)}%`,
                                    height: '100%',
                                    backgroundColor: c.accent,
                                    borderRadius: theme.radius.pill,
                                }}
                            />
                        ) : null}
                    </View>
                ))}
            </View>
            {next ? (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        marginTop: 6,
                        paddingTop: 12,
                        borderTopWidth: 1,
                        borderTopColor: c.stroke,
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <TheText variant="caption2" color={c.inkSecondary}>
                            Next
                        </TheText>
                        <TheText style={{ fontSize: 16, lineHeight: 21, fontWeight: '500' }}>
                            {next}
                        </TheText>
                    </View>
                    <TheButton title="Start" size="sm" icon="play" onPress={onStart} />
                </View>
            ) : null}
        </Card>
    )
}
