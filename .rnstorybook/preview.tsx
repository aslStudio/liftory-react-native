import type { Preview } from '@storybook/react-native'

import { ThemeModeProvider } from '@/shared/lib/theme/theme-mode-provider'

const preview: Preview = {
    decorators: [
        (Story) => (
            <ThemeModeProvider>
                <Story />
            </ThemeModeProvider>
        ),
    ],
}

export default preview
