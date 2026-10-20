# Liftory Native — журнал решений

Этот файл — для будущей сессии (человека или агента), которая продолжит работу над `liftory-native`. Он объясняет **почему** проект устроен так, а не описывает **что** лежит в коде (это видно из самого кода). Обновляйте его по ходу работы, не превращайте в changelog — старые решения, которые перестали быть актуальными, лучше переписать, а не копить.

## Контекст

Liftory 2.0 — редизайн тренировочного приложения (см. `../Liftory_2.0_Product_Upgrade_Plan.md`). Готовый UI-кит с токенами/иконками/19 компонентами и SPEC.md лежит в `../liftory-ui/`. Эталон архитектуры и кодстайла — production-проект `~/Documents/major/need/need-steps-native` (Expo + expo-router, FSD-подобные слои, Storybook on-device, Jest + Testing Library).

Эта сессия закрыла **только фундамент**: каркас Expo-проекта + перенос UI-кита в `src/shared/ui/*` по конвенциям эталона + тесты + Storybook. **Бизнес-экранов, навигации по табам, бэкенда и стейт-менеджмента нет** — это следующий этап.

## Архитектура

Слои как в эталоне: `app → application → screens → widgets → features → entities → shared`. На этом этапе реально заполнены только `app`, `application`, `screens/UiKitShowcase` и `shared`. `widgets`, `features`, `entities` — пустые, появятся вместе с первым доменным экраном (Home/Workout/Programs).

- **Expo Router живёт в `src/app/`**, не в корневом `app/`. Это специально — expo-router с SDK 57 поддерживает `src/app` "из коробки" без доп. конфига, и так устроен эталон. Корневой `app/_layout.tsx`/`app/index.tsx` в этом проекте **не создавались** — всё внутри `src/app/`.
- `src/app/_layout.tsx` и `src/app/index.tsx` — тонкие ре-экспорты (`export { default } from '@/application/app-layout'`), как в эталоне. Реальная сборка провайдеров — в `src/application/app-layout.tsx` (GestureHandlerRootView → SafeAreaProvider → ThemeModeProvider → Stack).
- `src/screens/UiKitShowcase` — временный экран-галерея всех компонентов кита вместо настоящего Home. Он и есть сегодняшний `app/index.tsx`. Как только появится первый настоящий экран — замените роут, а Showcase можно либо удалить, либо оставить как dev-инструмент под отдельным роутом (`/_showcase`).

## Тема

`src/shared/config/theme.ts` — токены Liftory (palette dark/light, type, space, radius, shadow, hitSlop), скопированы 1:1 из `liftory-ui/src/theme/tokens.ts`. Это контракт дизайна — трогать значения можно только синхронно с SPEC.md в liftory-ui.

`src/shared/lib/theme/theme-mode-provider.tsx` + `use-theme.ts` — light/dark/system с persist в AsyncStorage, по мотивам эталонного `ThemeModeProvider`, но **без `AccentProvider`** (у Liftory один акцентный цвет, не выбираемый) и **без i18n-зависимости** (в эталоне `useThemeMode` дергает `useI18n()` для текста ошибок — здесь i18n-слоя пока нет, тексты ошибок захардкожены на английском).

Отличие от эталона: начальный `themeMode` — `'dark'`, а не `'system'`. Это сознательно: Liftory dark-first (см. README в liftory-ui), и так тесты детерминированы без мока `useColorScheme`.

## Naming

Префикс `The*` — только у примитивов, обёрток над голыми RN-компонентами: `TheButton` (было `Button`), `TheButtonIcon` (было `IconButton`), `TheText` (**новый**, в liftory-ui не было — компоненты там писали голый `<Text style={[t.type.X,...]}>` инлайн). Это копирует конвенцию эталона: `The*` = design-system-level примитив, остальное — доменные компоненты Liftory со своими именами (`Card`, `Chip`, `StatTile`, `List`/`ListCaption`/`ListRow`, `SegmentedControl`, `TabBar`, `WorkoutRow`, `WeekStrip`, `ProgramCard`, `SetHeader`/`SetRow`, `ExerciseCard`, `RestTimer`, `GoalProgress`, `StreakCard`, `LineChart`, `Icon`).

