'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarRail,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { TimeAgo } from '@/components/ui/time-ago';
import { menuGroups } from '../helpers/mainMenu';
import { Icon } from '@/components/icons/Icon';

// Define type for menu items (icon is now a string)
interface MenuItem {
  title: string;
  url: string;
  icon: string;
  children?: MenuItem[];
}

// Enhanced menu item with color mapping
const getMenuItemColors = (groupIndex: number) => {
  const colorMap: Record<number, { border: string; text: string; bg: string }> = {
    0: { border: 'border-l-feature-analytics', text: 'text-feature-analytics', bg: 'bg-feature-analytics-soft' }, // Dashboard
    1: { border: 'border-l-feature-commerce', text: 'text-feature-commerce', bg: 'bg-feature-commerce-soft' }, // Orders
    2: { border: 'border-l-feature-products', text: 'text-feature-products', bg: 'bg-feature-products-soft' }, // Products
    3: { border: 'border-l-feature-users', text: 'text-feature-users', bg: 'bg-feature-users-soft' }, // Customers
    4: { border: 'border-l-feature-users', text: 'text-feature-users', bg: 'bg-feature-users-soft' }, // Team
    5: { border: 'border-l-feature-commerce', text: 'text-feature-commerce', bg: 'bg-feature-commerce-soft' }, // Marketing
    6: { border: 'border-l-feature-analytics', text: 'text-feature-analytics', bg: 'bg-feature-analytics-soft' }, // Analytics
    7: { border: 'border-l-feature-suppliers', text: 'text-feature-suppliers', bg: 'bg-feature-suppliers-soft' }, // Finance
    8: { border: 'border-l-feature-settings', text: 'text-feature-settings', bg: 'bg-feature-settings-soft' }, // Settings
    9: { border: 'border-l-feature-analytics', text: 'text-feature-analytics', bg: 'bg-feature-analytics-soft' }, // SEO
  };
  return colorMap[groupIndex] || colorMap[8]; // Default to settings colors
};

