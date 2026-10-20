import { router } from 'expo-router'
import { Alert, View } from 'react-native'

import { useTraining } from '@/application/training-provider'

import { createPresetProgram, recommendedPrograms } from '@/entities/training/presets'
import { newWorkout } from '@/entities/training/workout'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { TheButton } from '@/shared/ui/TheButton'
import { TheText } from '@/shared/ui/TheText'
import {
    SectionHeading,
    TrainingLayout,
    TrainingRow,
} from '@/shared/ui/TrainingLayout/TrainingLayout'

const weekday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function ProgramsScreen() {
    const theme = useTheme()
    const { programs, templates, exercises, save, remove } = useTraining()
    return (
        <TrainingLayout
            title="Programs"
            subtitle="A plan you can change at any time."
            tabs
            action={
                <TheButton
                    title="New"
                    icon="plus"
                    size="sm"
                    onPress={() => router.push('/program-editor')}
                />
            }
        >
            {!programs.length ? (
                <TheText color={theme.colors.inkSecondary}>
                    No programs yet. Create one to plan your training week.
                </TheText>
            ) : null}
            {programs.map((program) => (
                <View key={program.id} style={{ gap: 10 }}>
                    <SectionHeading
                        title={program.name}
                        detail={`${program.weeks} weeks · ${program.status}`}
                    />
                    {program.days
                        .filter((day) => !day.rest)
                        .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                        .map((day) => (
                            <TrainingRow
                                key={day.dayOfWeek}
                                title={day.name}
                                subtitle={`${weekday[day.dayOfWeek]} · ${day.exerciseIds.length} exercises`}
                                onPress={async () => {
                                    const workout = newWorkout(
                                        day.name,
                                        exercises.filter((exercise) =>
                                            day.exerciseIds.includes(exercise.id),
                                        ),
                                        program,
                                    )
                                    await save('workout', workout)
                                    router.push({
                                        pathname: '/workout',
                                        params: { id: workout.id },
                                    })
                                }}
                            />
                        ))}
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TheButton
                            title="Edit"
                            variant="secondary"
                            size="sm"
                            onPress={() =>
                                router.push({
                                    pathname: '/program-editor',
                                    params: { id: program.id },
                                })
                            }
                        />
                        <TheButton
                            title={program.status === 'active' ? 'Complete' : 'Reactivate'}
                            variant="ghost"
                            size="sm"
                            onPress={() =>
                                void save('program', {
                                    ...program,
                                    status: program.status === 'active' ? 'completed' : 'active',
                                })
                            }
                        />
                        <TheButton
                            title="Delete"
                            variant="ghost"
                            size="sm"
                            onPress={() =>
                                Alert.alert(
                                    'Delete program?',
                                    'Your workout history will remain.',
                                    [
                                        { text: 'Cancel', style: 'cancel' },
                                        {
                                            text: 'Delete',
                                            style: 'destructive',
                                            onPress: () => void remove('program', program.id),
                                        },
                                    ],
                                )
                            }
                        />
                    </View>
                </View>
            ))}
            <SectionHeading title="Workout templates" detail={`${templates.length} saved`} />
            {templates.map((template) => (
                <View key={template.id} style={{ gap: 6 }}>
                    <TrainingRow
                        title={template.name}
                        subtitle={`${template.exerciseIds.length} exercises`}
                        onPress={async () => {
                            const workout = newWorkout(
                                template.name,
                                exercises.filter((exercise) =>
                                    template.exerciseIds.includes(exercise.id),
                                ),
                            )
                            await save('workout', workout)
                            router.push({ pathname: '/workout', params: { id: workout.id } })
                        }}
                    />
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TheButton
                            title="Edit"
                            variant="ghost"
                            size="sm"
                            onPress={() =>
                                router.push({
                                    pathname: '/template-editor',
                                    params: { id: template.id },
                                })
                            }
                        />
                        <TheButton
                            title="Delete"
                            variant="ghost"
                            size="sm"
                            onPress={() =>
                                Alert.alert('Delete template?', undefined, [
                                    { text: 'Cancel', style: 'cancel' },
                                    {
                                        text: 'Delete',
                                        style: 'destructive',
                                        onPress: () => void remove('template', template.id),
                                    },
                                ])
                            }
                        />
                    </View>
                </View>
            ))}
            <TheButton
                title="New template"
                variant="secondary"
                icon="plus"
                onPress={() => router.push('/template-editor')}
            />
            <SectionHeading title="Ready-made programs" detail="Saved to your device" />
            {recommendedPrograms.map((preset) => (
                <TrainingRow
                    key={preset.name}
                    title={preset.name}
                    subtitle={`${preset.weeks} weeks · ${preset.days.length} sessions per week`}
                    trailing={
                        <TheButton
                            title="Use"
                            size="sm"
                            variant="secondary"
                            onPress={() =>
                                void save('program', createPresetProgram(preset, exercises))
                            }
                        />
                    }
                />
            ))}
            <TrainingRow
                title="Exercise library"
                subtitle={`${exercises.length} exercises, including your own`}
                onPress={() => router.push('/library')}
            />
        </TrainingLayout>
    )
}
