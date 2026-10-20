import { Children, Fragment } from 'react'
import { Pressable, View } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { Icon } from '@/shared/ui/Icon'
import { TheText } from '@/shared/ui/TheText'

import { ACCESSORY_ICON, type ListProps, type ListRowProps } from './model'
import { listContainerStyle, listDividerStyle } from './styles'

/** surface-2 group of ListRows with inset 1pt dividers (left inset 14pt). */
export function List({ children, style }: ListProps) {
    const theme = useTheme()
    const rows = Children.toArray(children)

    return (
        <View style={[listContainerStyle(theme), style]}>
            {rows.map((row, index) => (
                <Fragment key={index}>
                    {index > 0 ? <View style={listDividerStyle(theme)} /> : null}
                    {row}
                </Fragment>
            ))}
        </View>
    )
}

/** Footnote caption above a List: "Selected Exercises". */
export function ListCaption({ children }: { children: string }) {
    const theme = useTheme()
    return (
        <TheText
            variant="footnote"
            color={theme.colors.inkSecondary}
            style={{ marginLeft: 4, marginBottom: -4 }}
        >
            {children}
        </TheText>
    )
}

export function ListRow({
    title,
    subtitle,
    value,
    icon,
    accessory,
    tone = 'default',
    onPress,
}: ListRowProps) {
    const theme = useTheme()
    const c = theme.colors
    const titleColor = tone === 'accent' ? c.accentText : c.ink
    const accessoryColor = tone === 'accent' ? c.accentText : c.inkTertiary

    return (
        <Pressable
            disabled={!onPress}
            onPress={onPress}
            accessibilityRole={onPress ? 'button' : undefined}
            style={({ pressed }) => ({
                minHeight: 48,
                paddingVertical: 12,
                paddingHorizontal: 14,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                backgroundColor: pressed ? c.surface3 : 'transparent',
            })}
        >
            {icon ? <Icon name={icon} size={18} color={c.inkSecondary} /> : null}
            <View style={{ flex: 1, minWidth: 0 }}>
                <TheText variant="callout" color={titleColor} numberOfLines={1}>
                    {title}
                </TheText>
                {subtitle ? (
                    <TheText variant="footnote" color={c.inkSecondary} numberOfLines={1}>
                        {subtitle}
                    </TheText>
                ) : null}
            </View>
            {value ? (
                <TheText
                    variant="subhead"
                    color={c.inkSecondary}
                    style={{ fontVariant: ['tabular-nums'] }}
                >
                    {value}
                </TheText>
            ) : null}
            {accessory ? (
                <Icon name={ACCESSORY_ICON[accessory]} size={18} color={accessoryColor} />
            ) : null}
        </Pressable>
    )
}
