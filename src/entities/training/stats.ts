import type { Workout } from './model'

export function completedSets(workout: Workout) {
    return workout.exercises.flatMap((exercise) =>
        exercise.sets
            .filter((set) => set.done)
            .map((set) => ({
                ...set,
                exerciseId: exercise.exerciseId,
                exerciseName: exercise.name,
            })),
    )
}

export function workoutVolume(workout: Workout) {
    return completedSets(workout).reduce(
        (sum, set) => sum + (Number(set.weight) || 0) * (Number(set.reps) || 0),
        0,
    )
}

export function progressSummary(workouts: Workout[]) {
    const done = workouts.filter((workout) => workout.finishedAt)
    const sets = done.flatMap(completedSets)
    const personalRecords = new Map<
        string,
        { name: string; weight: number; estimatedMax: number }
    >()
    for (const set of sets) {
        const weight = Number(set.weight) || 0
        const reps = Number(set.reps) || 0
        const previous = personalRecords.get(set.exerciseId)
        const estimatedMax = reps > 0 ? weight * (1 + reps / 30) : weight
        if (!previous || estimatedMax > previous.estimatedMax) {
            personalRecords.set(set.exerciseId, { name: set.exerciseName, weight, estimatedMax })
        }
    }
    const days = new Set(done.map((workout) => workout.finishedAt!.slice(0, 10)))
    return {
        workouts: done.length,
        sets: sets.length,
        volume: done.reduce((sum, workout) => sum + workoutVolume(workout), 0),
        trainingDays: days.size,
        personalRecords: [...personalRecords.values()].sort(
            (a, b) => b.estimatedMax - a.estimatedMax,
        ),
    }
}

export function previousSet(workouts: Workout[], exerciseId: string) {
    const history = [...workouts]
        .filter((workout) => workout.finishedAt)
        .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    for (const workout of history) {
        const set = workout.exercises
            .find((exercise) => exercise.exerciseId === exerciseId)
            ?.sets.find((candidate) => candidate.done && candidate.type === 'working')
        if (set) return set
    }
    return null
}

export function progressionSuggestion(workouts: Workout[], exerciseId: string) {
    const last = previousSet(workouts, exerciseId)
    if (!last) return null
    const weight = Number(last.weight)
    const reps = Number(last.reps)
    const rpe = Number(last.rpe)
    if (!Number.isFinite(weight) || !Number.isFinite(reps) || reps < 1) return null
    if (weight > 0 && reps >= 8 && (!rpe || rpe <= 8)) {
        return {
            weight: String(weight + 2.5),
            reps: String(Math.max(5, reps - 2)),
            reason: 'You reached 8 reps with room left. Try a small weight increase.',
        }
    }
    if (reps < 8 && (!rpe || rpe <= 8)) {
        return {
            weight: last.weight,
            reps: String(reps + 1),
            reason: 'Keep the weight and aim for one more rep.',
        }
    }
    return {
        weight: last.weight,
        reps: last.reps,
        reason: 'Repeat this set before increasing the load.',
    }
}
