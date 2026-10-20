import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Alert, View } from 'react-native'

import { useTraining } from '@/application/training-provider'

import type { Workout } from '@/entities/training/model'
import { previousSet, progressionSuggestion, workoutVolume } from '@/entities/training/stats'
import { newSet } from '@/entities/training/workout'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { ExerciseCard } from '@/shared/ui/ExerciseCard'
import { RestTimer } from '@/shared/ui/RestTimer'
import { TheButton } from '@/shared/ui/TheButton'
import { TheText } from '@/shared/ui/TheText'
import {
    SectionHeading,
    TrainingField,
    TrainingLayout,
} from '@/shared/ui/TrainingLayout/TrainingLayout'

export default function WorkoutScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const theme = useTheme()
    const { workouts, save, remove } = useTraining()
    const stored = workouts.find((workout) => workout.id === id)
    const [draft, setDraft] = useState<Workout | null>(null)
    const draftRef = useRef<Workout | null>(null)
    const writes = useRef(Promise.resolve(true))
    const pendingWrites = useRef(0)
    const [saveError, setSaveError] = useState('')
    const [restEndsAt, setRestEndsAt] = useState<number | null>(null)
    const [remaining, setRemaining] = useState(0)

    useEffect(() => {
        if (
            stored &&
            pendingWrites.current === 0 &&
            JSON.stringify(stored) !== JSON.stringify(draftRef.current)
        ) {
            draftRef.current = stored
            setDraft(stored)
        }
    }, [stored])

    useEffect(() => {
        if (restEndsAt === null) return
        const tick = () => {
            const seconds = Math.max(0, Math.ceil((restEndsAt - Date.now()) / 1000))
            setRemaining(seconds)
            if (!seconds) setRestEndsAt(null)
        }
        tick()
        const interval = setInterval(tick, 1000)
        return () => clearInterval(interval)
    }, [restEndsAt])

    function update(change: (current: Workout) => Workout) {
        if (!draftRef.current) return Promise.resolve(false)
        const next = change(draftRef.current)
        draftRef.current = next
        setDraft(next)
        pendingWrites.current += 1
        writes.current = writes.current
            .then(async () => {
                await save('workout', next)
                setSaveError('')
                return true
            })
            .catch((cause) => {
                setSaveError(cause instanceof Error ? cause.message : 'Could not save workout.')
                return false
            })
            .finally(() => {
                pendingWrites.current -= 1
            })
        return writes.current
    }

    if (!draft)
        return (
            <TrainingLayout title="Workout" onBack={() => router.back()}>
                <TheText color={theme.colors.inkSecondary}>Loading session…</TheText>
            </TrainingLayout>
        )

    const history = workouts.filter((workout) => workout.id !== draft.id)
    return (
        <TrainingLayout
            title={draft.name}
            subtitle={
                draft.finishedAt
                    ? `Completed ${new Date(draft.finishedAt).toLocaleDateString()}`
                    : 'Every change saves automatically.'
            }
            onBack={() => router.back()}
        >
            <SectionHeading title="Exercises" detail={`${draft.exercises.length} added`} />
            {!draft.exercises.length ? (
                <TheText color={theme.colors.inkSecondary}>
                    Add your first exercise to start logging sets.
                </TheText>
            ) : null}
            {draft.exercises.map((exercise, exerciseIndex) => {
                const previous = previousSet(history, exercise.exerciseId)
                const suggestion = progressionSuggestion(history, exercise.exerciseId) ?? undefined
                return (
                    <View key={`${exercise.exerciseId}:${exerciseIndex}`} style={{ gap: 8 }}>
                        <ExerciseCard
                            name={exercise.name}
                            muscle={exercise.muscleGroup}
                            note={exercise.note}
                            recommendation={
                                suggestion
                                    ? {
                                          value: `${suggestion.weight || '0'} kg × ${suggestion.reps}`,
                                          reason: suggestion.reason,
                                      }
                                    : undefined
                            }
                            sets={exercise.sets.map((set, setIndex) => ({
                                index: setIndex + 1,
                                type: set.type,
                                weight: set.weight,
                                reps: set.reps,
                                rpe: set.rpe,
                                done: set.done,
                                previous: previous
                                    ? `${previous.weight || '0'} × ${previous.reps}`
                                    : undefined,
                                suggested: suggestion,
                                onChange: (patch) =>
                                    update((current) => ({
                                        ...current,
                                        exercises: current.exercises.map((item, i) =>
                                            i === exerciseIndex
                                                ? {
                                                      ...item,
                                                      sets: item.sets.map((candidate) =>
                                                          candidate.id === set.id
                                                              ? { ...candidate, ...patch }
                                                              : candidate,
                                                      ),
                                                  }
                                                : item,
                                        ),
                                    })),
                                onToggle: () => {
                                    if (!set.done && !Number(set.reps || suggestion?.reps)) {
                                        Alert.alert(
                                            'Add reps first',
                                            'Enter the number of repetitions for this set.',
                                        )
                                        return
                                    }
                                    update((current) => ({
                                        ...current,
                                        exercises: current.exercises.map((item, i) =>
                                            i === exerciseIndex
                                                ? {
                                                      ...item,
                                                      sets: item.sets.map((candidate) =>
                                                          candidate.id === set.id
                                                              ? {
                                                                    ...candidate,
                                                                    weight:
                                                                        candidate.weight ||
                                                                        suggestion?.weight ||
                                                                        '0',
                                                                    reps:
                                                                        candidate.reps ||
                                                                        suggestion?.reps ||
                                                                        '',
                                                                    done: !candidate.done,
                                                                }
                                                              : candidate,
                                                      ),
                                                  }
                                                : item,
                                        ),
                                    }))
                                    if (!set.done) setRestEndsAt(Date.now() + 90000)
                                },
                            }))}
                            onAddSet={() =>
                                update((current) => ({
                                    ...current,
                                    exercises: current.exercises.map((item, i) =>
                                        i === exerciseIndex
                                            ? { ...item, sets: [...item.sets, newSet()] }
                                            : item,
                                    ),
                                }))
                            }
                            onReplace={() =>
                                router.push({
                                    pathname: '/library',
                                    params: {
                                        workoutId: draft.id,
                                        replaceIndex: String(exerciseIndex),
                                    },
                                })
                            }
                            onMore={() =>
                                Alert.alert(
                                    exercise.name,
                                    'Remove this exercise from the workout?',
                                    [
                                        { text: 'Cancel', style: 'cancel' },
                                        {
                                            text: 'Remove',
                                            style: 'destructive',
                                            onPress: () =>
                                                update((current) => ({
                                                    ...current,
                                                    exercises: current.exercises.filter(
                                                        (_, i) => i !== exerciseIndex,
                                                    ),
                                                })),
                                        },
                                    ],
                                )
                            }
                        />
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <TheButton
                                title="Warm-up set"
                                size="sm"
                                variant="secondary"
                                onPress={() =>
                                    update((current) => ({
                                        ...current,
                                        exercises: current.exercises.map((item, i) =>
                                            i === exerciseIndex
                                                ? {
                                                      ...item,
                                                      sets: [...item.sets, newSet('warmup')],
                                                  }
                                                : item,
                                        ),
                                    }))
                                }
                            />
                            <TheButton
                                title="Drop set"
                                size="sm"
                                variant="secondary"
                                onPress={() =>
                                    update((current) => ({
                                        ...current,
                                        exercises: current.exercises.map((item, i) =>
                                            i === exerciseIndex
                                                ? { ...item, sets: [...item.sets, newSet('drop')] }
                                                : item,
                                        ),
                                    }))
                                }
                            />
                        </View>
                        <TrainingField
                            label={`Notes for ${exercise.name}`}
                            value={exercise.note ?? ''}
                            onChangeText={(note) =>
                                update((current) => ({
                                    ...current,
                                    exercises: current.exercises.map((item, i) =>
                                        i === exerciseIndex ? { ...item, note } : item,
                                    ),
                                }))
                            }
                            placeholder="Technique, tempo, equipment…"
                        />
                    </View>
                )
            })}
            <TheButton
                title="Add exercise"
                variant="secondary"
                icon="plus"
                block
                onPress={() =>
                    router.push({ pathname: '/library', params: { workoutId: draft.id } })
                }
            />
            <TrainingField
                label="Workout notes"
                value={draft.notes ?? ''}
                onChangeText={(notes) => update((current) => ({ ...current, notes }))}
                placeholder="How did it feel?"
                multiline
            />
            <TheText
                color={theme.colors.inkSecondary}
            >{`${draft.exercises.flatMap((item) => item.sets).filter((set) => set.done).length} completed sets · ${Math.round(workoutVolume(draft))} kg volume`}</TheText>
            {restEndsAt ? (
                <RestTimer
                    remaining={remaining}
                    total={90}
                    onMinus={() => setRestEndsAt((value) => (value ? value - 15000 : null))}
                    onPlus={() => setRestEndsAt((value) => (value ? value + 15000 : null))}
                    onSkip={() => setRestEndsAt(null)}
                />
            ) : null}
            {saveError ? <TheText color={theme.colors.danger}>{saveError}</TheText> : null}
            {!draft.finishedAt ? (
                <TheButton
                    title="Finish workout"
                    block
                    onPress={() => {
                        void update((current) => ({
                            ...current,
                            finishedAt: new Date().toISOString(),
                        })).then((saved) => {
                            if (saved) router.back()
                        })
                    }}
                />
            ) : null}
            <TheButton
                title="Delete workout"
                variant="danger"
                block
                onPress={() =>
                    Alert.alert(
                        'Delete workout?',
                        'This removes the session and its sets from your devices.',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: async () => {
                                    await writes.current
                                    await remove('workout', draft.id)
                                    router.back()
                                },
                            },
                        ],
                    )
                }
            />
        </TrainingLayout>
    )
}
