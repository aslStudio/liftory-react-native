import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { TheText } from '@/shared/ui/TheText'

import { SEGMENT_HEIGHT, type SegmentedControlProps } from './model'
import { segmentColors, trackStyle } from './styles'

/** Pill track (surface-2, 3pt inset) with a raised surface-3 thumb; 36pt tall overall. */
export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
    const theme = useTheme()
    const [inner, setInner] = useState(options[0])
    const current = value ?? inner

    return (
        <View accessibilityRole="tablist" style={trackStyle(theme)}>
            {options.map((option) => {
                const selected = option === current
                const { textColor } = segmentColors(theme, selected)
                return (
                    <Pressable
                        key={option}
                        accessibilityRole="tab"
                        accessibilityState={{ selected }}
                        onPress={() => {
                            setInner(option)
                            onChange?.(option)
                        }}
                        style={[
                            {
                                flex: 1,
                                height: SEGMENT_HEIGHT,
                                borderRadius: theme.radius.pill,
                                alignItems: 'center',
                                justifyContent: 'center',
                            },
                            selected
                                ? [{ backgroundColor: theme.colors.surface3 }, theme.shadow.elev1]
                                : null,
                        ]}
                    >
                        <TheText
                            color={textColor}
                            style={{ fontSize: 13, lineHeight: 18, fontWeight: '500' }}
                        >
                            {option}
                        </TheText>
                    </Pressable>
                )
            })}
        </View>
    )
}
