# Travel Dashboard Application

A modern, responsive travel expense management dashboard built with React, TypeScript, and shadcn/ui components.

## ⚠️ Node.js Version Requirement

This project requires **Node.js 20.19+ or 22.12+** to run Vite properly.

### Upgrade Node.js

**Using nvm (Node Version Manager)** - Recommended:

```bash
# Install nvm if you don't have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 20
nvm install 20
nvm use 20

# Verify version
node --version  # Should show v20.x.x or higher
```

**Download from nodejs.org**:

- Visit https://nodejs.org/
- Download and install Node.js 20 LTS or later

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Then open your browser to **http://localhost:5173**

## 🎯 Features

### ✅ Sidebar Navigation

- **Toggle Button**: Click to expand/collapse sidebar
- Smooth transition animation (300ms)
- Icons remain visible when collapsed (60px width)
- Full menu with labels when expanded (240px width)
- Active menu highlighting

### ✅ Travel Dashboard

- **Stats Overview**: Travel spending statistics
- **Tabs**: All trips, Active, Upcoming, Completed, Requests
- **Data Table**:
  - **Fixed columns**: Merchant and Amount (always visible using sticky positioning)
  - **Scrollable columns**: Traveler, Transaction date, Flags, Booking source, Booking status, Booking start date, Destination, Receipt, Memo, Spent from, Payment type
  - Horizontal scrolling for all columns
  - Sticky headers that stay visible when scrolling vertically
- Search and filter functionality
- Pagination

### ✅ Header Component

- Search bar
- Action buttons (notifications, add, user profile, help)

### ✅ Responsive Layout

- Adapts to different screen sizes
- Sidebar toggle helps on smaller screens

## 🔧 Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components (https://ui.shadcn.com/)
  - Built on Radix UI primitives
  - Fully customizable
  - Accessible by default
- **Lucide React** - Icons

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── table.tsx
│   │   ├── badge.tsx
│   │   ├── scroll-area.tsx
│   │   └── separator.tsx
│   ├── Sidebar.tsx      # Collapsible sidebar with navigation
│   ├── Header.tsx       # Top header bar
│   └── Travel.tsx       # Travel page with table and stats
├── lib/
│   └── utils.ts         # Utility functions
├── App.tsx              # Main app with routing logic
└── main.tsx             # Entry point
```

## 🎨 How It Works

### Application State (App.tsx)

- `isSidebarOpen`: Controls sidebar visibility
- `activeMenu`: Tracks which menu item is selected

### Sidebar Component

- Receives `isOpen`, `onToggle`, `activeMenu`, and `onMenuClick` props
- Renders menu items with active state
- Toggle button switches between expanded and collapsed states

### Travel Component

- Displays travel statistics dashboard
- Table with fixed left columns (Merchant, Amount) using CSS `position: sticky`
- Remaining columns scroll horizontally with `overflow-x: auto`
- Sample data is hardcoded (can be replaced with API calls)

## 🧪 Testing the Application

### Sidebar Toggle

1. Click the toggle button (☰ or ←) in top-left
2. Sidebar should smoothly collapse to icons only
3. Click again to expand back to full width

### Menu Navigation

1. Click different menu items in sidebar
2. Main content area should change
3. Active menu item should be highlighted with gray background

### Table Scrolling

1. In the Travel page, scroll the table horizontally
2. **Merchant** and **Amount** columns should stay fixed
3. Other columns should scroll under them

### Responsive Layout

- Resize browser window
- Layout should adapt smoothly
- Sidebar toggle helps on smaller screens

## 🐛 Troubleshooting

### "Node.js version" error

- Upgrade to Node.js 20+ (see instructions above)
- Verify version: `node --version`

### "Module not found" errors

- Run `npm install` to install dependencies
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Sidebar not toggling

- Check browser console for errors
- Ensure React is running properly
- Clear browser cache and reload

### Table not scrolling

- Ensure browser window is wide enough
- Check if overflow is working in browser dev tools
- Try scrolling with trackpad/mouse wheel while hovering over the table

## 🔧 Customization

### Colors

- **Brand Colors**: Modify brand palette in `tailwind.config.js` (brand.yellow, brand.green, etc.)
- **Neutral Colors**: Full neutral gray scale (50-950) configured
- **Semantic Colors**: Success, warning, and error states
- **CSS Variables**: shadcn/ui color variables in `src/index.css`
- Update component styles in individual files

### Menu Items

- Add more menu items in `Sidebar.tsx`
- Update the icon imports from Lucide React

### Typography

- **Font Sizes**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl configured in `tailwind.config.js`
- **Font Weights**: normal (400), medium (500), semibold (600), bold (700)
- **Font Family**: System font stack for optimal performance
- Line heights are automatically set for each size

### Table Data

- Replace hardcoded data in `Travel.tsx` with API calls
- Add more columns or customize existing ones

### UI Components

- All shadcn/ui components are in `src/components/ui/`
- Customize them according to your needs
- Follow shadcn/ui documentation for adding new components

## 📝 Important Notes

1. **Fixed Columns**: Merchant and Amount use CSS `position: sticky` to stay visible while scrolling
2. **Horizontal Scroll**: The table container has `overflow-x: auto` for horizontal scrolling
3. **State Management**: Sidebar open/close and active menu are managed in App.tsx
4. **Sample Data**: Table has 6 hardcoded sample entries (replace with real data/API)
5. **TypeScript**: All components use TypeScript for type safety
6. **Styling**: Follows the shadcn/ui design system

## 🎉 You're All Set!

Once you upgrade Node.js and run `npm run dev`, you should see a fully functional Travel dashboard with:

- ✅ Collapsible sidebar
- ✅ Navigation between pages
- ✅ Beautiful table with fixed columns
- ✅ Horizontal scrolling
- ✅ Active menu highlighting
- ✅ Responsive layout
- ✅ Modern UI using shadcn/ui

Enjoy! 🚀
