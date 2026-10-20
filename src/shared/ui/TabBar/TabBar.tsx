import { Pressable, View } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { Icon } from '@/shared/ui/Icon'
import { TheText } from '@/shared/ui/TheText'

import { TAB_ICON_SIZE, TAB_MIN_WIDTH, type TabBarProps } from './model'
import { barStyle, tabForeground } from './styles'

/**
 * Floating glass capsule. Position it yourself: absolute, centered, bottom = safe-area inset + 8.
 * For real blur wrap it in BlurView (expo-blur, intensity 40, tint "dark") — see liftory-ui/README.
 */
export function TabBar({ items, active, onChange, style }: TabBarProps) {
    const theme = useTheme()

    return (
        <View accessibilityRole="tabbar" style={[barStyle(theme), theme.shadow.elev2, style]}>
            {items.map((item) => {
                const selected = item.id === active
                const foreground = tabForeground(theme, selected)
                return (
                    <Pressable
                        key={item.id}
                        accessibilityRole="tab"
                        accessibilityState={{ selected }}
                        accessibilityLabel={item.label}
                        onPress={() => onChange?.(item.id)}
                        style={{
                            minWidth: TAB_MIN_WIDTH,
                            paddingTop: 8,
                            paddingBottom: 7,
                            paddingHorizontal: 12,
                            borderRadius: theme.radius.pill,
                            alignItems: 'center',
                            gap: 3,
                            backgroundColor: selected ? theme.colors.accentSoft : 'transparent',
                        }}
                    >
                        <Icon name={item.icon} size={TAB_ICON_SIZE} color={foreground} />
                        <TheText variant="tabLabel" color={foreground}>
                            {item.label}
                        </TheText>
                    </Pressable>
                )
            })}
        </View>
    )
}
