/**
 * Liftory line icons — ported 1:1 from `liftory-ui/src/icons/Icon.tsx`.
 * 24×24 grid, 2pt round stroke, filled only for play/pause/more. The matching
 * raw `*.svg` files live in `assets/icons/` for Figma/Xcode (see that
 * package's README → "Иконки" for the SF Symbols equivalence table).
 */
export const ICONS = {
    play: {
        fill: true,
        d: ['M8 5.2v13.6c0 .8.9 1.3 1.6.8l10.2-6.8c.6-.4.6-1.2 0-1.6L9.6 4.4C8.9 3.9 8 4.4 8 5.2z'],
    },
    pause: { fill: true, d: ['M7 5h3.5v14H7z', 'M13.5 5H17v14h-3.5z'] },
    trash: {
        fill: false,
        d: [
            'M4 7h16',
            'M9.5 7V4.5h5V7',
            'M6.5 7l.9 12.2c.1.9.8 1.8 1.8 1.8h5.6c1 0 1.7-.9 1.8-1.8L17.5 7',
            'M10 11v6',
            'M14 11v6',
        ],
    },
    plus: { fill: false, d: ['M12 5v14', 'M5 12h14'] },
    'plus-circle': {
        fill: false,
        d: ['M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0', 'M12 8v8', 'M8 12h8'],
    },
    'chevron-right': { fill: false, d: ['M9.5 5.5L16 12l-6.5 6.5'] },
    'chevron-left': { fill: false, d: ['M14.5 5.5L8 12l6.5 6.5'] },
    grip: { fill: false, d: ['M4.5 8h15', 'M4.5 12h15', 'M4.5 16h15'] },
    check: { fill: false, d: ['M5 12.5l4.5 4.5L19 7.5'] },
    calendar: {
        fill: false,
        d: [
            'M6 4.5h12a2.5 2.5 0 0 1 2.5 2.5v11a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 18V7A2.5 2.5 0 0 1 6 4.5z',
            'M3.5 9.5h17',
            'M8 2.5v4',
            'M16 2.5v4',
        ],
    },
    dumbbell: {
        fill: false,
        d: ['M6.5 6.5v11', 'M17.5 6.5v11', 'M3.5 9v6', 'M20.5 9v6', 'M6.5 12h11'],
    },
    chart: { fill: false, d: ['M5 20v-6', 'M12 20V9', 'M19 20V4'] },
    star: {
        fill: false,
        d: ['M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z'],
    },
    timer: {
        fill: false,
        d: ['M4 13a8 8 0 1 0 16 0a8 8 0 1 0 -16 0', 'M12 9v4l2.5 2', 'M9.5 2.5h5'],
    },
    flame: {
        fill: false,
        d: [
            'M12 3c.8 3.2 5 5.2 5 10.2a5 5 0 0 1-10 0c0-2.4 1.1-3.9 2.4-4.9.2 1.8 1 2.9 2.2 3.4-.7-3.2-.6-6.1.4-8.7z',
        ],
    },
    trophy: {
        fill: false,
        d: [
            'M8 4h8v5a4 4 0 0 1-8 0z',
            'M8 6H5.5a2.5 2.5 0 0 0 2.6 3.5',
            'M16 6h2.5a2.5 2.5 0 0 1-2.6 3.5',
            'M12 13v4',
            'M8.5 20.5h7',
            'M9.5 17h5',
        ],
    },
    swap: {
        fill: false,
        d: ['M7.5 4L4 7.5 7.5 11', 'M4 7.5h14', 'M16.5 13l3.5 3.5-3.5 3.5', 'M20 16.5H6'],
    },
    more: {
        fill: true,
        d: [
            'M4.5 12a1.7 1.7 0 1 0 3.4 0a1.7 1.7 0 1 0 -3.4 0',
            'M10.3 12a1.7 1.7 0 1 0 3.4 0a1.7 1.7 0 1 0 -3.4 0',
            'M16.1 12a1.7 1.7 0 1 0 3.4 0a1.7 1.7 0 1 0 -3.4 0',
        ],
    },
    target: {
        fill: false,
        d: [
            'M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0',
            'M7 12a5 5 0 1 0 10 0a5 5 0 1 0 -10 0',
            'M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
        ],
    },
    trend: { fill: false, d: ['M3.5 17l5.5-5.5 4 4 7.5-7.5', 'M15 8h5.5v5.5'] },
    user: {
        fill: false,
        d: ['M8 8a4 4 0 1 0 8 0a4 4 0 1 0 -8 0', 'M4.5 20c.8-3.6 3.8-5.5 7.5-5.5s6.7 1.9 7.5 5.5'],
    },
    note: { fill: false, d: ['M6 3.5h12v17H6z', 'M9 8.5h6', 'M9 12h6', 'M9 15.5h3.5'] },
    skip: { fill: false, d: ['M6 6l7 6-7 6z', 'M17 6v12'] },
} as const

export type IconName = keyof typeof ICONS
