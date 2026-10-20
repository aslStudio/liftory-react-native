import { Text } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'

import { DEFAULT_THE_TEXT_VARIANT, type TheTextProps } from './model'
import { buildTextStyle } from './styles'

export function TheText({
    variant = DEFAULT_THE_TEXT_VARIANT,
    color,
    style,
    ...rest
}: TheTextProps) {
    const theme = useTheme()
    return <Text style={buildTextStyle(variant, color ?? theme.colors.ink, style)} {...rest} />
}
