export type EntityKind =
    'exercise' | 'template' | 'program' | 'workout' | 'measurement' | 'goal' | 'profile'

export type Exercise = {
    id: string
    name: string
    muscleGroup: string
    equipment?: string
    custom: boolean
}

export type ProgramDay = {
    dayOfWeek: number
    name: string
    exerciseIds: string[]
    rest: boolean
}

export type WorkoutTemplate = {
    id: string
    name: string
    exerciseIds: string[]
    notes?: string
}

export type Program = {
    id: string
    name: string
    weeks: number
    startedAt: string
    status: 'active' | 'completed'
    days: ProgramDay[]
}

export type WorkoutSet = {
    id: string
    weight: string
    reps: string
    rpe: string
    type: 'warmup' | 'working' | 'drop'
    done: boolean
}

export type WorkoutExercise = {
    exerciseId: string
    name: string
    muscleGroup: string
    sets: WorkoutSet[]
    note?: string
    supersetGroup?: number
}

export type Workout = {
    id: string
    name: string
    programId?: string
    startedAt: string
    finishedAt?: string
    notes?: string
    exercises: WorkoutExercise[]
}

export type Measurement = {
    id: string
    date: string
    weight: number
    bodyFat?: number
}

export type Goal = {
    id: string
    title: string
    target: number
    metric: 'workouts' | 'volume'
    unit: string
    createdAt: string
    completedAt?: string
}

export type FitnessProfile = {
    id: 'fitness-profile'
    age?: number
    heightCm?: number
    weightKg?: number
    sex?: 'female' | 'male' | 'unspecified'
    experience?: 'beginner' | 'intermediate' | 'advanced'
    trainingDays?: number
    equipment?: string
    goal?: 'muscle' | 'fat-loss' | 'maintenance' | 'strength' | 'fitness'
    activity?: 'sedentary' | 'light' | 'moderate' | 'active'
}

export type EntityByKind = {
    exercise: Exercise
    template: WorkoutTemplate
    program: Program
    workout: Workout
    measurement: Measurement
    goal: Goal
    profile: FitnessProfile
}

export type CloudRecord = {
    id: string
    kind: EntityKind
    payload: string
    revision: number
    writer: string
    deleted: number
}