**Почему завели `TheText`:** без него каждый компонент повторял `style={[t.type.X, {color}]}` вручную. `TheText` принимает `variant` (ключ `t.type.*`) и `color` — остальные компоненты переписаны на него. Один раз — Chip и StatTile используют не-токенный размер текста (11/13 у Chip, 12/16 у delta StatTile) напрямую через `style`, минуя `variant` — это не баг, а как в оригинале (нет подходящего токена; `caption2` не годится, он КАПСОМ).

## Структура файла компонента

Папка на компонент (PascalCase): `model.ts` (типы пропсов + размерные/цветовые маппинги-константы) → `styles.ts` (чистые функции/хуки стилей, принимающие `Theme` из `@/shared/lib/theme/use-theme`) → `<Name>.tsx` (сам компонент) → `index.ts` (barrel) → `<Name>.test.tsx` → `<Name>.stories.tsx` → `__snapshots__/` (генерируется). Эталон на этом уровне воспроизведён буквально — см. `TheButton/` как канонический пример.

## Тесты

`src/shared/lib/test-utils.tsx` — обёртка над `@testing-library/react-native`, `render()` оборачивает в `ThemeModeProvider` (без I18n/Accent — их нет). Паттерн на файл: несколько behavior-тестов (`getByText`/`getByRole`, `fireEvent`, `accessibilityState`) + `it.each` snapshot-тесты по вариантам/размерам/состояниям.

Грабли, с которыми уже столкнулись — не наступайте повторно:

- **Вложенный `<Text>`** (как в `StreakCard`: `<TheText>{weeks}<TheText> weeks on track</TheText></TheText>`) — `getByText('8')` не найдёт только "8", RNTL отдаёт полный текст внешнего узла. Проверяйте по полной строке (`getByText('8 weeks on track')`).
- **`importantForAccessibility="no-hide-descendants"`** (у `SetHeader`) прячет текст от `getByText` по умолчанию — нужен `{ includeHiddenElements: true }`.
- **`accessibilityRole` на `View` без `accessible` не находится `getByRole`** (было в `GoalProgress` — progressbar). Если ставите `accessibilityRole` на `View`, добавляйте `accessible` явно.
- Проверяйте `style` через `StyleSheet.flatten(...)` в тестах — RN-компоненты получают style как массив, а не плоский объект (см. `TheText.test.tsx`).

## Storybook

On-device, как в эталоне: `@storybook/react-native` + `addon-ondevice-controls`/`-actions`, `.rnstorybook/{main.ts,preview.tsx,index.tsx}`. Запуск: `npm run storybook` / `storybook:ios` / `storybook:android` (флаг `STORYBOOK_ENABLED=true`, подхватывается `metro.config.js` через `withStorybook`). `storybook.requires.ts` — генерируется (`npm run storybook:generate`), в git не попадает.

`preview.tsx` оборачивает каждую историю только в `ThemeModeProvider` (в эталоне там ещё `I18nProvider`+`AccentProvider`+`DevMenu` — не нужны, их нет). Названия историй — на русском (`Песочница`, `Варианты`, `Размеры`...), как в эталоне.

## Зависимости — сознательно НЕ добавлены

- **`react-native-reanimated`** — не используется напрямую нигде в `shared/ui` (компоненты кита анимаций не требуют, только `pressed`-opacity). Он всё равно присутствует в `node_modules` как транзитивная зависимость `expo-router`, поэтому `jest.setup.ts` и `jest/resolver.js` всё равно мокают его — иначе тесты падают при импорте `expo-router/entry`.
- **i18n-слой и `AccentProvider`** — см. раздел "Тема" выше.
- **react-query / http-клиент** — появятся вместе с бэкендом, не раньше.

**Не удаляйте** `expo-constants`, `expo-linking`, `@react-native-community/datetimepicker`, `@react-native-community/slider` из зависимостей, даже если `grep` по `src/` не найдёт их использования — это обязательные peer-зависимости (`expo-router` требует первые два, `@storybook/addon-ondevice-controls` — датапикер/слайдер для своих контролов). Проверено на собственном опыте: убрал их, решив что это мусор от невнимательного `expo install`, — `npx expo-doctor` сразу показал "Missing peer dependency". Правильный способ проверки "нужна ли зависимость" в этом проекте — `npx expo-doctor`, а не `grep` по импортам.

