import { Pressable } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { Icon } from '@/shared/ui/Icon'

import { BOX, GLYPH, type TheButtonIconProps } from './model'
import { resolveButtonIconColors } from './styles'

/** Circle icon button: orange `accent` only for Start/Play and Skip rest. */
export function TheButtonIcon({
    icon,
    label,
    variant = 'surface',
    size = 'md',
    onPress,
    style,
}: TheButtonIconProps) {
    const theme = useTheme()
    const { background, pressedBackground, foreground } = resolveButtonIconColors(theme, variant)

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={onPress}
            hitSlop={size === 'sm' ? 6 : 0}
            style={({ pressed }) => [
                {
                    width: BOX[size],
                    height: BOX[size],
                    borderRadius: BOX[size] / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                        pressed && variant === 'accent' ? pressedBackground : background,
                    borderWidth: variant === 'glass' ? 1 : 0,
                    borderColor: theme.colors.stroke,
                    opacity: pressed && variant !== 'accent' ? 0.7 : 1,
                },
                variant === 'accent' ? theme.shadow.glowAccent : null,
                style,
            ]}
        >
            <Icon name={icon} size={GLYPH[size]} color={foreground} />
        </Pressable>
    )
}
