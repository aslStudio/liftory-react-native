import type { Exercise } from './model'

const groups: Record<string, string[]> = {
    Chest: [
        'Barbell Bench Press',
        'Dumbbell Bench Press',
        'Incline Dumbbell Press',
        'Machine Chest Press',
        'Cable Fly',
        'Push-up',
        'Dip',
    ],
    Back: [
        'Deadlift',
        'Romanian Deadlift',
        'Bent-over Row',
        'Seated Cable Row',
        'Lat Pulldown',
        'Pull-up',
        'T-Bar Row',
    ],
    Legs: [
        'Back Squat',
        'Front Squat',
        'Leg Press',
        'Hack Squat',
        'Walking Lunge',
        'Leg Extension',
        'Leg Curl',
        'Standing Calf Raise',
    ],
    Shoulders: [
        'Overhead Press',
        'Dumbbell Shoulder Press',
        'Lateral Raise',
        'Rear Delt Fly',
        'Face Pull',
    ],
    Arms: [
        'Barbell Curl',
        'Dumbbell Curl',
        'Hammer Curl',
        'Cable Curl',
        'Triceps Pushdown',
        'Overhead Triceps Extension',
        'Skull Crusher',
    ],
    Core: ['Plank', 'Crunch', 'Hanging Leg Raise', 'Cable Crunch'],
    Cardio: ['Running', 'Cycling'],
}

export const builtInExercises: Exercise[] = Object.entries(groups).flatMap(([muscleGroup, names]) =>
    names.map((name) => ({
        id: `builtin:${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name,
        muscleGroup,
        custom: false,
    })),
)
