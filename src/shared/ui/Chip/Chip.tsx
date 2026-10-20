import { View } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { Icon } from '@/shared/ui/Icon'
import { TheText } from '@/shared/ui/TheText'

import {
    CHIP_GAP,
    CHIP_HEIGHT,
    CHIP_ICON_SIZE,
    CHIP_ICON_STROKE_WIDTH,
    CHIP_PADDING_X,
    type ChipProps,
} from './model'
import { resolveChipColors } from './styles'

/** 22pt pill label: set types, program state, PRs. `pr` tone only for records. */
export function Chip({ label, tone = 'neutral', icon, style }: ChipProps) {
    const theme = useTheme()
    const { background, foreground } = resolveChipColors(theme, tone)

    return (
        <View
            style={[
                {
                    height: CHIP_HEIGHT,
                    paddingHorizontal: CHIP_PADDING_X,
                    borderRadius: theme.radius.pill,
                    backgroundColor: background,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: CHIP_GAP,
                    alignSelf: 'flex-start',
                },
                style,
            ]}
        >
            {icon ? (
                <Icon
                    name={icon}
                    size={CHIP_ICON_SIZE}
                    strokeWidth={CHIP_ICON_STROKE_WIDTH}
                    color={foreground}
                />
            ) : null}
            {/* Bespoke 11/13/600 size — not `caption2` (that token is an uppercase eyebrow style; chip labels keep their original casing, e.g. "Week 3 of 6"). */}
            <TheText
                color={foreground}
                style={{ fontSize: 11, lineHeight: 13, fontWeight: '600', letterSpacing: 0.22 }}
            >
                {label}
            </TheText>
        </View>
    )
}
