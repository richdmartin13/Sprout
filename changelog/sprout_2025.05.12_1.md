# sprout_2025.05.12#1

## Web — sproutWeb_2025.05.12#1

### New Features
- **Brand Guide Applied**: Playfair Display + DM Mono typography integrated throughout. Brand greens (ink `#1a4a2e`, mid `#2d6e47`, light `#3d8f5f`) and cream (`#f4f0e8`) used as the base palette for both dark and light themes.
- **New "Sprout" Color Scheme**: Added as the default accent color scheme featuring the brand greens. Seven total schemes: Sprout, Indigo, Violet, Ocean, Ember, Moss, Rose.
- **Desktop/Tablet Side Navigation** (≥768px): Glass sidebar with Sprout logo lockup, nav items, and "New Habit" button. Replaces bottom nav at wider breakpoints.
- **Sheet → Modal on Desktop**: Bottom sheets become centered dialog modals on desktop for better usability.
- **Settings → Modal-based**: Settings rows now open modals instead of cascading accordion content within the settings page.
- **Tag Suggestions**: Common tags (morning, evening, work, home, social, etc.) plus habit-specific historical tags shown as tappable chips in the log details sheet.
- **Heatmap Auto-scroll**: Heatmap always scrolls to the current day's column on mount.
- **Screen Transitions**: Smooth fade + translate animation between tabs.
- **Nav Layout Fix**: Bottom nav always left-anchored; FAB always right-anchored (invisible when not on Home) to prevent layout jump when switching tabs.
- **Data Export Naming**: Export filename now follows convention `sproutData_yyyy.mm.dd#hh.mm.json`.
- **Apple Liquid Glass (sparingly)**: Glass effects reserved primarily for navigation elements (bottom nav, side nav) per Apple's guidance.

### Bug Fixes
- Bottom nav no longer jumps to center when FAB is hidden on non-Home screens.
- Dark mode base now uses deep forest green-black for on-brand feel.
- Light mode base uses brand cream instead of generic lavender.

### Design
- Playfair Display used for wordmarks, screen titles, and empty state headings.
- DM Mono available as a secondary display face for metadata and timestamps.
- Brand-aligned heatmap gradient for the Sprout color scheme.
- Habit card hover lift on desktop (translateY + shadow).
- Grid expands to 3 columns on tablet, 4 on wide desktop.
- Splash screen uses inline SVG sprout symbol (offline-safe, no image dependency).
