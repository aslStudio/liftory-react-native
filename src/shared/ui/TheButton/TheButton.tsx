import { Pressable } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { Icon } from '@/shared/ui/Icon'
import { TheText } from '@/shared/ui/TheText'

import { GAP, GHOST_PADDING_X, HEIGHT, ICON_SIZE, PADDING_X, type TheButtonProps } from './model'
import { resolveButtonColors, useStyles } from './styles'

/** Pill button. One `primary` per screen; `ghost` for in-card adds ("Add Set"). */
export function TheButton({
    title,
    variant = 'primary',
    size = 'md',
    icon,
    block,
    disabled,
    onPress,
    style,
}: TheButtonProps) {
    const theme = useTheme()
    const styles = useStyles()
    const { background, pressedBackground, foreground } = resolveButtonColors(theme, variant)

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !!disabled }}
            disabled={disabled}
            onPress={onPress}
            style={({ pressed }) => [
                styles.root,
                {
                    height: HEIGHT[size],
                    paddingHorizontal: variant === 'ghost' ? GHOST_PADDING_X : PADDING_X[size],
                    borderRadius: theme.radius.pill,
                    gap: GAP[size],
                    alignSelf: block ? 'stretch' : 'flex-start',
                    backgroundColor:
                        pressed && variant === 'primary' ? pressedBackground : background,
                    opacity: disabled ? 0.4 : pressed && variant !== 'primary' ? 0.7 : 1,
                },
                variant === 'primary' && !disabled ? theme.shadow.glowAccent : null,
                style,
            ]}
        >
            {icon ? <Icon name={icon} size={ICON_SIZE[size]} color={foreground} /> : null}
            <TheText
                variant={size === 'sm' ? 'subhead' : 'headline'}
                color={foreground}
                style={{ fontWeight: '600' }}
            >
                {title}
            </TheText>
        </Pressable>
    )
}
