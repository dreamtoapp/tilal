import { useState } from 'react';
import { ChevronDown, ChevronUp, UserCircle } from 'lucide-react';
import Link from '@/components/link';
import { menuGroups } from '../helpers/mainMenu';
import SidebarHeader from './SidebarHeader';
import { Icon } from '@/components/icons/Icon';

// MenuItem type: icon is now a string
interface MenuItem {
  title: string;
  url: string;
  icon: string;
  children?: MenuItem[];
}

type SidebarMenuItemProps = { item: MenuItem; level?: number };
function SidebarMenuItem({ item, level = 0 }: SidebarMenuItemProps) {
  const [open, setOpen] = useState(false);
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  if (hasChildren) {
    return (
      <>
        <div
          className={`flex cursor-pointer items-center gap-3 rounded-lg p-2 text-right transition hover:bg-gray-100 ${level > 0 ? 'pl-6' : ''}`}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={item.icon} size="md" className="h-5 w-5 text-primary" />
          <span className='flex-1'>{item.title}</span>
          {open ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
        </div>
        {open && hasChildren && (
          <ul className='ml-2 space-y-1 border-r border-gray-100'>
            {item.children!.map((child) => (
              <li key={child.url}>
                <SidebarMenuItem item={child} level={level + 1} />
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }
  // No children: render as a link
  return (
    <Link
      href={item.url}
      className={`flex items-center gap-3 rounded-lg p-2 text-right transition hover:bg-gray-100 ${level > 0 ? 'pl-6' : ''}`}
    >
      <Icon name={item.icon} size="md" className="h-5 w-5 text-primary" />
      <span className='flex-1'>{item.title}</span>
    </Link>
  );
}

export default function Sidebar() {
  const [openGroup, setOpenGroup] = useState<number | null>(0); // First group open by default
  return (
    <aside className='flex min-h-screen w-full flex-col gap-4 border-r bg-white p-0 md:w-64'>
      <SidebarHeader />
      <div className='mb-2 flex flex-col items-center border-b py-4'>
        <UserCircle className='mb-2 h-12 w-12 text-gray-400' />
        <span className='font-semibold text-gray-700'>اسم المستخدم</span>
      </div>
      <nav className='flex-1 overflow-y-auto px-4 pt-2'>
        {menuGroups.map((group, i) => (
          <div key={i} className='mb-2'>
            <div
              className='mb-2 flex cursor-pointer select-none items-center justify-between text-right font-bold text-gray-700'
              onClick={() => setOpenGroup(openGroup === i ? null : i)}
            >
              <span>{group.label}</span>
              {openGroup === i ? (
                <ChevronUp className='h-4 w-4' />
              ) : (
                <ChevronDown className='h-4 w-4' />
              )}
            </div>
            {openGroup === i && (
              <ul className='space-y-1'>
                {group.items.map((item) => (
                  <li key={item.url}>
                    <SidebarMenuItem item={item} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
