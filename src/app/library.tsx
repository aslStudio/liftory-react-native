import { randomUUID } from 'expo-crypto'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Alert, Pressable, View } from 'react-native'

import { useTraining } from '@/application/training-provider'

import type { Exercise } from '@/entities/training/model'
import { getEntity } from '@/entities/training/store'
import { workoutExercise } from '@/entities/training/workout'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { TheButton } from '@/shared/ui/TheButton'
import { TheText } from '@/shared/ui/TheText'
import {
    SectionHeading,
    TrainingField,
    TrainingLayout,
    TrainingRow,
} from '@/shared/ui/TrainingLayout/TrainingLayout'

export default function LibraryScreen() {
    const { workoutId, replaceIndex } = useLocalSearchParams<{
        workoutId?: string
        replaceIndex?: string
    }>()
    const theme = useTheme()
    const { exercises, programs, save, remove } = useTraining()
    const [search, setSearch] = useState('')
    const [group, setGroup] = useState('All')
    const [creating, setCreating] = useState(false)
    const [name, setName] = useState('')
    const [muscleGroup, setMuscleGroup] = useState('')
    const [error, setError] = useState('')
    const groups = ['All', ...new Set(exercises.map((exercise) => exercise.muscleGroup))]
    const filtered = exercises
        .filter(
            (exercise) =>
                (group === 'All' || exercise.muscleGroup === group) &&
                `${exercise.name} ${exercise.muscleGroup}`
                    .toLowerCase()
                    .includes(search.toLowerCase()),
        )
        .sort((a, b) => a.name.localeCompare(b.name))

    async function choose(exercise: Exercise) {
        if (!workoutId) return
        const workout = await getEntity('workout', workoutId)
        if (!workout) {
            setError('Workout not found.')
            return
        }
        const index = replaceIndex === undefined ? -1 : Number(replaceIndex)
        const next = workoutExercise(exercise)
        const updated = {
            ...workout,
            exercises:
                index >= 0 && index < workout.exercises.length
                    ? workout.exercises.map((item, i) => (i === index ? next : item))
                    : [...workout.exercises, next],
        }
        await save('workout', updated)
        router.back()
    }

    async function create() {
        if (!name.trim() || !muscleGroup.trim()) {
            setError('Enter a name and muscle group.')
            return
        }
        const exercise: Exercise = {
            id: randomUUID(),
            name: name.trim(),
            muscleGroup: muscleGroup.trim(),
            custom: true,
        }
        await save('exercise', exercise)
        setName('')
        setMuscleGroup('')
        setCreating(false)
        setError('')
        if (workoutId) await choose(exercise)
    }

    return (
        <TrainingLayout
            title="Exercises"
            subtitle={
                workoutId
                    ? 'Choose an exercise for this workout.'
                    : `${exercises.length} exercises on your device.`
            }
            onBack={() => router.back()}
            action={
                <TheButton
                    title="New"
                    icon="plus"
                    size="sm"
                    onPress={() => setCreating((value) => !value)}
                />
            }
        >
            {creating ? (
                <View style={{ gap: 12 }}>
                    <SectionHeading title="Custom exercise" />
                    <TrainingField
                        label="Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g. Chest-supported row"
                    />
                    <TrainingField
                        label="Muscle group"
                        value={muscleGroup}
                        onChangeText={setMuscleGroup}
                        placeholder="e.g. Back"
                    />
                    <TheButton title="Save exercise" onPress={() => void create()} />
                </View>
            ) : null}
            <TrainingField
                label="Search"
                value={search}
                onChangeText={setSearch}
                placeholder="Exercise or muscle group"
            />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {groups.map((item) => (
                    <Pressable
                        key={item}
                        accessibilityRole="button"
                        accessibilityState={{ selected: group === item }}
                        onPress={() => setGroup(item)}
                        style={{
                            minHeight: 44,
                            justifyContent: 'center',
                            borderRadius: theme.radius.pill,
                            paddingHorizontal: 14,
                            backgroundColor:
                                group === item ? theme.colors.accentSoft : theme.colors.surface2,
                        }}
                    >
                        <TheText
                            color={
                                group === item ? theme.colors.accentText : theme.colors.inkSecondary
                            }
                        >
                            {item}
                        </TheText>
                    </Pressable>
                ))}
            </View>
            {error ? <TheText color={theme.colors.danger}>{error}</TheText> : null}
            {!filtered.length ? (
                <TheText color={theme.colors.inkSecondary}>No matching exercises.</TheText>
            ) : null}
            <View style={{ gap: 8 }}>
                {filtered.map((exercise) => (
                    <TrainingRow
                        key={exercise.id}
                        title={exercise.name}
                        subtitle={`${exercise.muscleGroup}${exercise.custom ? ' · Custom' : ''}`}
                        onPress={workoutId ? () => void choose(exercise) : undefined}
                        trailing={
                            !workoutId && exercise.custom ? (
                                <TheButton
                                    title="Delete"
                                    variant="ghost"
                                    size="sm"
                                    onPress={() => {
                                        if (
                                            programs.some((program) =>
                                                program.days.some((day) =>
                                                    day.exerciseIds.includes(exercise.id),
                                                ),
                                            )
                                        ) {
                                            Alert.alert(
                                                'Exercise in use',
                                                'Remove it from your programs before deleting it.',
                                            )
                                            return
                                        }
                                        Alert.alert(
                                            'Delete exercise?',
                                            'Workouts already using it keep their recorded name and sets.',
                                            [
                                                { text: 'Cancel', style: 'cancel' },
                                                {
                                                    text: 'Delete',
                                                    style: 'destructive',
                                                    onPress: () =>
                                                        void remove('exercise', exercise.id),
                                                },
                                            ],
                                        )
                                    }}
                                />
                            ) : undefined
                        }
                    />
                ))}
            </View>
        </TrainingLayout>
    )
}
