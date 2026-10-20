import type { Theme } from '@/shared/lib/theme/use-theme'

export function goalProgress(current: number, target: number) {
    const fraction = target > 0 ? Math.min(1, current / target) : 0
    return { fraction, reached: fraction >= 1 }
}

export function goalTone(theme: Theme, reached: boolean) {
    return reached ? theme.colors.success : theme.colors.accent
}
