# Quick Start Guide

## ⚠️ Before You Start

**Your Node.js version (18.16.0) is too old!**

### Upgrade Node.js First:
```bash
# Using nvm (recommended)
nvm install 20
nvm use 20

# Verify version
node --version  # Should show v20.x.x or higher
```

## 🚀 Run the Application

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

Then open your browser to **http://localhost:5173**

## 🎯 What You'll See

### 1. Sidebar (Left)
- **Toggle Button**: Click to expand/collapse sidebar
- **Menu Items**: Click any item to navigate
- **Active State**: Travel is selected by default (gray background)

### 2. Header (Top)
- Search bar
- Action buttons (bell, plus, user, help)

### 3. Travel Page (Main Content)
- **Stats Dashboard**: Travel spending overview
- **Tabs**: All trips, Active, Upcoming, Completed, Requests
- **Data Table**: 
  - Fixed columns: **Merchant** and **Amount** (always visible)
  - Scrollable columns: Traveler, Transaction date, Flags, etc.
  - Scroll horizontally to see all columns

## 🎨 Key Features to Test

### ✅ Sidebar Toggle
1. Click the toggle button (☰ or ←) in top-left
2. Sidebar should smoothly collapse to 60px (icons only)
3. Click again to expand back to 240px (full labels)

### ✅ Menu Navigation
1. Click different menu items in sidebar
2. Main content area should change
3. Active menu item should be highlighted

### ✅ Table Scrolling
1. In the Travel page, scroll the table horizontally
2. **Merchant** and **Amount** columns should stay fixed
3. Other columns should scroll under them

### ✅ Responsive Layout
- Resize browser window
- Layout should adapt smoothly
- Sidebar toggle helps on smaller screens

## 📁 Files Created

```
src/
├── components/
│   ├── Sidebar.tsx       ← Collapsible sidebar
│   ├── Header.tsx        ← Top header bar
│   ├── Travel.tsx        ← Travel page with table
│   └── ui/               ← shadcn/ui components
│       ├── button.tsx
│       ├── table.tsx
│       ├── badge.tsx
│       ├── scroll-area.tsx
│       └── separator.tsx
└── App.tsx               ← Main app (updated)
```

## 🔧 Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components (https://ui.shadcn.com/)
- **Lucide React** - Icons

## 📝 Important Notes

1. **Fixed Columns**: Merchant and Amount use CSS `position: sticky` to stay visible while scrolling
2. **Horizontal Scroll**: The table container has `overflow-x: auto` for horizontal scrolling
3. **State Management**: Sidebar open/close and active menu are managed in App.tsx
4. **Sample Data**: Table has 6 hardcoded sample entries (you can replace with real data)

## 🎯 What's Working

✅ Sidebar expands and collapses  
✅ Menu navigation changes content  
✅ Fixed columns in table  
✅ Horizontal scrolling  
✅ Active menu highlighting  
✅ Responsive layout  
✅ All shadcn/ui components  
✅ Modern, clean UI matching the screenshots  

## 🐛 Troubleshooting

### "Node.js version" error
- Upgrade to Node.js 20+ (see instructions above)

### "Module not found" errors
- Run `npm install` to install dependencies

### Sidebar not toggling
- Check browser console for errors
- Ensure React is running properly

### Table not scrolling
- Ensure browser window is wide enough
- Check if overflow is working in browser dev tools

## 📚 Documentation

- **SETUP_INSTRUCTIONS.md** - Detailed setup guide
- **FEATURES.md** - Complete feature list
- **QUICK_START.md** - This file

## 🎉 You're All Set!

Once you upgrade Node.js and run `npm run dev`, you should see a fully functional Travel dashboard with:
- Collapsible sidebar
- Navigation between pages
- Beautiful table with fixed columns
- Modern UI using shadcn/ui

Enjoy! 🚀
