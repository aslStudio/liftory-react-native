import { Pressable, TextInput, View } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { Icon } from '@/shared/ui/Icon'
import { TheText } from '@/shared/ui/TheText'

import { SET_COLUMNS, type SetRowProps, type SetValues } from './model'
import { badgeColors, rowColors } from './styles'

export function SetHeader() {
    const theme = useTheme()
    const color = theme.colors.inkSecondary
    const k = SET_COLUMNS

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: k.gap,
                paddingHorizontal: k.padX,
                paddingBottom: 4,
            }}
            importantForAccessibility="no-hide-descendants"
        >
            <TheText variant="caption2" color={color} style={{ width: k.badge }}>
                Set
            </TheText>
            <TheText variant="caption2" color={color} style={{ flex: 1 }}>
                Previous
            </TheText>
            <TheText
                variant="caption2"
                color={color}
                style={{ width: k.weight, textAlign: 'center' }}
            >
                kg
            </TheText>
            <TheText
                variant="caption2"
                color={color}
                style={{ width: k.reps, textAlign: 'center' }}
            >
                Reps
            </TheText>
            <TheText variant="caption2" color={color} style={{ width: k.rpe, textAlign: 'center' }}>
                RPE
            </TheText>
            <View style={{ width: k.check }} />
        </View>
    )
}

/** One set: badge · previous · kg · reps · RPE · check. Fastest path from a done set to a saved one. */
export function SetRow({
    index,
    type = 'working',
    previous,
    weight,
    reps,
    rpe,
    suggested = {},
    done,
    pr,
    onChange,
    onToggle,
}: SetRowProps) {
    const theme = useTheme()
    const c = theme.colors
    const k = SET_COLUMNS
    const badge = type === 'warmup' ? 'W' : type === 'drop' ? 'D' : String(index ?? '')
    const badgeStyle = badgeColors(theme, type)
    const { background, checkBackground, checkForeground } = rowColors(theme, done, pr)

    const field = (
        key: keyof SetValues,
        width: number,
        value: string | undefined,
        keyboardType: 'decimal-pad' | 'number-pad',
        label: string,
    ) => (
        <TextInput
            accessibilityLabel={label}
            {...(onChange
                ? { value: value ?? '', onChangeText: (next: string) => onChange({ [key]: next }) }
                : { defaultValue: value })}
            placeholder={suggested[key]}
            placeholderTextColor={c.inkTertiary}
            keyboardType={keyboardType}
            selectTextOnFocus
            style={{
                width,
                height: 32,
                borderRadius: theme.radius.sm,
                backgroundColor: done || pr ? 'transparent' : c.surface3,
                color: c.ink,
                fontSize: 15,
                fontWeight: key === 'rpe' ? '500' : '600',
                fontVariant: ['tabular-nums'],
                textAlign: 'center',
                padding: 0,
            }}
        />
    )

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: k.gap,
                paddingVertical: 4,
                paddingHorizontal: k.padX,
                borderRadius: 10,
                backgroundColor: background,
            }}
        >
            <View
                style={{
                    width: k.badge,
                    height: 28,
                    borderRadius: theme.radius.sm,
                    backgroundColor: badgeStyle.background,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <TheText
                    color={badgeStyle.foreground}
                    style={{
                        fontSize: 13,
                        lineHeight: 18,
                        fontWeight: '600',
                        fontVariant: ['tabular-nums'],
                    }}
                >
                    {badge}
                </TheText>
            </View>
            <TheText
                variant="footnote"
                color={c.inkSecondary}
                numberOfLines={1}
                style={{ flex: 1, fontVariant: ['tabular-nums'] }}
            >
                {previous || '—'}
            </TheText>
            {field('weight', k.weight, weight, 'decimal-pad', 'Weight, kg')}
            {field('reps', k.reps, reps, 'number-pad', 'Reps')}
            {field('rpe', k.rpe, rpe, 'decimal-pad', 'RPE')}
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={done ? 'Set completed' : 'Complete set'}
                accessibilityState={{ checked: !!done }}
                onPress={onToggle}
                hitSlop={6}
                style={{
                    width: k.check,
                    height: 32,
                    borderRadius: theme.radius.sm,
                    backgroundColor: checkBackground,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Icon
                    name={pr ? 'trophy' : 'check'}
                    size={16}
                    strokeWidth={pr ? 2.4 : 3}
                    color={checkForeground}
                />
            </Pressable>
        </View>
    )
}
