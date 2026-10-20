import { router } from 'expo-router'
import { View } from 'react-native'

import { useTraining } from '@/application/training-provider'

import { useThemeMode } from '@/shared/lib/theme/theme-mode-provider'
import { useTheme } from '@/shared/lib/theme/use-theme'
import { TheButton } from '@/shared/ui/TheButton'
import { TheText } from '@/shared/ui/TheText'
import {
    SectionHeading,
    TrainingLayout,
    TrainingRow,
} from '@/shared/ui/TrainingLayout/TrainingLayout'

export default function ProfileScreen() {
    const theme = useTheme()
    const { cloud, workouts, exercises, programs, profiles, sync } = useTraining()
    const { themeMode, setThemeMode } = useThemeMode()
    const status =
        cloud.availability === 'unsupported'
            ? 'iCloud is available on iOS. Your data stays local here.'
            : cloud.availability === 'rebuild'
              ? 'Install a new iOS build to enable the native iCloud module.'
              : cloud.error
                ? cloud.error
                : cloud.syncing
                  ? 'Syncing…'
                  : cloud.lastSync
                    ? `Last synced ${new Date(cloud.lastSync).toLocaleString()}`
                    : 'Ready to sync with your iCloud account.'

    return (
        <TrainingLayout title="Profile" subtitle="Your training data belongs to you." tabs>
            <SectionHeading title="Fitness" />
            <TrainingRow
                title="Fitness profile & nutrition"
                subtitle={
                    profiles.length
                        ? 'Edit your details and estimates'
                        : 'Set your training goal and routine'
                }
                onPress={() => router.push('/fitness-profile')}
            />
            <SectionHeading title="Data" />
            <TrainingRow
                title="On this device"
                subtitle={`${workouts.length} sessions · ${programs.length} programs · ${exercises.filter((exercise) => exercise.custom).length} custom exercises`}
            />
            <TrainingRow title="iCloud sync" subtitle={status} />
            {cloud.availability === 'ready' ? (
                <TheButton
                    title={cloud.syncing ? 'Syncing…' : 'Sync now'}
                    variant="secondary"
                    disabled={cloud.syncing}
                    onPress={() => void sync()}
                />
            ) : null}
            <TheText variant="footnote" color={theme.colors.inkSecondary}>
                Workouts are saved locally first. On iOS, iCloud sync runs when you open the app and
                after changes. No Liftory account or server is used.
            </TheText>
            <SectionHeading title="Appearance" />
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                {(['dark', 'light', 'system'] as const).map((mode) => (
                    <TheButton
                        key={mode}
                        title={mode[0].toUpperCase() + mode.slice(1)}
                        size="sm"
                        variant={themeMode === mode ? 'primary' : 'secondary'}
                        onPress={() => setThemeMode(mode)}
                    />
                ))}
            </View>
            <SectionHeading title="Manage" />
            <TrainingRow
                title="Exercise library"
                subtitle="Browse and add custom exercises"
                onPress={() => router.push('/library')}
            />
            <TrainingRow
                title="Workout history"
                subtitle="Review saved sessions"
                onPress={() => router.push('/history')}
            />
        </TrainingLayout>
    )
}
