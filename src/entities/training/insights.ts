import type { Program, Workout } from './model'
import { completedSets, workoutVolume } from './stats'

const DAY = 86400000

function mondayOf(date: Date) {
    const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
    return monday.getTime()
}

export function programConsistency(
    program: Program | undefined,
    workouts: Workout[],
    now = new Date(),
) {
    if (!program)
        return {
            current: 0,
            best: 0,
            completed: 0,
            planned: 0,
            percentage: 0,
            history: [] as boolean[],
        }
    const start = mondayOf(new Date(program.startedAt))
    const currentWeek = Math.max(
        0,
        Math.min(program.weeks - 1, Math.floor((mondayOf(now) - start) / (7 * DAY))),
    )
    const plannedPerWeek = program.days.filter((day) => !day.rest).length
    let completed = 0
    let planned = 0
    const history: boolean[] = []
    for (let week = 0; week <= currentWeek; week++) {
        const from = start + week * 7 * DAY
        const until = from + 7 * DAY
        const done = workouts.filter(
            (workout) =>
                workout.programId === program.id &&
                workout.finishedAt &&
                new Date(workout.finishedAt).getTime() >= from &&
                new Date(workout.finishedAt).getTime() < until,
        ).length
        completed += Math.min(done, plannedPerWeek)
        planned += plannedPerWeek
        if (week < currentWeek) history.push(plannedPerWeek > 0 && done >= plannedPerWeek)
    }
    let current = 0
    let best = 0
    let run = 0
    for (const onPlan of history) {
        run = onPlan ? run + 1 : 0
        best = Math.max(best, run)
    }
    for (let index = history.length - 1; index >= 0 && history[index]; index--) current++
    return {
        current,
        best,
        completed,
        planned,
        percentage: planned ? Math.round((completed / planned) * 100) : 0,
        history: history.slice(-8),
    }
}

export function weeklyReview(workouts: Workout[], now = new Date()) {
    const from = mondayOf(now)
    const relevant = workouts.filter(
        (workout) => workout.finishedAt && new Date(workout.finishedAt).getTime() >= from,
    )
    return {
        workouts: relevant.length,
        sets: relevant.flatMap(completedSets).length,
        volume: relevant.reduce((sum, workout) => sum + workoutVolume(workout), 0),
    }
}

export function periodRecap(workouts: Workout[], period: 'month' | 'year', now = new Date()) {
    const from =
        period === 'month'
            ? new Date(now.getFullYear(), now.getMonth(), 1)
            : new Date(now.getFullYear(), 0, 1)
    const to =
        period === 'month'
            ? new Date(now.getFullYear(), now.getMonth() + 1, 1)
            : new Date(now.getFullYear() + 1, 0, 1)
    const finished = workouts.filter(
        (workout) =>
            workout.finishedAt &&
            new Date(workout.finishedAt) >= from &&
            new Date(workout.finishedAt) < to,
    )
    const exerciseCount = new Map<string, number>()
    const muscleCount = new Map<string, number>()
    for (const workout of finished) {
        for (const exercise of workout.exercises) {
            const count = exercise.sets.filter((set) => set.done).length
            if (count) {
                exerciseCount.set(exercise.name, (exerciseCount.get(exercise.name) ?? 0) + count)
                muscleCount.set(
                    exercise.muscleGroup,
                    (muscleCount.get(exercise.muscleGroup) ?? 0) + count,
                )
            }
        }
    }
    const top = (counts: Map<string, number>) =>
        [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0]
    return {
        workouts: finished.length,
        sets: finished.flatMap(completedSets).length,
        hours:
            Math.round(
                finished.reduce(
                    (sum, workout) =>
                        sum +
                        Math.max(
                            0,
                            new Date(workout.finishedAt!).getTime() -
                                new Date(workout.startedAt).getTime(),
                        ),
                    0,
                ) / 360000,
            ) / 10,
        volume: finished.reduce((sum, workout) => sum + workoutVolume(workout), 0),
        favoriteExercise: top(exerciseCount),
        topMuscle: top(muscleCount),
    }
}

export function trainingInsight(
    workouts: Workout[],
    program?: Program,
    now = new Date(),
): string | null {
    const finished = workouts.filter((workout) => workout.finishedAt)
    if (!finished.length) return null
    const recentLegs = finished.some((workout) =>
        workout.exercises.some(
            (exercise) =>
                exercise.muscleGroup === 'Legs' &&
                new Date(workout.finishedAt!).getTime() >= now.getTime() - 8 * DAY,
        ),
    )
    if (!recentLegs)
        return 'No leg session logged in the past eight days. Consider adding one to your plan.'
    const consistency = programConsistency(program, workouts, now)
    if (program && consistency.planned > 0 && consistency.percentage >= 90)
        return `You have completed ${consistency.percentage}% of planned sessions so far.`
    return null
}
