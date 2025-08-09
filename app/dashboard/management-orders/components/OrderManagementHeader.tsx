// app/dashboard/orders-management/components/OrderManagementHeader.tsx
import { Icon } from '@/components/icons/Icon';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface OrderManagementHeaderProps {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  inWayOrders: number;
  canceledOrders: number;
}

export default function OrderManagementHeader({
  totalOrders,
  pendingOrders,
  deliveredOrders,
  inWayOrders,
  canceledOrders,
}: OrderManagementHeaderProps) {
  const stats = [
    {
      label: 'إجمالي الطلبات',
      value: totalOrders,
      icon: 'Package',
      color: 'bg-blue-100 text-blue-700',
      iconColor: 'text-blue-500',
    },
    {
      label: 'قيد الانتظار',
      value: pendingOrders,
      icon: 'Clock',
      color: 'bg-amber-100 text-amber-700',
      iconColor: 'text-amber-500',
    },
    {
      label: 'في الطريق',
      value: inWayOrders,
      icon: 'Truck',
      color: 'bg-indigo-100 text-indigo-700',
      iconColor: 'text-indigo-500',
    },
    {
      label: 'تم التسليم',
      value: deliveredOrders,
      icon: 'CheckCircle',
      color: 'bg-green-100 text-green-700',
      iconColor: 'text-green-500',
    },
    {
      label: 'ملغي',
      value: canceledOrders,
      icon: 'XCircle',
      color: 'bg-red-100 text-red-700',
      iconColor: 'text-red-500',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label} className={cn("border-none shadow-sm", stat.color)}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={cn("rounded-full p-2", stat.color)}>
                <Icon name={stat.icon} className={cn("h-6 w-6", stat.iconColor)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
