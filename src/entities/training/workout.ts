import { randomUUID } from 'expo-crypto'

import type { Exercise, Program, Workout, WorkoutExercise, WorkoutSet } from './model'

export function newSet(type: WorkoutSet['type'] = 'working'): WorkoutSet {
    return { id: randomUUID(), weight: '', reps: '', rpe: '', type, done: false }
}

export function workoutExercise(exercise: Exercise): WorkoutExercise {
    return {
        exerciseId: exercise.id,
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        sets: [newSet()],
    }
}

export function newWorkout(name: string, exercises: Exercise[], program?: Program): Workout {
    return {
        id: randomUUID(),
        name: name.trim() || 'Workout',
        programId: program?.id,
        startedAt: new Date().toISOString(),
        exercises: exercises.map(workoutExercise),
    }
}
