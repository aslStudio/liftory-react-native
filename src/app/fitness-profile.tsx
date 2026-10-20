import { router } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import { useTraining } from '@/application/training-provider'

import type { FitnessProfile } from '@/entities/training/model'
import { nutritionEstimate } from '@/entities/training/nutrition'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { StatTile } from '@/shared/ui/StatTile'
import { TheButton } from '@/shared/ui/TheButton'
import { TheText } from '@/shared/ui/TheText'
import {
    SectionHeading,
    TrainingField,
    TrainingLayout,
} from '@/shared/ui/TrainingLayout/TrainingLayout'

const goals = [
    ['muscle', 'Build muscle'],
    ['fat-loss', 'Lose fat'],
    ['maintenance', 'Maintain'],
    ['strength', 'Strength'],
    ['fitness', 'General fitness'],
] as const
const activities = [
    ['sedentary', 'Mostly sitting'],
    ['light', 'Light'],
    ['moderate', 'Moderate'],
    ['active', 'Very active'],
] as const

export default function FitnessProfileScreen() {
    const { ready } = useTraining()
    if (!ready)
        return (
            <TrainingLayout title="Fitness profile" onBack={() => router.back()}>
                <TheText>Loading…</TheText>
            </TrainingLayout>
        )
    return <ProfileForm />
}

function ProfileForm() {
    const theme = useTheme()
    const { profiles, measurements, save } = useTraining()
    const existing = profiles[0]
    const latestWeight = [...measurements].sort((a, b) => b.date.localeCompare(a.date))[0]?.weight
    const [profile, setProfile] = useState<FitnessProfile>(existing ?? { id: 'fitness-profile' })
    const [age, setAge] = useState(String(existing?.age ?? ''))
    const [height, setHeight] = useState(String(existing?.heightCm ?? ''))
    const [weight, setWeight] = useState(String(existing?.weightKg ?? latestWeight ?? ''))
    const [days, setDays] = useState(String(existing?.trainingDays ?? ''))
    const [error, setError] = useState('')
    const estimate = nutritionEstimate({
        ...profile,
        age: Number(age),
        heightCm: Number(height),
        weightKg: Number(weight.replace(',', '.')),
    })

    function set<K extends keyof FitnessProfile>(key: K, value: FitnessProfile[K]) {
        setProfile((current) => ({ ...current, [key]: value }))
    }

    async function submit() {
        const numericAge = age.trim() ? Number(age) : undefined
        const numericHeight = height.trim() ? Number(height.replace(',', '.')) : undefined
        const numericWeight = weight.trim() ? Number(weight.replace(',', '.')) : undefined
        const numericDays = days.trim() ? Number(days) : undefined
        if (
            (numericAge !== undefined &&
                (!Number.isInteger(numericAge) || numericAge < 13 || numericAge > 100)) ||
            (numericHeight !== undefined &&
                (!Number.isFinite(numericHeight) || numericHeight < 100 || numericHeight > 250)) ||
            (numericWeight !== undefined &&
                (!Number.isFinite(numericWeight) || numericWeight < 25 || numericWeight > 400)) ||
            (numericDays !== undefined &&
                (!Number.isInteger(numericDays) || numericDays < 0 || numericDays > 7))
        ) {
            setError('Check age, height, weight and training days.')
            return
        }
        await save('profile', {
            ...profile,
            age: numericAge,
            heightCm: numericHeight,
            weightKg: numericWeight,
            trainingDays: numericDays,
        })
        router.back()
    }

    return (
        <TrainingLayout
            title="Fitness profile"
            subtitle="Tailor your plan to your routine."
            onBack={() => router.back()}
        >
            <SectionHeading title="Your details" />
            <TrainingField
                label="Age"
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                placeholder="Years"
            />
            <TrainingField
                label="Height, cm"
                value={height}
                onChangeText={setHeight}
                keyboardType="decimal-pad"
                placeholder="175"
            />
            <TrainingField
                label="Weight, kg"
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                placeholder="72.5"
            />
            <TheText color={theme.colors.inkSecondary}>Sex used by the energy estimate</TheText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {(['female', 'male', 'unspecified'] as const).map((value) => (
                    <TheButton
                        key={value}
                        title={value[0].toUpperCase() + value.slice(1)}
                        size="sm"
                        variant={profile.sex === value ? 'primary' : 'secondary'}
                        onPress={() => set('sex', value)}
                    />
                ))}
            </View>
            <SectionHeading title="Training" />
            <TheText color={theme.colors.inkSecondary}>Experience</TheText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {(['beginner', 'intermediate', 'advanced'] as const).map((value) => (
                    <TheButton
                        key={value}
                        title={value[0].toUpperCase() + value.slice(1)}
                        size="sm"
                        variant={profile.experience === value ? 'primary' : 'secondary'}
                        onPress={() => set('experience', value)}
                    />
                ))}
            </View>
            <TrainingField
                label="Training days per week"
                value={days}
                onChangeText={setDays}
                keyboardType="number-pad"
                placeholder="3"
            />
            <TrainingField
                label="Available equipment"
                value={profile.equipment ?? ''}
                onChangeText={(value) => set('equipment', value)}
                placeholder="Gym, dumbbells, home…"
            />
            <TheText color={theme.colors.inkSecondary}>Main goal</TheText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {goals.map(([value, label]) => (
                    <TheButton
                        key={value}
                        title={label}
                        size="sm"
                        variant={profile.goal === value ? 'primary' : 'secondary'}
                        onPress={() => set('goal', value)}
                    />
                ))}
            </View>
            <SectionHeading title="Body & nutrition" detail="Optional estimate" />
            <TheText color={theme.colors.inkSecondary}>Daily activity outside training</TheText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {activities.map(([value, label]) => (
                    <TheButton
                        key={value}
                        title={label}
                        size="sm"
                        variant={profile.activity === value ? 'primary' : 'secondary'}
                        onPress={() => set('activity', value)}
                    />
                ))}
            </View>
            {estimate ? (
                <View style={{ gap: 8 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        <StatTile
                            label="Maintenance"
                            value={estimate.maintenance}
                            unit="kcal/day"
                            style={{ flex: 1, minWidth: 145 }}
                        />
                        <StatTile
                            label="Goal starting point"
                            value={estimate.suggested}
                            unit="kcal/day"
                            style={{ flex: 1, minWidth: 145 }}
                        />
                    </View>
                    <TheText color={theme.colors.inkSecondary}>
                        Rough daily macros: {estimate.protein} g protein · {estimate.fat} g fat ·{' '}
                        {estimate.carbs} g carbs.
                    </TheText>
                    <TheText variant="footnote" color={theme.colors.inkSecondary}>
                        These are starting estimates for adults, not measured needs. Adjust using
                        your weight trend and professional advice where appropriate.
                    </TheText>
                </View>
            ) : (
                <TheText color={theme.colors.inkSecondary}>
                    Enter adult age, height, weight, sex and activity to see an estimate.
                </TheText>
            )}
            {error ? <TheText color={theme.colors.danger}>{error}</TheText> : null}
            <TheButton title="Save profile" block onPress={() => void submit()} />
        </TrainingLayout>
    )
}
