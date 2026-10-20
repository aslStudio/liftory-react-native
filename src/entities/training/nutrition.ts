import type { FitnessProfile } from './model'

const activityFactor = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 }

export function nutritionEstimate(profile: FitnessProfile) {
    const { age, heightCm, weightKg, sex, activity, goal } = profile
    if (!age || !heightCm || !weightKg || !sex || sex === 'unspecified' || !activity) return null
    if (
        age < 18 ||
        age > 100 ||
        heightCm < 100 ||
        heightCm > 250 ||
        weightKg < 25 ||
        weightKg > 400
    )
        return null

    // Mifflin–St Jeor predicts resting expenditure in adults; this is an estimate.
    const resting = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'male' ? 5 : -161)
    const maintenance = Math.round(resting * activityFactor[activity])
    const adjustment = goal === 'muscle' ? 200 : goal === 'fat-loss' ? -200 : 0
    const suggested = maintenance + adjustment
    if (suggested < 1200) return null
    const protein = Math.round(weightKg * 1.6)
    const fat = Math.round(weightKg * 0.8)
    const carbs = Math.max(0, Math.round((suggested - protein * 4 - fat * 9) / 4))
    return { resting: Math.round(resting), maintenance, suggested, protein, fat, carbs }
}
