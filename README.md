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

## Top-to-bottom color matching

Add or edit a garment to choose its color family and exact HEX shade (3 or 6 digits). Existing pieces use their named color until you set a custom shade. In **Style me**, choose **Balanced**, **Tonal**, or **Bold contrast**. Recommendations compare top/bottom hues, saturation, and lightness, then show both swatches, HEX codes, and a pairing explanation. Color harmony adjusts suggestion order separately from the brief’s four weighted scores. Saved looks retain their garment colors.

These are local styling heuristics, not AI image analysis. Photos are not automatically sampled; use the HEX field to specify a fabric shade. The 0–100 pairing estimate is a style preference guide, not a calibrated confidence score.

**Find inspiration on Pinterest** opens an external search using generic color families, garment type, and occasion. No wardrobe names, photos, skin data, or HEX values are included in the search. Pinterest may show related colors or require sign-in. There is no Pinterest account/API connection: the [official API specification](https://github.com/pinterest/api-description/blob/main/v5/openapi.yaml) documents approved beta access for partner Pin search, and a Pin’s dominant color describes the whole image. A provider-backed clothing analysis integration would need an approved API and suitable image analysis service.

## Still demo integrations

AI face analysis, AI clothing tagging, real retail feeds, checkout, and push notifications remain unconnected. Authentication and outfit-photo analysis have provider adapters and require configuration below. The app does not collect a face photo; color preferences are manual. Weather uses Open-Meteo with location/city selection. Wardrobe recommendations use local rules; the optional outfit-photo check uses the configured AI server. API keys must stay on a future backend.

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

## Live weather, accounts, and outfit checks

### Weather

The Home screen asks for foreground location permission and fetches current conditions from Open-Meteo. Coordinates are rounded to two decimals before the weather request and storage. If access is denied or the request fails, choose **Weather → Search city**. City results include region/country to disambiguate names; the selected city persists until **Use my current location** is selected. Current weather refreshes when Home mounts, and the Weather screen has a refresh action. Errors preserve the previous forecast; sample weather is labeled. Snow and storms also trigger waterproof footwear rules.

[Open-Meteo documentation](https://open-meteo.com/en/docs): the free endpoint is for noncommercial use. Configure a commercial plan/endpoint before a commercial launch. Weather data attribution: Open-Meteo, CC BY 4.0.

### Configure authentication

1. Create a Supabase project. Copy `.env.example` to `.env`. Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the project URL and **publishable** key. Never use a service-role key in the app.
2. Enable Email authentication and email confirmation. Configure production SMTP and email templates in Supabase. New accounts receive confirmation instructions; then they can log in with email/password.
3. Enable Google and Apple providers in Supabase. Configure their developer-console credentials and the Supabase callback URL shown in the dashboard. Apple requires your Apple developer/service identifiers and signing configuration. Supabase stores these provider secrets, not the Expo app.
4. Add exact app redirects to Supabase's allowlist: `stylematch://auth/callback` for a native development/production build, `http://localhost:3000/` for local web, and your deployed HTTPS web origin with a trailing slash. The app uses PKCE. Test OAuth in a native development build (`npx expo run:android` / `npx expo run:ios`); Expo Go is not the supported OAuth callback environment.
5. Restart Metro after changing `.env`. The welcome screen supports email login, account creation, Google, Apple, and a guest option. **Profile → Account & logout** signs out the current device.

Native auth tokens are stored in chunked SecureStore entries; web sessions use sessionStorage. Guest and each authenticated user's wardrobe are stored separately on the device. Logging out hides the account wardrobe and returns to the welcome screen. There is no cloud wardrobe sync, account deletion endpoint, or password recovery UI yet. Export a wardrobe before clearing app data. Local storage is not encrypted wardrobe storage.

Official setup: [Supabase native deep linking](https://supabase.com/docs/guides/auth/native-mobile-deep-linking), [PKCE](https://supabase.com/docs/guides/auth/sessions/pkce-flow).

### Configure AI outfit-photo analysis

The **Check my outfit** screen can take a photo through the native camera or choose one from the gallery. It is an on-demand photo check, not continuous video or virtual garment try-on. Before sending, users must select **Allow photo analysis**, sign in, and tap **Analyze my outfit**. Without the service, the screen still supports local wardrobe/color/weather checks and optional brand shopping suggestions.

1. Copy `server/.env.example` to `server/.env`. Set the same Supabase URL/publishable key, a server-only `OPENAI_API_KEY`, and an image-capable `OPENAI_MODEL` (default `gpt-4.1-mini`). Do not put the AI secret in any `EXPO_PUBLIC_` variable.
2. Run `npm run server` (Node 24+). Health: `http://localhost:3001/health`. Missing provider configuration is reported and analysis returns 503.
3. Deploy `server/` behind HTTPS, set `WEB_ORIGINS` to the exact comma-separated browser origins, and set the app's `EXPO_PUBLIC_STYLE_API_URL` to that reachable HTTPS server origin. A phone cannot reach the cloud sandbox's localhost. Native requests have no browser Origin header; Supabase bearer validation is required for every analysis.
4. Restart/rebuild the app. The server checks the bearer with Supabase, limits requests to ten per user per hour per process, limits body size, times out upstream requests, and validates structured output. For multiple server instances, replace the process-local quota with a shared limit and add ingress limits before production.

Photo bytes are transient in the request and never written by this server or application logs. The OpenAI request uses `store:false`; this does not override provider abuse-monitoring/retention policies. The output is clothing-focused advice with explicit uncertainty, not a judgment of someone's body or proof of exact sizing. It returns category suggestions only; brand links are curated app data. [OpenAI vision](https://developers.openai.com/api/docs/guides/images-vision) and [structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs).

**Check my outfit → Choose your pieces** works without AI. Missing tops, bottoms, footwear, weather layers, and optional replacement choices lead to filtered sample products and brand websites. These links do not guarantee stock, current prices, or a particular size. Purchases are handled by the retailer.

Additional verification: `npm run test:server`. Provider boundary tests use synthetic responses; real confirmation email delivery, Google/Apple OAuth, and AI image quality require your configured accounts and device checks.
