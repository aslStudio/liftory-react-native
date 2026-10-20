import type { IconName } from '@/shared/config/icons'

export type { IconName }

export type IconProps = {
    name: IconName
    size?: number
    color?: string
    strokeWidth?: number
    /** Set to make the icon announced by VoiceOver; otherwise it is decorative. */
    label?: string
}
