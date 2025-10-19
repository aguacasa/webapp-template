# Theme Management Guide

This guide explains how the dark/light mode theme system works in your app. The implementation is designed for **simplicity and maintainability** - all colors are centralized in one location and automatically propagate throughout the entire application.

---

## Architecture Overview

The theme system consists of three main components:

1. **Theme Provider** - Manages theme state and persistence
2. **Theme Toggle** - UI component for switching themes
3. **CSS Variables** - Unified color system that adapts to the current theme

### How It Works

```
User clicks toggle → Theme state updates → HTML class changes → CSS variables update → All components re-style automatically
```

No component-level changes needed - the entire app responds to the theme automatically.

---

## Core Files

### 1. Theme Provider

**File:** `components/theme-provider.tsx`

The ThemeProvider manages theme state and applies changes to the DOM.

**Key Features:**

- Supports 3 modes: `'light'`, `'dark'`, `'system'`
- Persists user preference in localStorage
- Detects system color scheme preference
- Prevents flash of unstyled content (FOUC)
- Listens for system theme changes

**How it works:**

```typescript
// Applies theme by toggling classes on <html> element
<html class="dark">  // Dark mode
<html class="light"> // Light mode
<html class="dark">  // System mode (dark preference)
```

### 2. Theme Hook

**File:** `hooks/use-theme.ts`

Custom React hook for accessing theme state in components.

**Usage:**

```typescript
import { useTheme } from '@/hooks/use-theme'

function MyComponent() {
  const { theme, setTheme } = useTheme()

  // Current theme: 'light' | 'dark' | 'system'
  console.log(theme)

  // Change theme
  setTheme('dark')
}
```

### 3. Theme Toggle Component

**File:** `components/theme-toggle.tsx`

UI button for switching between themes with smooth icon transitions.

**Behavior:**

- **Sun icon** → Light mode
- **Moon icon** → Dark mode
- **Monitor icon** → System preference

**Click behavior cycles through:**

```
Light → Dark → System → Light → ...
```

### 4. Color System

**File:** `app/globals.css`

All colors are defined using CSS variables with HSL values.

**Structure:**

```css
:root {
  /* Light mode colors */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... 13 total variables */
}

.dark {
  /* Dark mode colors */
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  /* ... 13 total variables */
}
```

**Available CSS Variables:**

- `--background` - Page background
- `--foreground` - Primary text
- `--card` / `--card-foreground` - Card backgrounds and text
- `--popover` / `--popover-foreground` - Popover/dropdown colors
- `--primary` / `--primary-foreground` - Primary actions
- `--secondary` / `--secondary-foreground` - Secondary actions
- `--muted` / `--muted-foreground` - Muted backgrounds and text
- `--accent` / `--accent-foreground` - Accent highlights
- `--destructive` / `--destructive-foreground` - Error/danger states
- `--border` - Border colors
- `--input` - Input field borders
- `--ring` - Focus ring colors

### 5. Root Layout

**File:** `app/layout.tsx`

Wraps the app with ThemeProvider and includes anti-FOUC script.

**Key elements:**

```typescript
<html suppressHydrationWarning>
  <head>
    {/* Anti-FOUC script - applies theme before React hydrates */}
    <script dangerouslySetInnerHTML={{...}} />
  </head>
  <body>
    <ThemeProvider defaultTheme="system">
      {children}
    </ThemeProvider>
  </body>
</html>
```

---

## Adding Theme Toggle to Pages

The theme toggle is already added to the landing page header. To add it elsewhere:

### Example: Dashboard Header

```typescript
import { ThemeToggle } from '@/components/theme-toggle'

export function DashboardHeader() {
  return (
    <header>
      <nav>
        {/* Your navigation items */}
      </nav>
      <ThemeToggle />
    </header>
  )
}
```

### Example: User Menu Dropdown

```typescript
import { useTheme } from '@/hooks/use-theme'
import { Moon, Sun, Monitor } from 'lucide-react'

export function UserMenu() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## Customizing Colors

### Changing Theme Colors

Edit `app/globals.css` to customize the color scheme:

**Example: Changing primary color**

```css
:root {
  /* Light mode - Blue primary */
  --primary: 221 83% 53%; /* HSL values */
}

