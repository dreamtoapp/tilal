# Dashboard Helpers

This folder contains utility functions and data structures for the dashboard.

## Files

- `navigationMenu.ts` - Navigation menu configuration and types for the new horizontal navigation structure
  - Contains the organized menu structure with 6 essential sections + 1 "More" menu
  - Defines types for navigation items and their children
  - All links are verified to match existing routes

## Structure

The navigation is organized into:

### Primary Menu (6 Essential Sections)
1. **لوحة التحكم** - Dashboard overview
2. **الطلبات** - Orders management (core business)
3. **المنتجات** - Products & inventory
4. **العملاء** - Customers & support
5. **الفريق** - Team management (drivers, shifts)
6. **الإعدادات** - Basic settings & notifications

### More Menu (6 Secondary Sections)
1. **التسويق** - Marketing
2. **تحسين المحركات** - SEO
3. **المالية** - Finance
4. **التقارير** - Reports
5. **الصيانة** - Maintenance
6. **البيانات** - Data seeding

## Usage

Import the navigation items and types:

```typescript
import { navigationItems, type NavigationItem } from '@/app/dashboard/helpers/navigationMenu';
``` 