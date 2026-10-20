import { View } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { Icon } from '@/shared/ui/Icon'
import { TheButtonIcon } from '@/shared/ui/TheButtonIcon'
import { TheText } from '@/shared/ui/TheText'

import { CHECK_CIRCLE_SIZE, type WorkoutRowProps } from './model'
import { checkCircleStyle, rowContainerStyle } from './styles'

/** 22pt completion ring; filled orange with a check when done. */
export function CheckCircle({ done }: { done?: boolean }) {
    const theme = useTheme()
    const { borderColor, backgroundColor } = checkCircleStyle(theme, done)

    return (
        <View
            accessible
            accessibilityLabel={done ? 'Completed' : 'Not completed'}
            style={{
                width: CHECK_CIRCLE_SIZE,
                height: CHECK_CIRCLE_SIZE,
                borderRadius: CHECK_CIRCLE_SIZE / 2,
                borderWidth: 1.5,
                borderColor,
                backgroundColor,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {done ? (
                <Icon name="check" size={14} strokeWidth={3} color={theme.colors.onAccent} />
            ) : null}
        </View>
    )
}

/** Scheduled workout row (Today, each weekday): ring · name/status · play · trash. */
export function WorkoutRow({ title, done, status, onStart, onDelete }: WorkoutRowProps) {
    const theme = useTheme()

    return (
        <View style={rowContainerStyle(theme)}>
            <CheckCircle done={done} />
            <View style={{ flex: 1, minWidth: 0 }}>
                <TheText
                    color={theme.colors.ink}
                    numberOfLines={1}
                    style={{ fontSize: 16, lineHeight: 21, fontWeight: '500' }}
                >
                    {title}
                </TheText>
                <TheText variant="footnote" color={theme.colors.inkSecondary}>
                    {status ?? (done ? 'Completed this week' : 'Not completed')}
                </TheText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TheButtonIcon
                    icon="play"
                    label={`Start ${title}`}
                    variant="accent"
                    onPress={onStart}
                />
                {onDelete !== false ? (
                    <TheButtonIcon
                        icon="trash"
                        label={`Remove ${title}`}
                        size="sm"
                        onPress={onDelete || undefined}
                    />
                ) : null}
            </View>
        </View>
    )
}
