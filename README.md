# StyleMatch · Expo / React Native

A personal stylist built with **Expo SDK 57**, **React Native 0.86.3**, and **React 19.2.3**. The same native component tree runs on iOS, Android, and the web; navigation uses React Navigation and local state uses Zustand + AsyncStorage.

## Start on your phone

Requirements: Node.js 24+, npm, and Expo Go compatible with SDK 57 on your phone.

```sh
npm ci
npm start
```

Run these commands from this repository on your computer. Connect your computer and phone to the same network, then scan the terminal QR code with Expo Go (Android) or the Camera app (iOS). If LAN discovery is unavailable, `npx expo start --tunnel` is an alternative that requires Expo's tunnel helper and an internet connection. The cloud sandbox's localhost URL is for the browser preview; it is not a phone-accessible Expo QR endpoint.

### Browser preview

```sh
npm run web
```

Open http://localhost:3000. The Coding Agent Preview runs this Expo web target. It is useful for inspecting shared screens, but it does not replace testing native permissions, camera, and share sheets on a phone.

### Simulators and native builds

```sh
npm run android       # Expo Go on an available Android emulator
npm run ios           # Expo Go on an available iOS simulator (macOS)
npx expo run:android  # Generate/build native Android app; requires Android SDK/JDK
npx expo run:ios      # Generate/build native iOS app; requires macOS/Xcode
```

`app.json` declares the app IDs, icons, orientation, camera/photo permission descriptions, and native config plugins. Replace the app IDs with your production identifiers before distribution. No EAS account or store credentials are required to work on the local app.

## What works

- Native Home / Wardrobe / My looks / Profile tabs and stack navigation.
- Daily outfit recommendations, four weighted scores, weather/occasion/mood rules, locked pieces, missing-category detection, and seven-day repeat avoidance.
- Native camera/gallery import with permission handling; manual clothing details, search/filter, edit, remove, and incoming/owned status.
- Saved outfits, wear history, native Share sheet (clipboard fallback on web), editable glow/avoid palettes and preferences.
- Persistent device storage, migration of the earlier web preview's local wardrobe, JSON export via the native share sheet (download on web), and delete data.
- Sample shopping products with brand/search/budget filtering and retailer links. Explicitly marking a purchased sample item incoming does not place an order.

Photos are stored locally as data URIs, so temporary picker files do not disappear after a restart. The per-photo limit is approximately 2 MB; export before clearing storage or reinstalling. There is no cloud backup.

## Still demo integrations

Accounts/email verification, AI face analysis, AI clothing tagging, live location/weather, real retail feeds, checkout, and push notifications need backend/provider integration. The app does not collect a face photo; color preferences are manual. Weather is editable sample data. Recommendations and explanations use deterministic local rules. API keys must stay on a future backend.

## Validation

```sh
npm run check   # Expo SDK dependency compatibility
npm test        # jest-expo + React Native Testing Library and core logic tests
npm run build   # Metro/Hermes export for iOS, Android, and web to dist/
```

An export verifies JS/native-module resolution and Hermes compilation; it is not an APK/IPA build or physical-device test. The Linux task sandbox has no Xcode or Android emulator. Verify camera permissions, image selection, native sharing, and safe areas on devices before release.

The SDK-compatible tooling currently has upstream npm audit advisories in braces, node-forge, uuid and their dependent tools. Nonbreaking fixes have been applied; forced downgrades of Expo/Jest are not appropriate fixes for this project.

## Source map

- `index.js`, `app.json`, `metro.config.js`: Expo entry point and configuration.
- `src/App.js`: native stack/tabs, safe area, font loading, and toast UI.
- `src/native/`: native screens, Zustand/AsyncStorage adapter, design tokens.
- `src/stylematch/`: shared outfit rules, demo data, native garment SVGs and reusable native components.
- `src/platform/`: image picker and platform-specific wardrobe export.

The original repository's unused `src/component/` and `src/images/` assets are retained as historical source; they are not imported by the Expo application.
