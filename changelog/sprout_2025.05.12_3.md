# sprout_2025.05.12#3

## Web — sproutWeb_2025.05.12#3
## Native — sproutNative_2025.05.12#3

### New Features
- **Brand icons**: All PWA icons (16, 32, 180, 192, 512, maskable-512) regenerated with the sprout symbol on a deep-green brand gradient. Favicon and Apple touch icon updated. Native app icon and Android adaptive icon regenerated to match.
- **Tags with spaces**: Tags now allow spaces (e.g. "morning run", "with coffee"). Commas are the delimiter between tags. The `#` prefix is removed from chip display.
- **Carry last mood & energy**: New setting under "Repeat last by default" — copies mood and energy from the most recent log onto every new tap, independent of full repeat-last.
- **Auto-tag recent habits**: New setting — habits logged in the last 5 minutes are automatically added as tags to new logs, creating passive co-occurrence tracking.
- **Per-scheme light mode text**: Each color scheme now tints body text, secondary text, muted text, and borders in light mode to subtly match its hue (e.g. Ocean = blue-navy text, Rose = deep pink text, Ember = warm brown text).

### Bug Fixes
- Desktop content area now fills full viewport height — no bare background gap below short content.
- Screen scroll restored: `screen-transition` wrapper correctly propagates flex height to `.screen` children.
- Settings modals render at root DOM level, always above bottom nav and side nav.
- Import/export result alerts close the settings modal before appearing — no longer obscured.
- `expo-constants` pinned to `~17.0.8` (fixes `ERESOLVE` on npm install).
- `babel-preset-expo` added as devDependency (fixes "Cannot find module" Metro error).
- `expo-splash-screen` pinned to `~0.29.24`.
- PWA `theme-color` meta updated to brand dark background `#09100c`.

### Notes
- Version numbering: no spaces, format `sprout_yyyy.mm.dd#N`.
- In-app changelog updated on every build going forward.
