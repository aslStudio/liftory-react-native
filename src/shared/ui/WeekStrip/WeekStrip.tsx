import { Pressable, View } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { Icon } from '@/shared/ui/Icon'
import { TheText } from '@/shared/ui/TheText'

import { DOT_SIZE, TODAY_RING_SIZE, type WeekStripProps } from './model'
import { dayDotColors } from './styles'

/** 7 equal columns: weekday letter · 36pt day circle · workout tag. */
export function WeekStrip({ days, onPressDay, onLongPressDay }: WeekStripProps) {
    const theme = useTheme()

    return (
        <View style={{ flexDirection: 'row', gap: 4 }}>
            {days.map((day, index) => {
                const state = day.state ?? 'empty'
                const dot = dayDotColors(theme, state)
                return (
                    <Pressable
                        key={index}
                        onPress={() => onPressDay?.(index)}
                        onLongPress={() => onLongPressDay?.(index)}
                        accessibilityLabel={`${day.label} ${day.date}, ${day.tag ?? ''} ${state}`}
                        style={{ flex: 1, alignItems: 'center', gap: 6 }}
                    >
                        <TheText
                            color={day.today ? theme.colors.ink : theme.colors.inkSecondary}
                            style={{
                                fontSize: 12,
                                lineHeight: 16,
                                fontWeight: day.today ? '700' : '500',
                            }}
                        >
                            {day.label}
                        </TheText>
                        {/* Today ring: 1.5pt ink ring with a 2pt gap around the 36pt dot */}
                        <View
                            style={{
                                width: TODAY_RING_SIZE,
                                height: TODAY_RING_SIZE,
                                borderRadius: TODAY_RING_SIZE / 2,
                                borderWidth: 1.5,
                                borderColor: day.today ? theme.colors.ink : 'transparent',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <View
                                style={{
                                    width: DOT_SIZE,
                                    height: DOT_SIZE,
                                    borderRadius: DOT_SIZE / 2,
                                    borderWidth: 1.5,
                                    borderColor: dot.border,
                                    backgroundColor: dot.background,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {state === 'done' ? (
                                    <Icon
                                        name="check"
                                        size={16}
                                        strokeWidth={3}
                                        color={dot.foreground}
                                    />
                                ) : (
                                    <TheText
                                        color={dot.foreground}
                                        style={{
                                            fontSize: 15,
                                            lineHeight: 20,
                                            fontWeight: '600',
                                            fontVariant: ['tabular-nums'],
                                            textDecorationLine:
                                                state === 'missed' ? 'line-through' : 'none',
                                        }}
                                    >
                                        {day.date}
                                    </TheText>
                                )}
                            </View>
                        </View>
                        <TheText
                            color={theme.colors.inkSecondary}
                            numberOfLines={1}
                            style={{
                                fontSize: 11,
                                lineHeight: 13,
                                fontWeight: '500',
                                minHeight: 13,
                            }}
                        >
                            {day.tag ?? ''}
                        </TheText>
                    </Pressable>
                )
            })}
        </View>
    )
}