.dark {
  /* Dark mode - Blue primary */
  --primary: 217 91% 60%;
}
```

**Tips:**

- Use HSL format: `hue saturation% lightness%`
- Tools for color generation:
  - [HSL Color Picker](https://hslpicker.com/)
  - [Coolors](https://coolors.co/)
  - [Realtime Colors](https://realtimecolors.com/)
- Test both light and dark modes after changes
- Ensure sufficient contrast for accessibility (WCAG AA)

### Adding New Color Variables

```css
:root {
  --success: 142 71% 45%;
  --success-foreground: 0 0% 100%;
}

.dark {
  --success: 142 71% 35%;
  --success-foreground: 0 0% 100%;
}
```

Then use in Tailwind:

```typescript
// tailwind.config.ts
colors: {
  success: 'hsl(var(--success))',
  'success-foreground': 'hsl(var(--success-foreground))',
}
```

```tsx
// Component
<div className="bg-success text-success-foreground">Success message</div>
```

---

## Transition Customization

### Current Settings

**File:** `app/globals.css` (lines 60-70)

All color-based properties transition smoothly over 200ms:

```css
* {
  transition-property:
    color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
```

### Disabling Transitions for Specific Elements

Add `data-no-transition` attribute:

```tsx
<div data-no-transition>{/* This element won't animate theme changes */}</div>
```

### Changing Transition Speed

Edit `app/globals.css`:

```css
* {
  transition-duration: 300ms; /* Slower transition */
}

/* OR */

* {
  transition-duration: 100ms; /* Faster transition */
}
```

---

## Writing Theme-Aware Components

### Use Semantic Color Classes

**Good:**

```tsx
// Uses CSS variables - automatically theme-aware
<div className="border-border bg-background text-foreground">
  <h1 className="text-primary">Title</h1>
  <p className="text-muted-foreground">Description</p>
</div>
```

**Bad:**

```tsx
// Hardcoded colors - won't change with theme
<div className="border-gray-300 bg-white text-black">
  <h1 className="text-blue-600">Title</h1>
  <p className="text-gray-500">Description</p>
</div>
```

### Conditional Styling Based on Theme

If you need different behavior per theme:

```tsx
import { useTheme } from '@/hooks/use-theme'

function MyComponent() {
  const { theme } = useTheme()

  return (
    <div>
      {theme === 'dark' ? (
        <DarkModeSpecificFeature />
      ) : (
        <LightModeSpecificFeature />
      )}
    </div>
  )
}
```

### Images with Theme Variants

```tsx
import { useTheme } from '@/hooks/use-theme'

function Logo() {
  const { theme } = useTheme()

  return (
    <Image
      src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
      alt="Logo"
      width={200}
      height={50}
    />
  )
}
```

---

## Testing Theme Implementation

### Manual Testing Checklist

- [ ] Toggle cycles through light → dark → system
- [ ] Theme persists after page reload
- [ ] No flash of wrong theme on page load
- [ ] System mode respects OS preference
- [ ] System mode updates when OS preference changes
- [ ] All pages/components respond to theme changes
- [ ] Colors transition smoothly (200ms)
- [ ] Focus states visible in both themes
- [ ] Text readable in both themes (contrast check)

### Browser Testing

```bash
# Start dev server
npm run dev

# Visit in browser
http://localhost:3000
```

**Test flows:**

1. Toggle theme and check all sections of landing page
2. Refresh page - theme should persist
3. Open DevTools → Storage → Local Storage → Check `theme` key
4. Change OS theme preference - system mode should update
5. Test in different browsers (Chrome, Firefox, Safari)

### Accessibility Testing

**Contrast Ratios:**

- Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Minimum ratio: 4.5:1 for normal text (WCAG AA)
- Minimum ratio: 3:1 for large text

**Keyboard Navigation:**

- Theme toggle should be focusable with Tab
- Activatable with Enter/Space
- Focus ring visible in both themes

---

## Troubleshooting

### Flash of Unstyled Content (FOUC)

**Problem:** White flash before theme loads

**Solution:** Ensure anti-FOUC script is in `app/layout.tsx`:

```typescript
<script
  dangerouslySetInnerHTML={{
    __html: `
      (function() {
        const theme = localStorage.getItem('theme') || 'system';
        const root = document.documentElement;

        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(theme);
        }
      })();
    `,
  }}
/>
```

### Theme Not Persisting

**Problem:** Theme resets on page reload

**Check:**

1. ThemeProvider is wrapping app in `layout.tsx`
2. localStorage is available (not blocked)
3. Browser console for errors

### System Mode Not Working

**Problem:** System preference not detected

**Check:**

1. Browser supports `prefers-color-scheme` media query
2. OS has theme preference set
3. Browser DevTools → Rendering → "Emulate CSS media feature prefers-color-scheme"

### Hydration Warnings

**Problem:** React hydration mismatch warnings

**Solution:** Ensure `suppressHydrationWarning` on `<html>` tag:

```typescript
<html suppressHydrationWarning>
```

### Colors Not Updating

**Problem:** Some components don't respond to theme

**Fix:** Ensure using semantic Tailwind classes:

```tsx
// ❌ Won't work
className = 'bg-white text-black'

// ✅ Will work
className = 'bg-background text-foreground'
```

---

## Advanced Customization

### Multiple Theme Variants

To support more than light/dark (e.g., high contrast):

**1. Update Theme Type:**

```typescript
// components/theme-provider.tsx
export type Theme = 'light' | 'dark' | 'high-contrast' | 'system'
```

**2. Add CSS Variables:**

```css
/* app/globals.css */
.high-contrast {
  --background: 0 0% 0%;
  --foreground: 0 0% 100%;
  /* ... other high-contrast colors */
}
```

**3. Update Toggle Component:**

```typescript
// components/theme-toggle.tsx
const handleToggle = () => {
  if (theme === 'light') setTheme('dark')
  else if (theme === 'dark') setTheme('high-contrast')
  else if (theme === 'high-contrast') setTheme('system')
  else setTheme('light')
}
```

### Per-Page Theme Override

Force a specific theme on certain pages:

```typescript
// app/special-page/page.tsx
'use client'

import { useTheme } from '@/hooks/use-theme'
import { useEffect } from 'react'

export default function SpecialPage() {
  const { setTheme } = useTheme()

  useEffect(() => {
    // Force dark mode on this page
    setTheme('dark')
  }, [])

  return <div>Always dark page</div>
}
```

---

## Best Practices

### ✅ Do's

- **Always use semantic color classes** (`bg-background`, `text-foreground`)
- **Test both themes** when adding new components
- **Use HSL color format** for CSS variables
- **Maintain consistent contrast ratios** (WCAG AA minimum)
- **Add theme toggle to main navigation** for easy access
- **Use system preference as default** (respects user's OS setting)

### ❌ Don'ts

- **Don't hardcode colors** (`bg-white`, `text-black`, `border-gray-300`)
- **Don't use RGB or hex in CSS variables** (use HSL for easier manipulation)
- **Don't forget keyboard accessibility** on theme toggle
- **Don't skip testing theme persistence** across page reloads
- **Don't override transitions globally** without good reason

---

## Summary

**The theme system works through 3 simple layers:**

1. **State Management** - ThemeProvider tracks current theme
2. **DOM Application** - Theme class applied to `<html>` element
3. **CSS Response** - Variables update, all components re-style automatically

**You maintain themes in ONE location:**

- `app/globals.css` - Edit CSS variables for light/dark colors

**Everything else is automatic:**

- ✅ All components respond to theme changes
- ✅ User preference persisted in localStorage
- ✅ System preference detected and respected
- ✅ No flash of unstyled content
- ✅ Smooth 200ms transitions
- ✅ Fully accessible theme toggle

**Build theme-aware components easily:**

```tsx
// Just use semantic classes - that's it!
<div className="border-border bg-background text-foreground">
  <h1 className="text-primary">Content</h1>
</div>
```

Ship beautiful light and dark modes with minimal effort! 🌓
