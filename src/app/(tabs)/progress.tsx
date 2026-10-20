import { randomUUID } from 'expo-crypto'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, View } from 'react-native'

import { useTraining } from '@/application/training-provider'

import { periodRecap, programConsistency, weeklyReview } from '@/entities/training/insights'
import { progressSummary, workoutVolume } from '@/entities/training/stats'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { GoalProgress } from '@/shared/ui/GoalProgress'
import { LineChart } from '@/shared/ui/LineChart'
import { StatTile } from '@/shared/ui/StatTile'
import { StreakCard } from '@/shared/ui/StreakCard'
import { TheButton } from '@/shared/ui/TheButton'
import { TheText } from '@/shared/ui/TheText'
import {
    SectionHeading,
    TrainingField,
    TrainingLayout,
    TrainingRow,
} from '@/shared/ui/TrainingLayout/TrainingLayout'

export default function ProgressScreen() {
    const theme = useTheme()
    const { workouts, programs, measurements, goals, save, remove } = useTraining()
    const summary = progressSummary(workouts)
    const consistency = programConsistency(
        programs.find((program) => program.status === 'active'),
        workouts,
    )
    const review = weeklyReview(workouts)
    const month = periodRecap(workouts, 'month')
    const year = periodRecap(workouts, 'year')
    const [weight, setWeight] = useState('')
    const [target, setTarget] = useState('')
    const [metric, setMetric] = useState<'workouts' | 'volume'>('workouts')
    const [error, setError] = useState('')
    const weights = [...measurements].sort((a, b) => a.date.localeCompare(b.date))
    const completed = [...workouts]
        .filter((workout) => workout.finishedAt)
        .sort((a, b) => a.startedAt.localeCompare(b.startedAt))

    async function addMeasurement() {
        const value = Number(weight.replace(',', '.'))
        if (!Number.isFinite(value) || value <= 0 || value > 600) {
            setError('Enter a valid body weight.')
            return
        }
        await save('measurement', {
            id: randomUUID(),
            date: new Date().toISOString(),
            weight: value,
        })
        setWeight('')
        setError('')
    }

    async function addGoal() {
        const value = Number(target)
        if (!Number.isFinite(value) || value <= 0) {
            setError('Enter a positive target.')
            return
        }
        await save('goal', {
            id: randomUUID(),
            title: metric === 'workouts' ? 'Complete workouts' : 'Lift total volume',
            metric,
            target: value,
            unit: metric === 'workouts' ? 'sessions' : 'kg',
            createdAt: new Date().toISOString(),
        })
        setTarget('')
        setError('')
    }

    return (
        <TrainingLayout title="Progress" subtitle="Built from your completed workouts." tabs>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <StatTile
                    label="Workouts"
                    value={summary.workouts}
                    style={{ flex: 1, minWidth: 145 }}
                />
                <StatTile
                    label="Completed sets"
                    value={summary.sets}
                    style={{ flex: 1, minWidth: 145 }}
                />
                <StatTile
                    label="Volume"
                    value={Math.round(summary.volume)}
                    unit="kg"
                    style={{ flex: 1, minWidth: 145 }}
                />
                <StatTile
                    label="Training days"
                    value={summary.trainingDays}
                    style={{ flex: 1, minWidth: 145 }}
                />
            </View>
            <SectionHeading title="This week" detail="Since Monday" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <StatTile
                    label="Sessions"
                    value={review.workouts}
                    style={{ flex: 1, minWidth: 145 }}
                />
                <StatTile label="Sets" value={review.sets} style={{ flex: 1, minWidth: 145 }} />
                <StatTile
                    label="Volume"
                    value={Math.round(review.volume)}
                    unit="kg"
                    style={{ flex: 1, minWidth: 145 }}
                />
                <StatTile
                    label="On plan"
                    value={`${consistency.percentage}%`}
                    style={{ flex: 1, minWidth: 145 }}
                />
            </View>
            {consistency.planned ? (
                <StreakCard
                    weeks={consistency.current}
                    completed={consistency.completed}
                    best={consistency.best}
                    history={consistency.history}
                />
            ) : null}
            <SectionHeading
                title="This month"
                detail={new Date().toLocaleDateString(undefined, {
                    month: 'long',
                    year: 'numeric',
                })}
            />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <StatTile
                    label="Sessions"
                    value={month.workouts}
                    style={{ flex: 1, minWidth: 145 }}
                />
                <StatTile label="Hours" value={month.hours} style={{ flex: 1, minWidth: 145 }} />
                <StatTile label="Sets" value={month.sets} style={{ flex: 1, minWidth: 145 }} />
                <StatTile
                    label="Volume"
                    value={Math.round(month.volume)}
                    unit="kg"
                    style={{ flex: 1, minWidth: 145 }}
                />
            </View>
            {month.favoriteExercise ? (
                <TrainingRow title="Most trained exercise" subtitle={month.favoriteExercise} />
            ) : null}
            {month.topMuscle ? (
                <TrainingRow title="Most trained muscle" subtitle={month.topMuscle} />
            ) : null}
            <TrainingRow
                title={`${new Date().getFullYear()} so far`}
                subtitle={`${year.workouts} sessions · ${year.hours} hours · ${Math.round(year.volume)} kg volume`}
            />
            <SectionHeading title="Recent volume" detail="Last 8 sessions" />
            {completed.length ? (
                <LineChart
                    points={completed.slice(-8).map(workoutVolume)}
                    labels={completed.slice(-8).map((workout) =>
                        new Date(workout.startedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                        }),
                    )}
                    unit="kg"
                    label="Workout volume"
                />
            ) : (
                <TheText color={theme.colors.inkSecondary}>
                    Finish a workout to see your progress trend.
                </TheText>
            )}
            <SectionHeading title="Personal records" detail="Estimated 1RM" />
            {summary.personalRecords.length ? (
                summary.personalRecords
                    .slice(0, 5)
                    .map((record) => (
                        <TrainingRow
                            key={record.name}
                            title={record.name}
                            subtitle={`${record.weight} kg lifted · estimated ${Math.round(record.estimatedMax)} kg 1RM`}
                        />
                    ))
            ) : (
                <TheText color={theme.colors.inkSecondary}>
                    Your best sets will appear here.
                </TheText>
            )}
            <SectionHeading title="Body weight" detail={`${weights.length} entries`} />
            {weights.length > 1 ? (
                <LineChart
                    points={weights.slice(-10).map((entry) => entry.weight)}
                    labels={weights.slice(-10).map((entry) =>
                        new Date(entry.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                        }),
                    )}
                    unit="kg"
                    label="Body weight"
                    tone="info"
                />
            ) : null}
            {weights
                .slice(-3)
                .reverse()
                .map((entry) => (
                    <TrainingRow
                        key={entry.id}
                        title={`${entry.weight} kg`}
                        subtitle={new Date(entry.date).toLocaleDateString()}
                        trailing={
                            <TheButton
                                title="Delete"
                                variant="ghost"
                                size="sm"
                                onPress={() =>
                                    Alert.alert('Delete measurement?', undefined, [
                                        { text: 'Cancel', style: 'cancel' },
                                        {
                                            text: 'Delete',
                                            style: 'destructive',
                                            onPress: () => void remove('measurement', entry.id),
                                        },
                                    ])
                                }
                            />
                        }
                    />
                ))}
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
                <View style={{ flex: 1 }}>
                    <TrainingField
                        label="Current body weight, kg"
                        value={weight}
                        onChangeText={setWeight}
                        keyboardType="decimal-pad"
                        placeholder="72.5"
                    />
                </View>
                <TheButton title="Save" size="sm" onPress={() => void addMeasurement()} />
            </View>
            <SectionHeading title="Goals" />
            {goals.map((goal) => (
                <View key={goal.id} style={{ gap: 6 }}>
                    <GoalProgress
                        title={goal.title}
                        current={
                            goal.metric === 'workouts'
                                ? summary.workouts
                                : Math.round(summary.volume)
                        }
                        target={goal.target}
                        unit={goal.unit}
                    />
                    <TheButton
                        title="Remove goal"
                        variant="ghost"
                        size="sm"
                        onPress={() => void remove('goal', goal.id)}
                    />
                </View>
            ))}
            <View style={{ flexDirection: 'row', gap: 8 }}>
                <TheButton
                    title="Workouts"
                    size="sm"
                    variant={metric === 'workouts' ? 'primary' : 'secondary'}
                    onPress={() => setMetric('workouts')}
                />
                <TheButton
                    title="Volume"
                    size="sm"
                    variant={metric === 'volume' ? 'primary' : 'secondary'}
                    onPress={() => setMetric('volume')}
                />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
                <View style={{ flex: 1 }}>
                    <TrainingField
                        label={metric === 'workouts' ? 'Target sessions' : 'Target total kg'}
                        value={target}
                        onChangeText={setTarget}
                        keyboardType="number-pad"
                        placeholder={metric === 'workouts' ? '20' : '10000'}
                    />
                </View>
                <TheButton title="Add goal" size="sm" onPress={() => void addGoal()} />
            </View>
            {error ? <TheText color={theme.colors.danger}>{error}</TheText> : null}
            <TrainingRow
                title="Workout history"
                subtitle="Review individual sessions"
                onPress={() => router.push('/history')}
            />
        </TrainingLayout>
    )
}