export default function AppSidebar() {

  const side: 'left' | 'right' = 'right';
  const pathname = usePathname();
  const [collapsedGroups, setCollapsedGroups] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleGroup = (idx: number) => {
    setCollapsedGroups((groups) =>
      groups.includes(idx) ? groups.filter((i) => i !== idx) : [...groups, idx],
    );
  };

  const toggleFavorite = (url: string) => {
    setFavorites(prev =>
      prev.includes(url) ? prev.filter(fav => fav !== url) : [...prev, url]
    );
  };

  return (
    <Sidebar side={side} className='flex h-screen flex-col border-r bg-background rtl:text-right shadow-lg'>

      {/* Enhanced Header */}
      <SidebarHeader className='p-4 border-b bg-feature-analytics-soft'>
        <div className='flex items-center gap-2 mb-3'>
          <div className='h-8 w-8 rounded-lg bg-feature-analytics flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>ع</span>
          </div>
          <div className='flex-1'>
            <h2 className='font-bold text-lg text-feature-analytics'>لوحة التحكم</h2>
            <p className='text-xs text-muted-foreground'>إدارة متطورة</p>
          </div>
        </div>
        {/* Quick Access Favorites */}
        {favorites.length > 0 && (
          <div className='mt-3'>
            <p className='text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1'>
              <Icon name="Star" size="xs" className="h-3 w-3" />
              المفضلة
            </p>
            <div className='flex flex-wrap gap-1'>
              {favorites.slice(0, 3).map(fav => {
                const favItem = menuGroups.flatMap(g => g.items).find(item => item.url === fav);
                return favItem ? (
                  <Link key={fav} href={fav}>
                    <Badge variant="secondary" className='text-xs'>
                      <Icon name={favItem.icon} size="xs" className="h-3 w-3 mr-1 icon-enhanced" />
                      {favItem.title.slice(0, 8)}...
                    </Badge>
                  </Link>
                ) : null;
              })}
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className='flex-1 overflow-y-auto p-2'>
        {menuGroups.map((group, i) => {
          const isCollapsed = collapsedGroups.includes(i);
          const colors = getMenuItemColors(i);

          return (
            <SidebarGroup key={i} className='mb-4'>
              {/* Enhanced Group Header */}
              <button
                className={`
                  flex w-full items-center justify-between px-3 py-3 text-sm font-semibold 
                  rounded-lg transition-colors duration-200 hover:shadow-md
                  ${colors.bg} ${colors.text} border ${colors.border.replace('border-l-', 'border-')}
                `}
                onClick={() => toggleGroup(i)}
                aria-expanded={!isCollapsed}
                aria-controls={`sidebar-group-${i}`}
              >
                <span className='text-right font-bold'>{group.label}</span>
                <div className='flex items-center gap-2'>
                  <Badge variant="outline" className='text-xs px-2 py-0.5'>
                    {group.items.length}
                  </Badge>
                  <span className={`transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}>
                    <Icon name="ChevronDown" size="xs" className={`h-4 w-4 icon-enhanced ${isCollapsed ? 'rotate-180' : ''}`} />
                  </span>
                </div>
              </button>

              {/* Enhanced Menu Items */}
              <ul
                id={`sidebar-group-${i}`}
                className={`
                  space-y-1 mt-2
                  ${isCollapsed ? 'hidden' : 'block'}
                `}
                style={{ direction: 'rtl' }}
              >
                {group.items.map((item: MenuItem) => {
                  // Find the most specific (longest) matching item for the current pathname
                  const allItems = [item, ...(item.children || [])];
                  const bestMatch = allItems.reduce((best, curr) =>
                    pathname.startsWith(curr.url) && curr.url.length > (best?.url.length || 0) ? curr : best, null as MenuItem | null
                  );
                  const isActive = bestMatch && bestMatch.url === item.url && pathname.startsWith(item.url);

                  return (
                    <React.Fragment key={item.url}>
                      <li>
                        <div className='relative group'>
                          <Link
                            href={item.url}
                            className={`
                              flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium 
                              transition-colors duration-200 hover:bg-muted/50
                              ${isActive
                                ? `${colors.bg} ${colors.text} ${colors.border} border-r-4 font-bold shadow-md`
                                : 'hover:bg-muted/50'
                              }
                            `}
                          >
                            <Icon name={item.icon} size="md" className={`h-5 w-5 icon-enhanced ${isActive ? colors.text : 'text-muted-foreground'}`} />
                            <span className='flex-1 text-sm font-semibold'>{item.title}</span>
                            {isActive && (
                              <div className={`h-2 w-2 rounded-full ${colors.text.replace('text-', 'bg-')}`} />
                            )}
                          </Link>

                          {/* Favorite Toggle */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className='absolute left-1 top-1/2 h-6 w-6 p-0 hover:bg-feature-commerce-soft transition-colors duration-200'
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(item.url);
                            }}
                          >
                            <Icon name="Star" size="xs" className={`h-3 w-3 icon-enhanced ${favorites.includes(item.url) ? 'fill-feature-commerce text-feature-commerce' : 'text-muted-foreground'}`} />
                          </Button>
                        </div>
                      </li>

                      {/* Enhanced Sub-menu */}
                      <ul className='space-y-1 py-1 pr-4'>
                        {(item.children || []).map((child) => {
                          // Only highlight the child if it is the best match
                          const isChildActive = bestMatch && bestMatch.url === child.url && pathname.startsWith(child.url);
                          return (
                            <li key={child.url}>
                              <Link
                                href={child.url}
                                className={`
                                  flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium 
                                  ${isChildActive
                                    ? `${colors.bg} ${colors.text} ${colors.border} border-r-4 font-bold shadow`
                                    : ''
                                  }
                                `}
                              >
                                <Icon name={child.icon} size="md" className={`h-4 w-4 icon-enhanced ${isChildActive ? colors.text : 'text-muted-foreground'}`} />
                                <span className='flex-1'>{child.title}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </React.Fragment>
                  );
                })}
              </ul>
            </SidebarGroup>
          );
        })}

      </SidebarContent>

      {/* Enhanced Footer */}
      <SidebarFooter className='border-t p-4 bg-muted/30 flex flex-col gap-2'>
        <div className='flex items-center justify-between text-xs text-muted-foreground'>
          <span>آخر تحديث: <TimeAgo date={new Date()} /></span>
          <span>المفضلة: {favorites.length}</span>
        </div>
        <div className='text-xs text-muted-foreground text-center'>
          <span>© {new Date().getFullYear()} متجرك</span>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
