import { randomUUID } from 'expo-crypto'

import type { Exercise, Program } from './model'

type Preset = {
    name: string
    weeks: number
    days: { dayOfWeek: number; name: string; exercises: string[] }[]
}

export const recommendedPrograms: Preset[] = [
    {
        name: 'Beginner Full Body',
        weeks: 6,
        days: [0, 2, 4].map((dayOfWeek) => ({
            dayOfWeek,
            name: 'Full body',
            exercises: [
                'Back Squat',
                'Barbell Bench Press',
                'Lat Pulldown',
                'Overhead Press',
                'Plank',
            ],
        })),
    },
    {
        name: 'Push / Pull / Legs',
        weeks: 8,
        days: [
            {
                dayOfWeek: 0,
                name: 'Push',
                exercises: [
                    'Barbell Bench Press',
                    'Incline Dumbbell Press',
                    'Overhead Press',
                    'Triceps Pushdown',
                ],
            },
            {
                dayOfWeek: 2,
                name: 'Pull',
                exercises: ['Deadlift', 'Seated Cable Row', 'Lat Pulldown', 'Dumbbell Curl'],
            },
            {
                dayOfWeek: 4,
                name: 'Legs',
                exercises: ['Back Squat', 'Leg Press', 'Leg Curl', 'Standing Calf Raise'],
            },
        ],
    },
    {
        name: 'Upper / Lower',
        weeks: 8,
        days: [
            {
                dayOfWeek: 0,
                name: 'Upper A',
                exercises: [
                    'Barbell Bench Press',
                    'Bent-over Row',
                    'Overhead Press',
                    'Barbell Curl',
                ],
            },
            {
                dayOfWeek: 1,
                name: 'Lower A',
                exercises: ['Back Squat', 'Romanian Deadlift', 'Leg Curl', 'Standing Calf Raise'],
            },
            {
                dayOfWeek: 3,
                name: 'Upper B',
                exercises: [
                    'Pull-up',
                    'Incline Dumbbell Press',
                    'Lateral Raise',
                    'Triceps Pushdown',
                ],
            },
            {
                dayOfWeek: 4,
                name: 'Lower B',
                exercises: ['Deadlift', 'Walking Lunge', 'Leg Extension', 'Plank'],
            },
        ],
    },
    {
        name: 'Dumbbells Only',
        weeks: 6,
        days: [0, 2, 4].map((dayOfWeek) => ({
            dayOfWeek,
            name: 'Dumbbell full body',
            exercises: [
                'Dumbbell Bench Press',
                'Dumbbell Shoulder Press',
                'Walking Lunge',
                'Dumbbell Curl',
            ],
        })),
    },
    {
        name: 'Home Workout',
        weeks: 4,
        days: [0, 2, 4].map((dayOfWeek) => ({
            dayOfWeek,
            name: 'Home full body',
            exercises: ['Push-up', 'Pull-up', 'Plank', 'Walking Lunge'],
        })),
    },
]

export function createPresetProgram(preset: Preset, exercises: Exercise[]): Program {
    return {
        id: randomUUID(),
        name: preset.name,
        weeks: preset.weeks,
        startedAt: new Date().toISOString(),
        status: 'active',
        days: preset.days.map((day) => ({
            dayOfWeek: day.dayOfWeek,
            name: day.name,
            rest: false,
            exerciseIds: day.exercises
                .map((name) => exercises.find((exercise) => exercise.name === name)?.id)
                .filter((id): id is string => !!id),
        })),
    }
}
