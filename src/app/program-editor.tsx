import { randomUUID } from 'expo-crypto'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { useTraining } from '@/application/training-provider'

import type { ProgramDay } from '@/entities/training/model'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { TheButton } from '@/shared/ui/TheButton'
import { TheText } from '@/shared/ui/TheText'
import {
    SectionHeading,
    TrainingField,
    TrainingLayout,
    TrainingRow,
} from '@/shared/ui/TrainingLayout/TrainingLayout'

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function ProgramEditorScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>()
    const { ready } = useTraining()
    if (!ready) {
        return (
            <TrainingLayout title="Program" onBack={() => router.back()}>
                <TheText>Loading…</TheText>
            </TrainingLayout>
        )
    }
    return <ProgramEditorForm key={id ?? 'new'} id={id} />
}

function ProgramEditorForm({ id }: { id?: string }) {
    const theme = useTheme()
    const { programs, templates, exercises, save } = useTraining()
    const existing = programs.find((program) => program.id === id)
    const [name, setName] = useState(existing?.name ?? '')
    const [weeks, setWeeks] = useState(String(existing?.weeks ?? 6))
    const [days, setDays] = useState<ProgramDay[]>(existing?.days ?? [])
    const [selectedDay, setSelectedDay] = useState(0)
    const [search, setSearch] = useState('')
    const [choosing, setChoosing] = useState(false)
    const [error, setError] = useState('')

    const selected = days.find((day) => day.dayOfWeek === selectedDay)
    function updateDay(next: ProgramDay) {
        setDays((all) => [...all.filter((day) => day.dayOfWeek !== next.dayOfWeek), next])
    }

    async function submit() {
        const count = Number(weeks)
        if (!name.trim()) {
            setError('Give the program a name.')
            return
        }
        if (!Number.isInteger(count) || count < 1 || count > 52) {
            setError('Choose 1–52 weeks.')
            return
        }
        if (!days.some((day) => !day.rest)) {
            setError('Add at least one training day.')
            return
        }
        await save('program', {
            id: existing?.id ?? randomUUID(),
            name: name.trim(),
            weeks: count,
            startedAt: existing?.startedAt ?? new Date().toISOString(),
            status: existing?.status ?? 'active',
            days,
        })
        router.back()
    }

    return (
        <TrainingLayout
            title={existing ? 'Edit program' : 'New program'}
            subtitle="Pick your training days, then add exercises."
            onBack={() => router.back()}
        >
            <TrainingField
                label="Program name"
                value={name}
                onChangeText={setName}
                placeholder="Push / Pull / Legs"
            />
            <TrainingField
                label="Weeks"
                value={weeks}
                onChangeText={setWeeks}
                keyboardType="number-pad"
                placeholder="6"
            />
            <SectionHeading title="Training week" detail="Repeats each week" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {weekdays.map((label, index) => (
                    <Pressable
                        key={label}
                        accessibilityRole="button"
                        accessibilityState={{ selected: selectedDay === index }}
                        onPress={() => {
                            setSelectedDay(index)
                            setChoosing(false)
                            setSearch('')
                        }}
                        style={{
                            minWidth: 44,
                            minHeight: 44,
                            paddingHorizontal: 12,
                            borderRadius: 12,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor:
                                selectedDay === index ? theme.colors.accent : theme.colors.surface2,
                        }}
                    >
                        <TheText
                            color={selectedDay === index ? theme.colors.onAccent : theme.colors.ink}
                        >
                            {label.slice(0, 3)}
                        </TheText>
                    </Pressable>
                ))}
            </View>
            <SectionHeading
                title={weekdays[selectedDay]}
                detail={selected ? (selected.rest ? 'Rest' : 'Workout') : 'Unplanned'}
            />
            <View style={{ flexDirection: 'row', gap: 8 }}>
                <TheButton
                    title="Workout"
                    size="sm"
                    variant={selected && !selected.rest ? 'primary' : 'secondary'}
                    onPress={() =>
                        updateDay(
                            selected
                                ? { ...selected, rest: false }
                                : {
                                      dayOfWeek: selectedDay,
                                      name: `${weekdays[selectedDay]} workout`,
                                      exerciseIds: [],
                                      rest: false,
                                  },
                        )
                    }
                />
                <TheButton
                    title="Rest"
                    size="sm"
                    variant={selected?.rest ? 'primary' : 'secondary'}
                    onPress={() =>
                        updateDay({
                            dayOfWeek: selectedDay,
                            name: 'Rest',
                            exerciseIds: [],
                            rest: true,
                        })
                    }
                />
                {selected ? (
                    <TheButton
                        title="Clear"
                        size="sm"
                        variant="ghost"
                        onPress={() =>
                            setDays((all) => all.filter((day) => day.dayOfWeek !== selectedDay))
                        }
                    />
                ) : null}
            </View>
            {selected && !selected.rest ? (
                <View style={{ gap: 12 }}>
                    <TrainingField
                        label="Workout name"
                        value={selected.name}
                        onChangeText={(value) => updateDay({ ...selected, name: value })}
                    />
                    {templates.length ? (
                        <View style={{ gap: 8 }}>
                            <SectionHeading title="Use a template" />
                            {templates.map((template) => (
                                <TrainingRow
                                    key={template.id}
                                    title={template.name}
                                    subtitle={`${template.exerciseIds.length} exercises`}
                                    onPress={() =>
                                        updateDay({
                                            ...selected,
                                            name: template.name,
                                            exerciseIds: [...template.exerciseIds],
                                        })
                                    }
                                />
                            ))}
                        </View>
                    ) : null}
                    {selected.exerciseIds.map((exerciseId) => {
                        const exercise = exercises.find((item) => item.id === exerciseId)
                        return exercise ? (
                            <TrainingRow
                                key={exerciseId}
                                title={exercise.name}
                                subtitle={exercise.muscleGroup}
                                trailing={
                                    <TheButton
                                        title="Remove"
                                        variant="ghost"
                                        size="sm"
                                        onPress={() =>
                                            updateDay({
                                                ...selected,
                                                exerciseIds: selected.exerciseIds.filter(
                                                    (id) => id !== exerciseId,
                                                ),
                                            })
                                        }
                                    />
                                }
                            />
                        ) : null
                    })}
                    <TheButton
                        title={choosing ? 'Close library' : 'Add exercise'}
                        variant="secondary"
                        icon="plus"
                        onPress={() => setChoosing((value) => !value)}
                    />
                    {choosing ? (
                        <View style={{ gap: 8 }}>
                            <TrainingField
                                label="Search exercises"
                                value={search}
                                onChangeText={setSearch}
                                placeholder="Name or muscle group"
                            />
                            {exercises
                                .filter(
                                    (exercise) =>
                                        !selected.exerciseIds.includes(exercise.id) &&
                                        `${exercise.name} ${exercise.muscleGroup}`
                                            .toLowerCase()
                                            .includes(search.toLowerCase()),
                                )
                                .slice(0, 12)
                                .map((exercise) => (
                                    <TrainingRow
                                        key={exercise.id}
                                        title={exercise.name}
                                        subtitle={exercise.muscleGroup}
                                        onPress={() => {
                                            updateDay({
                                                ...selected,
                                                exerciseIds: [...selected.exerciseIds, exercise.id],
                                            })
                                            setChoosing(false)
                                            setSearch('')
                                        }}
                                    />
                                ))}
                        </View>
                    ) : null}
                </View>
            ) : null}
            {error ? <TheText color={theme.colors.danger}>{error}</TheText> : null}
            <TheButton title="Save program" block onPress={() => void submit()} />
        </TrainingLayout>
    )
}
