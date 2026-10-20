/**
 * Liftory design tokens — single source of truth, ported 1:1 from
 * `liftory-ui/src/theme/tokens.ts` (see SPEC.md in that package for the
 * full component-by-component breakdown these values back). Units are
 * points (pt). Liftory is dark-first; `light` exists for system-theme users.
 */
import type { TextStyle, ViewStyle } from 'react-native'

export type ColorScheme = 'dark' | 'light'

export const palette = {
    dark: {
        bg: '#000000',
        surface1: '#1B1B1B',
        surface2: '#242424',
        surface3: '#2E2E2E',
        glass: 'rgba(38,38,38,0.72)',
        stroke: 'rgba(255,255,255,0.08)',
        strokeStrong: 'rgba(255,255,255,0.18)',
        ink: '#FFFFFF',
        inkSecondary: '#B4B4B9',
        inkTertiary: '#98989D',
        accent: '#F98A2C',
        accentPressed: '#D9721C',
        accentText: '#F98A2C',
        accentSoft: 'rgba(249,138,44,0.16)',
        onAccent: '#FFFFFF',
        success: '#30D158',
        successSoft: 'rgba(48,209,88,0.16)',
        danger: '#FF453A',
        pr: '#FFD60A',
        prSoft: 'rgba(255,214,10,0.16)',
        info: '#409CFF',
        focus: '#FFFFFF',
    },
    light: {
        bg: '#F2F2F4',
        surface1: '#FFFFFF',
        surface2: '#EDEDF0',
        surface3: '#E3E3E8',
        glass: 'rgba(255,255,255,0.78)',
        stroke: 'rgba(0,0,0,0.08)',
        strokeStrong: 'rgba(0,0,0,0.18)',
        ink: '#0B0B0C',
        inkSecondary: '#48484E',
        inkTertiary: '#636369',
        accent: '#F98A2C',
        accentPressed: '#D9721C',
        accentText: '#B04E00',
        accentSoft: 'rgba(249,138,44,0.16)',
        onAccent: '#FFFFFF',
        success: '#1E7B34',
        successSoft: 'rgba(30,123,52,0.12)',
        danger: '#C4121A',
        pr: '#7A6000',
        prSoft: 'rgba(138,109,0,0.12)',
        info: '#0063CC',
        focus: '#0B0B0C',
    },
} as const

export type Colors = { [K in keyof typeof palette.dark]: string }

/** System font (SF Pro on iOS, Roboto on Android) — leave fontFamily undefined. */
const tabular: TextStyle['fontVariant'] = ['tabular-nums']

export const type = {
    largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: '700' },
    title1: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
    title2: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
    title3: { fontSize: 20, lineHeight: 25, fontWeight: '600' },
    headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
    body: { fontSize: 17, lineHeight: 22, fontWeight: '400' },
    callout: { fontSize: 16, lineHeight: 21, fontWeight: '400' },
    subhead: { fontSize: 15, lineHeight: 20, fontWeight: '400' },
    footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
    caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
    /** Eyebrows only: RECOMMENDED, NEXT, REST, column headers. */
    caption2: {
        fontSize: 11,
        lineHeight: 13,
        fontWeight: '600',
        letterSpacing: 0.44,
        textTransform: 'uppercase',
    },
    tabLabel: { fontSize: 11, lineHeight: 13, fontWeight: '500' },
    numericXl: { fontSize: 48, lineHeight: 52, fontWeight: '700', fontVariant: tabular },
    numericLg: { fontSize: 28, lineHeight: 34, fontWeight: '700', fontVariant: tabular },
    numericMd: { fontSize: 22, lineHeight: 28, fontWeight: '600', fontVariant: tabular },
} satisfies Record<string, TextStyle>

export type TypeVariant = keyof typeof type

export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32 } as const

export const radius = { sm: 8, md: 14, lg: 20, xl: 28, pill: 999 } as const

/** CSS blur ≈ 2 × shadowRadius. `elevation` is the Android fallback. */
export const shadow = {
    dark: {
        glowAccent: {
            shadowColor: '#F98A2C',
            shadowOpacity: 0.35,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 },
            elevation: 6,
        },
        elev1: {
            shadowColor: '#000000',
            shadowOpacity: 0.5,
            shadowRadius: 1,
            shadowOffset: { width: 0, height: 1 },
            elevation: 1,
        },
        elev2: {
            shadowColor: '#000000',
            shadowOpacity: 0.55,
            shadowRadius: 15,
            shadowOffset: { width: 0, height: 10 },
            elevation: 12,
        },
    },
    light: {
        glowAccent: {
            shadowColor: '#F98A2C',
            shadowOpacity: 0.3,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 6 },
            elevation: 6,
        },
        elev1: {
            shadowColor: '#000000',
            shadowOpacity: 0.1,
            shadowRadius: 1,
            shadowOffset: { width: 0, height: 1 },
            elevation: 1,
        },
        elev2: {
            shadowColor: '#000000',
            shadowOpacity: 0.12,
            shadowRadius: 15,
            shadowOffset: { width: 0, height: 10 },
            elevation: 12,
        },
    },
} satisfies Record<ColorScheme, Record<string, ViewStyle>>

/** Minimum hit target for any tappable element. */
export const hitSlop = { top: 6, bottom: 6, left: 6, right: 6 } as const
