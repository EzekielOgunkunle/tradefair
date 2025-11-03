# TradeFair Design System

## Brand Identity
TradeFair is a modern, trustworthy African multi-vendor marketplace platform that connects buyers with quality vendors. The design emphasizes trust, transparency, and ease of use.

## Color Palette

### Primary Colors (Trust & Growth)
- **Emerald 600**: `#059669` - Primary brand color (trust, growth, prosperity)
- **Emerald 700**: `#047857` - Primary hover/active state
- **Emerald 500**: `#10b981` - Light primary variant
- **Emerald 50**: `#ecfdf5` - Very light backgrounds

### Secondary Colors (Energy & Warmth)
- **Amber 500**: `#f59e0b` - Accent color (energy, warmth, African sun)
- **Amber 600**: `#d97706` - Accent hover state
- **Amber 100**: `#fef3c7` - Light accent backgrounds

### Neutral Colors
- **Slate 900**: `#0f172a` - Primary text
- **Slate 700**: `#334155` - Secondary text
- **Slate 500**: `#64748b` - Muted text
- **Slate 200**: `#e2e8f0` - Borders
- **Slate 100**: `#f1f5f9` - Light backgrounds
- **Slate 50**: `#f8fafc` - Lightest backgrounds
- **White**: `#ffffff` - Pure white

### Semantic Colors
- **Success**: `#10b981` (Emerald 500)
- **Error**: `#ef4444` (Red 500)
- **Warning**: `#f59e0b` (Amber 500)
- **Info**: `#3b82f6` (Blue 500)

## Typography

### Font Families
- **Sans**: `Inter, system-ui, -apple-system, sans-serif` - Body text
- **Display**: `Cal Sans, Inter, sans-serif` - Headings and display text
- **Mono**: `Fira Code, Consolas, monospace` - Code and monospace text

### Font Scales
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)
- **5xl**: 3rem (48px)

### Font Weights
- **light**: 300
- **normal**: 400
- **medium**: 500
- **semibold**: 600
- **bold**: 700
- **extrabold**: 800

## Spacing Scale
- **0**: 0
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **5**: 1.25rem (20px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)
- **20**: 5rem (80px)

## Border Radius
- **sm**: 0.375rem (6px) - Small elements
- **DEFAULT**: 0.5rem (8px) - Cards, inputs
- **md**: 0.75rem (12px) - Large cards
- **lg**: 1rem (16px) - Hero sections
- **xl**: 1.5rem (24px) - Special elements
- **full**: 9999px - Pills, avatars

## Shadows
- **sm**: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- **DEFAULT**: `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`
- **md**: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`
- **lg**: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`
- **xl**: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`

## Animation Durations
- **fast**: 150ms - Quick interactions
- **DEFAULT**: 200ms - Standard transitions
- **slow**: 300ms - Smooth animations
- **slower**: 500ms - Page transitions

## Animation Easings
- **ease-in**: `cubic-bezier(0.4, 0, 1, 1)` - Deceleration
- **ease-out**: `cubic-bezier(0, 0, 0.2, 1)` - Acceleration
- **ease-in-out**: `cubic-bezier(0.4, 0, 0.2, 1)` - Smooth
- **spring**: `cubic-bezier(0.34, 1.56, 0.64, 1)` - Bounce effect

## Component-Specific Guidelines

### Buttons
- Primary: Emerald 600 background, white text, hover to Emerald 700
- Secondary: Amber 500 background, white text, hover to Amber 600
- Ghost: Transparent background, Emerald 600 text, hover to Emerald 50 background
- Border radius: DEFAULT (8px)
- Padding: px-6 py-3 (large), px-4 py-2 (medium)

### Cards
- Background: White
- Border: Slate 200
- Border radius: md (12px)
- Padding: p-6 (large), p-4 (medium)
- Shadow: DEFAULT, hover to lg

### Badges
- Border radius: full
- Padding: px-3 py-1
- Font size: sm
- Font weight: medium

### Inputs
- Border: Slate 200
- Focus: Emerald 500 ring
- Border radius: DEFAULT (8px)
- Padding: px-4 py-2

### Toasts (Sonner)
- Success: Emerald 500 accent
- Error: Red 500 accent
- Warning: Amber 500 accent
- Info: Blue 500 accent
- Duration: 4000ms (default)
- Position: bottom-right

## Accessibility
- Minimum contrast ratio: 4.5:1 for normal text
- Minimum contrast ratio: 3:1 for large text
- Focus indicators: 2px ring with Emerald 500
- All interactive elements must have visible focus states

## Motion Design Principles
- **Subtle by default**: Avoid overwhelming animations
- **Purposeful**: Animations should guide user attention
- **Performant**: Use transform and opacity for GPU acceleration
- **Respectful**: Honor prefers-reduced-motion preference
- **Stagger effects**: For lists and grids (50ms delay between items)
- **Hover scale**: 1.02-1.05 for cards and buttons
- **Page transitions**: Fade + slide combinations

## Usage Examples

### Hero Section
- Background: Gradient from Emerald 50 to White
- Heading: 5xl, extrabold, Slate 900
- Subheading: xl, normal, Slate 700
- CTA Button: Primary (Emerald 600)
- Animation: Fade in + slide up with stagger

### Product Cards
- Card background: White
- Image border radius: lg (top)
- Price color: Emerald 600, semibold
- Vendor badge: Amber 100 background, Amber 600 text
- Hover: Scale 1.03, shadow lg
- Animation: Smooth scale transition (200ms)

### Navigation
- Background: White with shadow-sm
- Links: Slate 700, hover to Emerald 600
- Active: Emerald 600, semibold
- Mobile menu: Slide in from right

### Footer
- Background: Slate 900
- Text: Slate 300
- Links: Hover to Emerald 400
- Border: Slate 800
