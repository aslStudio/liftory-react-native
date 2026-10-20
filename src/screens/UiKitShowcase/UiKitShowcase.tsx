import { useState } from 'react'
import { ScrollView, View } from 'react-native'

import { useTheme } from '@/shared/lib/theme/use-theme'
import { Card } from '@/shared/ui/Card'
import { Chip } from '@/shared/ui/Chip'
import { ExerciseCard } from '@/shared/ui/ExerciseCard'
import { GoalProgress } from '@/shared/ui/GoalProgress'
import { LineChart } from '@/shared/ui/LineChart'
import { List, ListCaption, ListRow } from '@/shared/ui/List'
import { ProgramCard } from '@/shared/ui/ProgramCard'
import { RestTimer } from '@/shared/ui/RestTimer'
import { SegmentedControl } from '@/shared/ui/SegmentedControl'
import { StatTile } from '@/shared/ui/StatTile'
import { StreakCard } from '@/shared/ui/StreakCard'
import { TabBar } from '@/shared/ui/TabBar'
import { TheButton } from '@/shared/ui/TheButton'
import { TheButtonIcon } from '@/shared/ui/TheButtonIcon'
import { TheText } from '@/shared/ui/TheText'
import { type WeekDay, WeekStrip } from '@/shared/ui/WeekStrip'
import { WorkoutRow } from '@/shared/ui/WorkoutRow'

const WEEK: WeekDay[] = [
    { label: 'M', date: 22, state: 'done', tag: 'Push' },
    { label: 'T', date: 23, state: 'done', tag: 'Pull' },
    { label: 'W', date: 24, state: 'rest', tag: 'Rest' },
    { label: 'T', date: 25, state: 'missed', tag: 'Legs' },
    { label: 'F', date: 26, state: 'planned', tag: 'Push', today: true },
    { label: 'S', date: 27, state: 'planned', tag: 'Pull' },
    { label: 'S', date: 28, state: 'rest', tag: 'Rest' },
]

/**
 * Fundament-stage gallery: renders every shared/ui component so the kit can
 * be eyeballed against `liftory-ui/SPEC.md` without a real screen yet.
 * Grows alongside the component list — see DECISIONS.md for what's pending.
 */
export function UiKitShowcase() {
    const theme = useTheme()
    const [tab, setTab] = useState('today')

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <ScrollView
                contentContainerStyle={{ padding: 16, paddingTop: 64, paddingBottom: 140, gap: 20 }}
            >
                <TheText variant="largeTitle">Liftory UI Kit</TheText>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TheButton
                        title="Light"
                        size="sm"
                        variant="secondary"
                        onPress={() => theme.setThemeMode('light')}
                    />
                    <TheButton
                        title="Dark"
                        size="sm"
                        variant="secondary"
                        onPress={() => theme.setThemeMode('dark')}
                    />
                    <TheButton
                        title="System"
                        size="sm"
                        variant="secondary"
                        onPress={() => theme.setThemeMode('system')}
                    />
                </View>

                <ProgramCard
                    name="Push / Pull / Legs"
                    meta="6 weeks · 6 workouts / week"
                    week={3}
                    totalWeeks={6}
                    weekProgress={0.5}
                    deloadWeek={6}
                    next="Push — Today, 18:00"
                />

                <WeekStrip days={WEEK} />

                <View style={{ gap: 8 }}>
                    <WorkoutRow title="Chest day" />
                    <WorkoutRow title="Back day" done />
                </View>

                <ExerciseCard
                    name="Barbell Bench Press"
                    muscle="Chest · Triceps"
                    group="Superset A"
                    recommendation={{
                        value: '82.5 kg × 6–8',
                        reason: 'Last time 80 kg × 8 on all sets — top of range reached.',
                    }}
                    note="Pause 1s on chest"
                    sets={[
                        {
                            type: 'warmup',
                            previous: '40 × 10',
                            weight: '40',
                            reps: '10',
                            done: true,
                        },
                        {
                            index: 1,
                            previous: '80 × 8',
                            weight: '82.5',
                            reps: '8',
                            rpe: '8',
                            done: true,
                            pr: true,
                        },
                        {
                            index: 2,
                            previous: '80 × 8',
                            weight: '82.5',
                            reps: '7',
                            rpe: '9',
                            done: true,
                        },
                        {
                            index: 3,
                            previous: '80 × 8',
                            suggested: { weight: '82.5', reps: '6–8', rpe: '9' },
                        },
                    ]}
                />

                <RestTimer remaining={84} total={120} next="Bench press · Set 3 · 82.5 kg" />

                <Card
                    title="Stats"
                    icon="chart"
                    action={<TheButtonIcon icon="plus" label="Add" size="sm" />}
                >
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <StatTile label="Record weight" value="82.5" unit="kg" delta="+2.5 kg" />
                        <StatTile label="Total volume" value="17 600" unit="kg" />
                    </View>
                </Card>

                <Card title="Estimated 1RM" icon="trend">
                    <LineChart
                        points={[92, 94, 94, 97, 99, 100, 103]}
                        labels={['Aug 4', '', 'Aug 18', '', 'Sep 1', '', 'Sep 15']}
                        unit="kg"
                        label="Estimated 1RM, kg"
                    />
                </Card>

                <StreakCard
                    weeks={8}
                    completed={23}
                    best={11}
                    history={[false, true, true, true, 'freeze', true, true, true, true, true]}
                />
                <GoalProgress
                    title="Bench Press 120 kg"
                    subtitle="Exercise goal"
                    kind="Max Weight"
                    current={82.5}
                    target={120}
                    unit="kg"
                />

                <SegmentedControl options={['Exercises', 'Stats']} />
                <View style={{ gap: 12 }}>
                    <ListCaption>Selected Exercises</ListCaption>
                    <List>
                        <ListRow
                            title="Bench press"
                            subtitle="4 sets · 6–8 reps"
                            accessory="drag"
                        />
                        <ListRow
                            title="Incline dumbbell press"
                            subtitle="3 sets · 8–10 reps"
                            accessory="drag"
                        />
                    </List>
                    <ListCaption>All Exercises</ListCaption>
                    <List>
                        <ListRow
                            title="Bent-over row"
                            tone="accent"
                            accessory="add"
                            onPress={() => {}}
                        />
                        <ListRow
                            title="Deadlift"
                            tone="accent"
                            accessory="add"
                            onPress={() => {}}
                        />
                    </List>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    <Chip label="Warm-up" />
                    <Chip tone="accent" label="Week 3 of 6" />
                    <Chip tone="success" icon="trend" label="+2.5 kg" />
                    <Chip tone="pr" icon="trophy" label="New PR" />
                </View>
                <TheButton title="Start Workout" size="lg" icon="play" block onPress={() => {}} />
            </ScrollView>

            <TabBar
                style={{ position: 'absolute', bottom: 34 }}
                active={tab}
                onChange={setTab}
                items={[
                    { id: 'today', label: 'Today', icon: 'calendar' },
                    { id: 'programs', label: 'Programs', icon: 'dumbbell' },
                    { id: 'progress', label: 'Progress', icon: 'chart' },
                    { id: 'profile', label: 'Profile', icon: 'user' },
                ]}
            />
        </View>
    )
}
