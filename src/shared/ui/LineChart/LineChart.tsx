import { Fragment, useState } from 'react'
import { type LayoutChangeEvent, View } from 'react-native'
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg'

import { useTheme } from '@/shared/lib/theme/use-theme'

import { DEFAULT_HEIGHT, GRID_LINE_COUNT, type LineChartProps, PADDING } from './model'
import { axisTextProps, buildPath, makeScales, resolveDomain, toneColor } from './styles'

/** Minimal trend chart: 4 gridlines, axis on the right, 2.5pt line, last point emphasized. */
export function LineChart({
    points,
    labels = [],
    unit,
    min,
    max,
    height = DEFAULT_HEIGHT,
    tone = 'accent',
    label = 'Chart',
}: LineChartProps) {
    const theme = useTheme()
    const c = theme.colors
    const [width, setWidth] = useState(0)
    const color = toneColor(theme, tone)
    const { lo, hi } = resolveDomain(points, min, max)
    const { x, y } = makeScales(width, height, points.length, lo, hi)
    const path = buildPath(points, x, y)
    const lastIndex = points.length - 1
    const axis = axisTextProps(theme)

    const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)

    return (
        <View onLayout={onLayout} style={{ height }} accessible accessibilityLabel={label}>
            {width > 0 ? (
                <Svg width={width} height={height}>
                    {Array.from({ length: GRID_LINE_COUNT }, (_, k) => {
                        const value = lo + ((hi - lo) * k) / (GRID_LINE_COUNT - 1)
                        const lineY = y(value)
                        return (
                            <Fragment key={k}>
                                <Line
                                    x1={PADDING.left}
                                    x2={width - PADDING.right}
                                    y1={lineY}
                                    y2={lineY}
                                    stroke={c.stroke}
                                    strokeWidth={1}
                                />
                                <SvgText x={width - PADDING.right + 6} y={lineY + 4} {...axis}>
                                    {String(Math.round(value * 10) / 10)}
                                </SvgText>
                            </Fragment>
                        )
                    })}
                    <Path
                        d={path}
                        fill="none"
                        stroke={color}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {points.map((value, index) => (
                        <Circle
                            key={index}
                            cx={x(index)}
                            cy={y(value)}
                            r={index === lastIndex ? 4.5 : 3}
                            fill={color}
                            stroke={index === lastIndex ? c.surface1 : 'none'}
                            strokeWidth={index === lastIndex ? 2 : 0}
                        />
                    ))}
                    {labels.map((text, index) =>
                        text ? (
                            <SvgText
                                key={`label-${index}`}
                                x={x(index)}
                                y={height - 5}
                                textAnchor={
                                    index === 0 ? 'start' : index === lastIndex ? 'end' : 'middle'
                                }
                                {...axis}
                            >
                                {text}
                            </SvgText>
                        ) : null,
                    )}
                    {unit ? (
                        <SvgText x={width - PADDING.right + 6} y={10} {...axis}>
                            {unit}
                        </SvgText>
                    ) : null}
                </Svg>
            ) : null}
        </View>
    )
}
