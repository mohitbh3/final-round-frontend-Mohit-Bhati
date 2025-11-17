# Tailwind Configuration Reference

## Brand Colors

Use these colors for brand-specific elements:

```jsx
// Primary brand yellow (CTAs, highlights)
className = "bg-brand-yellow hover:bg-brand-yellow-dark";

// Brand greens (progress bars, success states)
className = "bg-brand-green";
className = "bg-brand-green-light";
className = "bg-brand-green-dark";

// Brand purples (charts, accents)
className = "bg-brand-purple";
className = "bg-brand-purple-dark";

// Other brand colors
className = "bg-brand-orange";
className = "bg-brand-tan";
```

### Color Codes

- `brand-yellow`: #E4F222
- `brand-yellow-dark`: #ebfc00
- `brand-green`: #439858
- `brand-green-light`: #75876F
- `brand-green-dark`: #5E540E
- `brand-orange`: #C87F8D
- `brand-purple`: #7B5C8E
- `brand-purple-dark`: #684162
- `brand-tan`: #C4A15C

## Neutral Colors

Full gray scale from 50 (lightest) to 950 (darkest):

```jsx
// Backgrounds
className = "bg-neutral-50"; // Sidebar, card backgrounds
className = "bg-neutral-100"; // Hover states, input backgrounds

// Borders
className = "border-neutral-200"; // Most borders
className = "border-neutral-300";

// Text
className = "text-neutral-600"; // Secondary text
className = "text-neutral-700"; // Body text
className = "text-neutral-800"; // Headings
className = "text-neutral-900"; // Primary text
```

## Semantic Colors

### Success

```jsx
className = "bg-success-50 text-success-700"; // Success badges
className = "border-success-200";
```

### Warning

```jsx
className = "bg-warning-50 text-warning-700"; // Warning states
className = "text-warning-900"; // Dark warning text
```

### Error

```jsx
className = "bg-error-50 text-error-600"; // Error states
```

## Typography

### Font Sizes

```jsx
className = "text-xs"; // 0.75rem / 12px - Small labels, captions
className = "text-sm"; // 0.875rem / 14px - Body text, buttons
className = "text-base"; // 1rem / 16px - Default body text
className = "text-lg"; // 1.125rem / 18px - Large body, subheadings
className = "text-xl"; // 1.25rem / 20px - Section titles
className = "text-2xl"; // 1.5rem / 24px - Page titles
className = "text-3xl"; // 1.875rem / 30px - Main headings
className = "text-4xl"; // 2.25rem / 36px - Hero text, large stats
```

### Font Weights

```jsx
className = "font-normal"; // 400 - Body text
className = "font-medium"; // 500 - Emphasized text
className = "font-semibold"; // 600 - Headings, buttons
className = "font-bold"; // 700 - Strong emphasis
```

### Usage Examples

```jsx
// Page heading
<h1 className="text-3xl font-medium">Travel</h1>

// Section title
<h2 className="text-xl font-semibold">Expenses</h2>

// Body text
<p className="text-sm text-neutral-700">Description here</p>

// Small label
<span className="text-xs text-neutral-600">Transaction date</span>

// Large stat
<div className="text-4xl font-medium">$52,634.57 USD</div>
```

## Common Patterns

### Buttons

```jsx
// Primary CTA (yellow)
<Button className="bg-brand-yellow hover:bg-brand-yellow-dark text-black">
  Book travel
</Button>

// Secondary button (outline)
<Button variant="outline" size="sm">
  Manage
</Button>

// Ghost button
<Button variant="ghost" size="icon">
  <Icon />
</Button>
```

### Cards

```jsx
// Card with hover
<div className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50">
  Content
</div>

// Stat card
<div className="bg-neutral-50 rounded-lg p-6">
  <div className="text-xs text-neutral-600 mb-1">Label</div>
  <div className="text-lg font-semibold">$789.52</div>
</div>
```

### Tables

```jsx
// Table header
<TableHead className="text-xs text-neutral-600 bg-neutral-50">
  Merchant
</TableHead>

// Table cell
<TableCell className="text-sm text-neutral-700">
  Value
</TableCell>
```

### Badges

```jsx
// Success badge
<Badge className="text-xs text-success-700 bg-success-50 border-success-200">
  Cleared
</Badge>

// Yellow badge (high priority)
<Badge className="bg-brand-yellow text-yellow-900">
  276
</Badge>

// Neutral badge
<Badge className="bg-neutral-200 text-neutral-700">
  27
</Badge>
```

### Progress Bars

```jsx
<div className="h-2 bg-neutral-100 rounded-none overflow-hidden">
  <div className="h-full flex">
    <div className="bg-brand-green" style={{ width: "60%" }} />
    <div className="bg-brand-tan" style={{ width: "20%" }} />
    <div className="bg-brand-purple" style={{ width: "20%" }} />
  </div>
</div>
```

## Spacing

Custom spacing utilities:

- `h-13` / `w-13` - 3.25rem (52px)
- `h-15` / `w-15` - 3.75rem (60px)
- `h-18` / `w-18` - 4.5rem (72px)

## Border Radius

Uses CSS variables from shadcn/ui:

- `rounded-lg` - var(--radius)
- `rounded-md` - var(--radius) - 2px
- `rounded-sm` - var(--radius) - 4px

Default radius is `0.5rem` (8px)

## Transitions

```jsx
// Sidebar animation
className = "transition-all duration-300";

// Custom duration
className = "transition-opacity duration-300";
```

## Dark Mode Support

Dark mode is configured with `class` strategy:

```jsx
// Will automatically switch in dark mode
className = "bg-background text-foreground";
className = "border-border";
```

To enable dark mode, add `dark` class to html element.

## shadcn/ui Variables

These use CSS variables from `src/index.css`:

```jsx
className = "bg-background"; // Page background
className = "text-foreground"; // Primary text
className = "bg-card"; // Card background
className = "bg-popover"; // Popup/dropdown background
className = "bg-muted"; // Muted backgrounds
className = "text-muted-foreground"; // Muted text
className = "border-border"; // Standard borders
className = "ring-ring"; // Focus rings
```

## Tips

1. **Consistent spacing**: Use standard Tailwind spacing scale (4, 6, 8, etc.)
2. **Text contrast**: Ensure sufficient contrast for accessibility
3. **Hover states**: Always add hover states to interactive elements
4. **Mobile-first**: Use responsive classes (sm:, md:, lg:)
5. **Dark mode**: Test components in both light and dark mode

## File Locations

- **Config**: `tailwind.config.js`
- **CSS Variables**: `src/index.css`
- **Components**: `src/components/`
- **shadcn Config**: `components.json`
