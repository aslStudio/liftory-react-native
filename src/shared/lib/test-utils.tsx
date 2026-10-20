import { render as rtlRender, type RenderOptions } from '@testing-library/react-native'
import type { PropsWithChildren, ReactElement } from 'react'

import { ThemeModeProvider } from '@/shared/lib/theme/theme-mode-provider'

export * from '@testing-library/react-native'

function AllProviders({ children }: PropsWithChildren) {
    return <ThemeModeProvider>{children}</ThemeModeProvider>
}

export function render(ui: ReactElement, options?: RenderOptions) {
    return rtlRender(ui, { wrapper: AllProviders, ...options })
}
