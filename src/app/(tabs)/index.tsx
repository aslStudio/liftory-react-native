import { router } from 'expo-router'
import { View } from 'react-native'

import { useTraining } from '@/application/training-provider'

import { trainingInsight } from '@/entities/training/insights'
import type { Program } from '@/entities/training/model'
import { newWorkout } from '@/entities/training/workout'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { ProgramCard } from '@/shared/ui/ProgramCard'
import { TheButton } from '@/shared/ui/TheButton'
import { TheText } from '@/shared/ui/TheText'
import {
    SectionHeading,
    TrainingLayout,
    TrainingRow,
} from '@/shared/ui/TrainingLayout/TrainingLayout'
import { type WeekDay, WeekStrip } from '@/shared/ui/WeekStrip'
import { WorkoutRow } from '@/shared/ui/WorkoutRow'

const weekday = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
function localDate(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function TodayScreen() {
    const theme = useTheme()
    const { ready, error, exercises, programs, workouts, save } = useTraining()
    const active = workouts.find((workout) => !workout.finishedAt)
    const program = programs.find((item) => item.status === 'active')
    const today = new Date()
    const monday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - ((today.getDay() + 6) % 7),
    )
    const days: WeekDay[] = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(monday)
        date.setDate(monday.getDate() + index)
        const day = program?.days.find((item) => item.dayOfWeek === index)
        const done = workouts.some(
            (workout) =>
                workout.finishedAt && localDate(new Date(workout.finishedAt)) === localDate(date),
        )
        return {
            label: weekday[index],
            date: date.getDate(),
            today: localDate(date) === localDate(today),
            state: done ? 'done' : day?.rest ? 'rest' : day ? 'planned' : 'empty',
            tag: day?.rest ? 'Rest' : day?.name,
        }
    })
    const week = program
        ? Math.max(
              1,
              Math.min(
                  program.weeks,
                  Math.floor(
                      (today.getTime() - new Date(program.startedAt).getTime()) / 604800000,
                  ) + 1,
              ),
          )
        : 1
    const insight = trainingInsight(workouts, program)

    async function start(name: string, selected: typeof exercises, source?: Program) {
        const workout = newWorkout(name, selected, source)
        await save('workout', workout)
        router.push({ pathname: '/workout', params: { id: workout.id } })
    }

    return (
        <TrainingLayout title="Today" subtitle="Your next session starts here." tabs>
            {!ready ? (
                <TheText color={theme.colors.inkSecondary}>
                    Opening your local training log…
                </TheText>
            ) : null}
            {error ? <TheText color={theme.colors.danger}>{error}</TheText> : null}
            <WeekStrip days={days} />
            {insight ? <TrainingRow title="Training insight" subtitle={insight} /> : null}
            {active ? (
                <TrainingRow
                    title={`Resume ${active.name}`}
                    subtitle="Your sets are saved on this device"
                    onPress={() => router.push({ pathname: '/workout', params: { id: active.id } })}
                />
            ) : null}
            {program ? (
                <ProgramCard
                    name={program.name}
                    week={week}
                    totalWeeks={program.weeks}
                    meta={`${program.days.filter((day) => !day.rest).length} training days per week`}
                    next={
                        program.days.find(
                            (day) => day.dayOfWeek === (today.getDay() + 6) % 7 && !day.rest,
                        )?.name
                    }
                    onStart={() => {
                        const day = program.days.find(
                            (item) => item.dayOfWeek === (today.getDay() + 6) % 7 && !item.rest,
                        )
                        if (day)
                            void start(
                                day.name,
                                exercises.filter((exercise) =>
                                    day.exerciseIds.includes(exercise.id),
                                ),
                                program,
                            )
                    }}
                />
            ) : null}
            <View style={{ gap: 12 }}>
                <SectionHeading
                    title="Training"
                    detail={
                        workouts.filter((workout) => workout.finishedAt).length
                            ? 'Recent activity'
                            : 'Start your log'
                    }
                />
                <TheButton
                    title={active ? 'Continue workout' : 'Start a workout'}
                    icon="play"
                    block
                    onPress={() =>
                        active
                            ? router.push({ pathname: '/workout', params: { id: active.id } })
                            : void start('Quick workout', [])
                    }
                />
                {workouts
                    .filter((workout) => workout.finishedAt)
                    .slice(0, 3)
                    .map((workout) => (
                        <WorkoutRow
                            key={workout.id}
                            title={workout.name}
                            done
                            status={new Date(workout.finishedAt!).toLocaleDateString()}
                            onStart={() =>
                                router.push({ pathname: '/workout', params: { id: workout.id } })
                            }
                            onDelete={false}
                        />
                    ))}
                <TrainingRow
                    title="Workout history"
                    subtitle="Review every completed session"
                    onPress={() => router.push('/history')}
                />
            </View>
            {!program ? (
                <TrainingRow
                    title="Build your first program"
                    subtitle="Choose training days and exercises"
                    onPress={() => router.push('/program-editor')}
                />
            ) : null}
        </TrainingLayout>
    )
}
