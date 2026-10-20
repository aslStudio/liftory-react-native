/// <reference types="node" />
/* eslint-disable @typescript-eslint/no-require-imports -- jest.mock factories need require(), not import */
import 'react-native-gesture-handler/jestSetup'

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
)

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'))

jest.mock(
    'react-native-safe-area-context',
    () => require('react-native-safe-area-context/jest/mock').default,
)
