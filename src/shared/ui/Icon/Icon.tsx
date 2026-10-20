import Svg, { Path } from 'react-native-svg'

import { ICONS } from '@/shared/config/icons'
import { useTheme } from '@/shared/lib/theme/use-theme'

import type { IconProps } from './model'

export function Icon({ name, size = 20, color, strokeWidth = 2, label }: IconProps) {
    const theme = useTheme()
    const glyph = ICONS[name]
    const resolvedColor = color ?? theme.colors.ink

    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            accessible={!!label}
            accessibilityLabel={label}
        >
            {glyph.d.map((d, index) =>
                glyph.fill ? (
                    <Path key={index} d={d} fill={resolvedColor} />
                ) : (
                    <Path
                        key={index}
                        d={d}
                        fill="none"
                        stroke={resolvedColor}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                ),
            )}
        </Svg>
    )
}
