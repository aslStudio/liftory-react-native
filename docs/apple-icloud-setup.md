# iCloud для Liftory: настройка Apple Developer

Apple Account уже есть. Для CloudKit нужна активная команда Apple Developer Program и устройство с включённым iCloud.

1. В [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list) проверьте explicit App ID `vladAstahov.gymTracker.GymTracker` в вашей команде. Если он принадлежит другой команде, выберите новый bundle ID и измените его в `app.json`; новое имя контейнера измените также в `modules/liftory-cloud/ios/CloudStore.swift` и этом документе.
2. В том же разделе создайте **iCloud Container** `iCloud.vladAstahov.gymTracker.GymTracker`. [Порядок создания контейнера](https://developer.apple.com/help/account/identifiers/create-an-icloud-container/).
3. Откройте App ID → **Edit** → включите **iCloud** с поддержкой **CloudKit** и привяжите этот контейнер. После изменения capability обновите provisioning profiles или включите automatic signing в Xcode. [Инструкция Apple по capabilities](https://developer.apple.com/help/account/identifiers/enable-app-capabilities/).
4. Выполните `npx expo prebuild --platform ios`, затем `cd ios && pod install`; откройте `ios/Liftory.xcworkspace`. В target **Liftory** выберите вашу новую Team в **Signing & Capabilities** и включите **Automatically manage signing**. В entitlements должны быть контейнер и сервис `CloudKit`.
5. Соберите приложение на реальном iPhone под вашей Team. Войдите в iCloud в системных настройках устройства. Откройте Liftory → Profile → **Sync now**. Expo Go не содержит локального CloudKit-модуля.
6. Создайте тренировку и дождитесь синхронизации. В [CloudKit Console](https://icloud.developer.apple.com/) откройте контейнер и среду **Development**. Проверьте private zone `LiftoryV1` и record type `LiftoryRecordV1` с полями `kind`, `payload`, `writer` (String), `revision`, `deleted`, `schemaVersion` (Int64).
7. Перед TestFlight примените **Deploy Schema Changes** в CloudKit Console. App Store/TestFlight использует Production; тестовые записи Development при публикации схемы не переносятся. [Документация Apple](https://developer.apple.com/documentation/cloudkit/deploying-an-icloud-container-s-schema).
8. Проверьте восстановление данных на втором устройстве с тем же iCloud Account. При смене iCloud Account приложение блокирует синхронизацию с уже привязанной локальной базой, чтобы не смешивать данные разных людей.

CloudKit здесь используется только для личных записей пользователя. Сервер Liftory, Sign in with Apple, APNs-ключ и App Group для текущей версии не нужны.
