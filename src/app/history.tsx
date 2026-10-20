import { router } from 'expo-router'

import { useTraining } from '@/application/training-provider'

import { completedSets, workoutVolume } from '@/entities/training/stats'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { TheText } from '@/shared/ui/TheText'
import { TrainingLayout, TrainingRow } from '@/shared/ui/TrainingLayout/TrainingLayout'

export default function HistoryScreen() {
    const theme = useTheme()
    const { workouts } = useTraining()
    const finished = workouts
        .filter((workout) => workout.finishedAt)
        .sort((a, b) => b.finishedAt!.localeCompare(a.finishedAt!))
    return (
        <TrainingLayout
            title="History"
            subtitle={`${finished.length} completed workouts`}
            onBack={() => router.back()}
        >
            {!finished.length ? (
                <TheText color={theme.colors.inkSecondary}>
                    Your finished sessions will appear here with every recorded set.
                </TheText>
            ) : null}
            {finished.map((workout) => (
                <TrainingRow
                    key={workout.id}
                    title={workout.name}
                    subtitle={`${new Date(workout.finishedAt!).toLocaleDateString()} · ${completedSets(workout).length} sets · ${Math.round(workoutVolume(workout))} kg`}
                    onPress={() =>
                        router.push({ pathname: '/workout', params: { id: workout.id } })
                    }
                />
            ))}
        </TrainingLayout>
    )
}
