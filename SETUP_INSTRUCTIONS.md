# Travel Dashboard Setup Instructions

## ⚠️ Important: Node.js Version Requirement

Your current Node.js version is **18.16.0**, but this project requires **Node.js 20.19+ or 22.12+** to run Vite.

### Upgrade Node.js

You can upgrade Node.js using one of these methods:

1. **Using nvm (Node Version Manager)** - Recommended:
   ```bash
   # Install nvm if you don't have it
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   
   # Install and use Node.js 20
   nvm install 20
   nvm use 20
   ```

2. **Download from nodejs.org**:
   - Visit https://nodejs.org/
   - Download and install Node.js 20 LTS or later

### After Upgrading Node.js

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to the URL shown in the terminal (usually http://localhost:5173)

## ✅ What's Been Created

### Components Created:
1. **Sidebar Component** (`src/components/Sidebar.tsx`)
   - Collapsible sidebar with toggle button
   - Menu items with icons and badges
   - Active state highlighting
   - Smooth expand/collapse animation

2. **Header Component** (`src/components/Header.tsx`)
   - Search bar
   - Action buttons (notifications, add, user profile)

3. **Travel Component** (`src/components/Travel.tsx`)
   - Travel statistics dashboard
   - Data table with:
     - **Fixed columns**: Merchant, Amount (always visible)
     - **Scrollable columns**: Traveler, Transaction date, Flags, Booking source, Booking status, Booking start date, Destination, Receipt, Memo, Spent from, Payment type
   - Tabs for filtering (All trips, Active, Upcoming, Completed, Requests)
   - Search and filter functionality
   - Pagination

4. **UI Components** (shadcn/ui):
   - Button
   - Table
   - Badge
   - Scroll Area
   - Separator

### Features Implemented:
✅ Sidebar expands and collapses on toggle button click
✅ Active menu highlighting
✅ Menu navigation (clicking sidebar items changes the main content)
✅ Fixed columns (Merchant, Amount) in the table
✅ Horizontal scrolling for remaining columns
✅ Responsive layout
✅ Modern UI using shadcn/ui components
✅ TailwindCSS styling

## 🎨 UI Framework

This project uses **shadcn/ui** (https://ui.shadcn.com/) as requested, which provides:
- Beautiful, accessible components
- Built on Radix UI primitives
- Fully customizable with TailwindCSS
- TypeScript support

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
│   ├── Sidebar.tsx      # Main sidebar component
│   ├── Header.tsx       # Header component
│   └── Travel.tsx       # Travel page with table
├── lib/
│   └── utils.ts         # Utility functions
├── App.tsx              # Main app with routing logic
└── main.tsx             # Entry point
```

## 🚀 How It Works

1. **App.tsx** manages the application state:
   - `isSidebarOpen`: Controls sidebar visibility
   - `activeMenu`: Tracks which menu item is selected

2. **Sidebar** component:
   - Receives `isOpen`, `onToggle`, `activeMenu`, and `onMenuClick` props
   - Renders menu items with active state
   - Toggle button switches between expanded (240px) and collapsed (60px) states

3. **Travel** component:
   - Displays travel statistics
   - Table with fixed left columns (Merchant, Amount)
   - Remaining columns scroll horizontally
   - Uses sticky positioning for fixed columns

## 🎯 Key Features

### Sidebar Toggle
- Click the toggle button (☰ or ←) to expand/collapse
- Smooth transition animation (300ms)
- Icons remain visible when collapsed
- Full menu with labels when expanded

### Table Layout
- **Fixed Columns**: Merchant and Amount stay visible while scrolling
- **Horizontal Scroll**: Remaining columns scroll independently
- **Sticky Headers**: Column headers stay visible when scrolling vertically
- **Responsive**: Adapts to different screen sizes

### Navigation
- Click any sidebar menu item to change the main content
- Currently, only the Travel page has full content
- Other pages show placeholder content

## 🔧 Customization

You can easily customize:
- Colors in `tailwind.config.js`
- Component styles in individual component files
- Add more menu items in `Sidebar.tsx`
- Add more data rows in `Travel.tsx`

## 📝 Notes

- The table data is currently hardcoded in `Travel.tsx`
- You can replace it with API calls or props
- All components use TypeScript for type safety
- Styling follows the shadcn/ui design system
