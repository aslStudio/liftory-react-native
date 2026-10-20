import { randomUUID } from 'expo-crypto'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import { useTraining } from '@/application/training-provider'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { TheButton } from '@/shared/ui/TheButton'
import { TheText } from '@/shared/ui/TheText'
import {
    SectionHeading,
    TrainingField,
    TrainingLayout,
    TrainingRow,
} from '@/shared/ui/TrainingLayout/TrainingLayout'

export default function TemplateEditorScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>()
    const { ready } = useTraining()
    if (!ready)
        return (
            <TrainingLayout title="Template" onBack={() => router.back()}>
                <TheText>Loading…</TheText>
            </TrainingLayout>
        )
    return <TemplateForm key={id ?? 'new'} id={id} />
}

function TemplateForm({ id }: { id?: string }) {
    const theme = useTheme()
    const { templates, exercises, save } = useTraining()
    const existing = templates.find((template) => template.id === id)
    const [name, setName] = useState(existing?.name ?? '')
    const [exerciseIds, setExerciseIds] = useState(existing?.exerciseIds ?? [])
    const [notes, setNotes] = useState(existing?.notes ?? '')
    const [search, setSearch] = useState('')
    const [choosing, setChoosing] = useState(false)
    const [error, setError] = useState('')

    async function submit() {
        if (!name.trim() || !exerciseIds.length) {
            setError('Add a name and at least one exercise.')
            return
        }
        await save('template', {
            id: existing?.id ?? randomUUID(),
            name: name.trim(),
            exerciseIds,
            notes,
        })
        router.back()
    }

    return (
        <TrainingLayout
            title={existing ? 'Edit template' : 'New template'}
            subtitle="A reusable workout outside your training plan."
            onBack={() => router.back()}
        >
            <TrainingField
                label="Template name"
                value={name}
                onChangeText={setName}
                placeholder="Upper body"
            />
            <SectionHeading title="Exercises" detail={`${exerciseIds.length} selected`} />
            {exerciseIds.map((exerciseId) => {
                const exercise = exercises.find((item) => item.id === exerciseId)
                return exercise ? (
                    <TrainingRow
                        key={exerciseId}
                        title={exercise.name}
                        subtitle={exercise.muscleGroup}
                        trailing={
                            <TheButton
                                title="Remove"
                                size="sm"
                                variant="ghost"
                                onPress={() =>
                                    setExerciseIds((all) =>
                                        all.filter((item) => item !== exerciseId),
                                    )
                                }
                            />
                        }
                    />
                ) : null
            })}
            <TheButton
                title={choosing ? 'Close library' : 'Add exercise'}
                variant="secondary"
                onPress={() => setChoosing((value) => !value)}
            />
            {choosing ? (
                <View style={{ gap: 8 }}>
                    <TrainingField
                        label="Search"
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Name or muscle group"
                    />
                    {exercises
                        .filter(
                            (exercise) =>
                                !exerciseIds.includes(exercise.id) &&
                                `${exercise.name} ${exercise.muscleGroup}`
                                    .toLowerCase()
                                    .includes(search.toLowerCase()),
                        )
                        .slice(0, 15)
                        .map((exercise) => (
                            <TrainingRow
                                key={exercise.id}
                                title={exercise.name}
                                subtitle={exercise.muscleGroup}
                                onPress={() => {
                                    setExerciseIds((all) => [...all, exercise.id])
                                    setChoosing(false)
                                    setSearch('')
                                }}
                            />
                        ))}
                </View>
            ) : null}
            <TrainingField
                label="Notes"
                value={notes}
                onChangeText={setNotes}
                placeholder="Focus, tempo, equipment…"
                multiline
            />
            {error ? <TheText color={theme.colors.danger}>{error}</TheText> : null}
            <TheButton title="Save template" block onPress={() => void submit()} />
        </TrainingLayout>
    )
}
