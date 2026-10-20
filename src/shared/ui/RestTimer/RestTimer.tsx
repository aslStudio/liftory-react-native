import { Pressable, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { TheButtonIcon } from '@/shared/ui/TheButtonIcon'
import { TheText } from '@/shared/ui/TheText'

import {
    formatTime,
    type RestTimerProps,
    RING_CIRCUMFERENCE,
    RING_RADIUS,
    RING_SIZE,
    RING_STROKE_WIDTH,
} from './model'
import { adjustButtonStyle, containerStyle } from './styles'

/** Floating glass rest timer docked above the tab bar. Same content as the Live Activity. */
export function RestTimer({
    remaining,
    total,
    next,
    onMinus,
    onPlus,
    onSkip,
    style,
}: RestTimerProps) {
    const theme = useTheme()
    const c = theme.colors
    const fraction = total > 0 ? Math.min(1, remaining / total) : 0
    const center = RING_SIZE / 2

    const adjustButton = (label: '−15' | '+15', onPress?: () => void) => (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={label === '−15' ? 'Minus 15 seconds' : 'Plus 15 seconds'}
            onPress={onPress}
            style={adjustButtonStyle(theme)}
        >
            <TheText
                color={c.ink}
                style={{
                    fontSize: 13,
                    lineHeight: 18,
                    fontWeight: '600',
                    fontVariant: ['tabular-nums'],
                }}
            >
                {label}
            </TheText>
        </Pressable>
    )

    return (
        <View
            accessibilityRole="timer"
            accessibilityLabel={`Rest ${formatTime(remaining)}`}
            style={[containerStyle(theme), theme.shadow.elev2, style]}
        >
            <View
                style={{
                    width: RING_SIZE,
                    height: RING_SIZE,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Svg width={RING_SIZE} height={RING_SIZE} style={{ position: 'absolute' }}>
                    <Circle
                        cx={center}
                        cy={center}
                        r={RING_RADIUS}
                        stroke={c.surface3}
                        strokeWidth={RING_STROKE_WIDTH}
                        fill="none"
                    />
                    <Circle
                        cx={center}
                        cy={center}
                        r={RING_RADIUS}
                        stroke={c.accent}
                        strokeWidth={RING_STROKE_WIDTH}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
                        strokeDashoffset={RING_CIRCUMFERENCE * (1 - fraction)}
                        rotation={-90}
                        origin={`${center}, ${center}`}
                    />
                </Svg>
                <TheText
                    color={c.ink}
                    style={{
                        fontSize: 15,
                        lineHeight: 20,
                        fontWeight: '700',
                        fontVariant: ['tabular-nums'],
                    }}
                >
                    {formatTime(remaining)}
                </TheText>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
                <TheText variant="caption2" color={c.accentText}>
                    Rest
                </TheText>
                {next ? (
                    <TheText
                        variant="footnote"
                        color={c.ink}
                        style={{ marginTop: 2 }}
                        numberOfLines={2}
                    >
                        {`Next: ${next}`}
                    </TheText>
                ) : null}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {adjustButton('−15', onMinus)}
                {adjustButton('+15', onPlus)}
                <TheButtonIcon
                    icon="skip"
                    label="Skip rest"
                    variant="accent"
                    size="sm"
                    onPress={onSkip}
                />
            </View>
        </View>
    )
}
