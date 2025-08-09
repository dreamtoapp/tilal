'use client';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Icon } from '@/components/icons/Icon';

interface dataType {
  inWayOrders: number;
  canceledOrders: number;
  deliveredOrders: number;
  driverId: string;
}

const MenuList = ({ inWayOrders, canceledOrders, deliveredOrders, driverId }: dataType) => {
  const router = useRouter();

  const menuOptions = [
    {
      label: 'في الانتظار',
      count: inWayOrders,
      icon: <Icon name="Timer" size="sm" className="text-yellow-600" />,
      bgColor: 'bg-yellow-100 hover:bg-yellow-200',
      route: `/driver/driver/showdata?status=InWay&driverId=${driverId}`, // Corrected route
    },
    {
      label: 'سلمت',
      count: deliveredOrders,
      icon: <Icon name="CheckCircle" size="sm" className="text-green-600" />,
      bgColor: 'bg-green-100 hover:bg-green-200',
      route: `/driver/driver/showdata?status=Delivered&driverId=${driverId}`, // Corrected route
    },
    {
      label: 'الغيت',
      count: canceledOrders,
      icon: <Icon name="X" size="sm" className="text-red-600" />,
      bgColor: 'bg-red-100 hover:bg-red-200',
      route: `/driver/driver/showdata?status=canceled&driverId=${driverId}`, // Corrected route
    },
  ];
  const totalOrders = inWayOrders + deliveredOrders + canceledOrders;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='flex h-14 w-full items-center justify-between border border-gray-300 bg-white px-4 text-gray-800 shadow-sm'>
          <span className='font-semibold'> الطلبات</span>
          {totalOrders}
          <Icon name="ChevronDown" size="sm" className="text-gray-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-full max-w-[90vw] space-y-2 rounded-md bg-white p-2 shadow-lg'>
        {menuOptions.map((option) => (
          <DropdownMenuItem
            key={option.label}
            className={`flex cursor-pointer items-center justify-between rounded-md p-3 ${option.bgColor} transition-colors`}
            onClick={() => router.push(option.route)}
          >
            <div className='flex items-center gap-2'>
              {option.icon}
              <span className='text-gray-800'>{option.label}</span>
            </div>
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full p-1 text-base text-white ${option.label === 'في الانتظار'
                ? 'bg-yellow-600'
                : option.label === 'سلمت'
                  ? 'bg-green-700'
                  : 'bg-red-600'
                }`}
            >
              {option.count}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuList;
