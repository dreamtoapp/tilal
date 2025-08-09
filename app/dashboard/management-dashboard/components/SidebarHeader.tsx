import Link from '@/components/link';
import { Icon } from '@/components/icons/Icon';

export default function SidebarHeader() {
  return (
    <header className='flex flex-col items-center gap-2 rounded-b-lg border-b bg-white py-6 shadow'>
      <nav className='flex flex-row-reverse items-center gap-6'>
        <Link href='/dashboard' className='group' aria-label='الرئيسية'>
          <Icon name="Home" size="md" variant="primary" className="text-blue-600 transition group-hover:text-blue-800" />
        </Link>
        <Link href='/dashboard' className='group' aria-label='التطبيقات'>
          <Icon name="LayoutGrid" size="md" variant="primary" className="text-blue-600 transition group-hover:text-blue-800" />
        </Link>
      </nav>
    </header>
  );
}