## Известные нестрашные предупреждения `expo-doctor`

`npx expo-doctor` показывает 2 failed-проверки, которые принято игнорировать (эталон имеет те же):

1. Скрипт `storybook` в package.json "конфликтует" с `node_modules/.bin/storybook` — это просто имя, не баг.
2. `@types/jest@30` vs ожидаемый SDK-лок `29.5.14` — осознанный пин версии, как в эталоне.

### Дубликат `react-native-safe-area-context` — это БЫЛ настоящий краш, не шум

Изначально здесь было написано "не влияет на тесты/typecheck/bundling, может всплыть при нативной сборке" — это оказалось неверно и привело к реальному крашу у пользователя на устройстве:

```
Invariant Violation: Tried to register two views with the same name RNCSafeAreaProvider
[Storybook startup] TypeError: Cannot read property 'view' of undefined
```

Причина: `@storybook/react-native-ui@10.6.0` (нижняя транзитивная зависимость `@storybook/react-native`) тащил свою копию `react-native-safe-area-context@5.8.0`, а `overrides: { "react-native-safe-area-context": "$react-native-safe-area-context" }` в package.json её не схлопывал — `npm ls` показывал `invalid`, физически на диске лежали ДВЕ копии пакета. Каждая копия на старте регистрирует нативный вид `RNCSafeAreaProvider` под одним и тем же именем → краш уже на этапе инициализации, до того как успевает подняться сам Storybook (вторая ошибка — просто следствие первой: `view` не успевает проинициализироваться).

`npx expo-doctor` **детектирует** такие дубликаты (чек "no duplicate dependencies"), но не чинит их. `overrides` в package.json один не гарантирует реальной дедупликации в `node_modules`, если lock-файл уже был сгенерирован с конфликтом.

**Фикс:** `npm dedupe` (один раз, после чего `package-lock.json` фиксирует правильное разрешение) — проверено, что после этого `rm -rf node_modules && npm install` с нуля стабильно ставит ровно одну копию `react-native-safe-area-context@5.7.0` везде (`npm ls react-native-safe-area-context` должен показывать только `deduped`/`overridden`, без `invalid`).

**Урок на будущее:** любой failed-чек `expo-doctor` про дубликаты native-модулей — не "ignorable", это потенциальный краш на устройстве, даже если web-бандл (`expo export --platform web`) собирается нормально (web не регистрирует нативные view manager'ы тем же механизмом, поэтому там дубликат невидим). После любого изменения зависимостей прогоняйте `npx expo-doctor` **и** `npm ls <пакет>` для всего, что он помечает дубликатом, а не только `npm install`.

## Статус компонентов

Все 19 папок в `src/shared/ui/` перенесены, с тестами и стори, lint/typecheck/jest зелёные (161 тест, 76 снэпшотов):

`Icon`, `TheText`, `TheButton`, `TheButtonIcon`, `Card`, `Chip`, `StatTile`, `List`, `SegmentedControl`, `TabBar`, `WorkoutRow`, `WeekStrip`, `ProgramCard`, `SetRow`, `ExerciseCard`, `RestTimer`, `GoalProgress`, `StreakCard`, `LineChart`.

Проверено: `npm run typecheck`, `npm run lint`, `npm test`, `npx expo export --platform web` (бандл собирается, 1301 модулей), `npx sb-rn-get-stories` (реестр историй генерируется). Запуск на реальном симуляторе/устройстве в этой сессии не делался — нет доступа к iOS/Android тулчейну.

## Текущая архитектура (2026-10-21)

Серверная интеграция удалена из приложения. Актуальные данные: SQLite в `src/entities/training/store.ts`, модель в `model.ts`, синхронизация через private CloudKit в `modules/liftory-cloud` на iOS. Подробности, проверка и настройка Apple Developer описаны в `README.md` и `docs/apple-icloud-setup.md`. Исторический backend-репозиторий перемещён в `../../archives/liftory-backend-2026-10-21`.

Навигация основных разделов использует `NativeTabs` из Expo Router. Старый `TabBar` остался только как компонент UI-кита и в Storybook; в приложении он больше не рендерится.
