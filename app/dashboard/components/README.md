# Dashboard Components

This folder contains UI components for the new nav-body-footer dashboard layout.

## Files

### Core Navigation Components
- `DashboardNav.tsx` - Main navigation header with logo, navigation menu, and user controls
- `NavigationMenu.tsx` - Horizontal navigation menu with dropdown functionality
- `PageHeader.tsx` - Page header component with breadcrumbs and actions

### Features
- **Responsive Design** - Works on all screen sizes
- **RTL Support** - Right-to-left layout for Arabic
- **Dropdown Menus** - Clean dropdown navigation for sub-items
- **Active States** - Visual feedback for current page
- **Badge Support** - Notification badges on menu items

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ DashboardNav (Fixed Header)                             │
│ ├─ Logo + Brand                                         │
│ ├─ NavigationMenu (6 Essential + 1 More)                │
│ └─ QuickActions + UserMenu                              │
├─────────────────────────────────────────────────────────┤
│ Main Content Area (Flexible)                            │
│ ├─ PageHeader (Breadcrumb + Actions)                    │
│ ├─ Content Container                                    │
│ └─ Responsive Grid System                               │
├─────────────────────────────────────────────────────────┤
│ Footer (Fixed/Sticky)                                   │
│ ├─ Copyright Info                                       │
│ ├─ System Status                                        │
│ └─ Version Info                                         │
└─────────────────────────────────────────────────────────┘
```

## Usage

```typescript
import DashboardNav from '@/app/dashboard/components/DashboardNav';
import PageHeader from '@/app/dashboard/components/PageHeader';
``` 