import { periodRecap } from './insights'
import { compareRecords } from './merge'
import type { CloudRecord, Workout } from './model'
import { nutritionEstimate } from './nutrition'
import { previousSet, progressionSuggestion, progressSummary } from './stats'

const record: CloudRecord = {
    id: 'one',
    kind: 'workout',
    payload: '{}',
    revision: 2,
    writer: 'a',
    deleted: 0,
}

describe('offline record resolution', () => {
    it('keeps deletion across devices even when an older edit arrives later', () => {
        expect(
            compareRecords({ ...record, deleted: 1 }, { ...record, revision: 8 }),
        ).toBeGreaterThan(0)
    })

    it('chooses the same winner regardless of pull order', () => {
        const other = { ...record, writer: 'b' }
        expect(compareRecords(record, other)).toBe(-compareRecords(other, record))
    })
})

describe('progress from saved sessions', () => {
    const workout: Workout = {
        id: 'w1',
        name: 'Push',
        startedAt: '2026-10-20T10:00:00.000Z',
        finishedAt: '2026-10-20T11:00:00.000Z',
        exercises: [
            {
                exerciseId: 'bench',
                name: 'Bench Press',
                muscleGroup: 'Chest',
                sets: [
                    { id: 's1', weight: '80', reps: '5', rpe: '8', type: 'working', done: true },
                    { id: 's2', weight: '100', reps: '1', rpe: '9', type: 'working', done: false },
                ],
            },
        ],
    }

    it('excludes unfinished sets and sessions from totals and recommendations', () => {
        const active = { ...workout, id: 'w2', finishedAt: undefined }
        expect(progressSummary([workout, active]).volume).toBe(400)
        expect(progressSummary([workout, active]).sets).toBe(1)
        expect(previousSet([active, workout], 'bench')?.weight).toBe('80')
        expect(progressionSuggestion([active, workout], 'bench')?.weight).toBe('80')
        expect(progressionSuggestion([active, workout], 'bench')?.reps).toBe('6')
        expect(
            periodRecap([workout, active], 'month', new Date('2026-10-21T12:00:00Z')).workouts,
        ).toBe(1)
    })
})

describe('optional energy estimate', () => {
    it('uses adult profile inputs and never guesses when sex is unspecified', () => {
        expect(
            nutritionEstimate({
                id: 'fitness-profile',
                age: 30,
                heightCm: 180,
                weightKg: 80,
                sex: 'male',
                activity: 'moderate',
                goal: 'maintenance',
            })?.maintenance,
        ).toBe(2759)
        expect(
            nutritionEstimate({
                id: 'fitness-profile',
                age: 30,
                heightCm: 180,
                weightKg: 80,
                sex: 'unspecified',
                activity: 'moderate',
            }),
        ).toBeNull()
    })
})
