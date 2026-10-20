import { NativeTabs } from 'expo-router/unstable-native-tabs'

import { useTheme } from '@/shared/lib/theme/use-theme'

export default function TabsLayout() {
    const theme = useTheme()

    return (
        <NativeTabs
            tintColor={theme.colors.accent}
            iconColor={{ default: theme.colors.inkSecondary, selected: theme.colors.accent }}
            labelStyle={{
                default: { color: theme.colors.inkSecondary },
                selected: { color: theme.colors.accent },
            }}
            backgroundColor={theme.colors.surface1}
            blurEffect="systemChromeMaterial"
            indicatorColor={theme.colors.accentSoft}
            rippleColor={theme.colors.accentSoft}
        >
            <NativeTabs.Trigger name="index" contentStyle={{ backgroundColor: theme.colors.bg }}>
                <NativeTabs.Trigger.Icon
                    sf={{ default: 'house', selected: 'house.fill' }}
                    md={{ default: 'home', selected: 'home_filled' }}
                />
                <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="programs" contentStyle={{ backgroundColor: theme.colors.bg }}>
                <NativeTabs.Trigger.Icon
                    sf={{ default: 'calendar', selected: 'calendar' }}
                    md="calendar_month"
                />
                <NativeTabs.Trigger.Label>Programs</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="progress" contentStyle={{ backgroundColor: theme.colors.bg }}>
                <NativeTabs.Trigger.Icon
                    sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }}
                    md="bar_chart"
                />
                <NativeTabs.Trigger.Label>Progress</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="profile" contentStyle={{ backgroundColor: theme.colors.bg }}>
                <NativeTabs.Trigger.Icon
                    sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
                    md="person"
                />
                <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
        </NativeTabs>
    )
}
