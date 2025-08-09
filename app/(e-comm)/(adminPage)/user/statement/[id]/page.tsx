import { getUserStatement } from '../action/action';
import EmptyState from '@/components/warinig-msg';
import { PageProps } from '@/types/commonTypes';
import UserStatementContent from './UserStatementContent';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    images: string[];
  } | null;
}

interface Address {
  district: string;
  street: string;
  buildingNumber: string;
  floor: string | null;
  apartmentNumber: string | null;
  landmark: string | null;
  deliveryInstructions: string | null;
}

interface Shift {
  name: string;
  startTime: string;
  endTime: string;
}

interface Order {
  id: string;
  status: string;
  orderNumber: string;
  createdAt: Date;
  amount: number;
  paymentMethod: string | null;
  deliveryInstructions: string | null;
  items: OrderItem[];
  address: Address | null;
  shift: Shift | null;
}

type UserWithCustomerOrders = {
  id: string;
  phone: string;
  name: string;
  email: string;
  customerOrders: Order[];
};

type OrderStatus = 'delivered' | 'pending' | 'inway' | 'canceled';

export default async function UserStatementPage({ params }: PageProps<{ id: string }>) {
  const { id } = await params;
  const user = await getUserStatement(id) as UserWithCustomerOrders;

  if (!user) return <EmptyState message='معرّف المستخدم غير صالح' />;

  const totalSpent = user.customerOrders.reduce((sum: number, order: Order) => sum + order.amount, 0);
  const orderCounts = user.customerOrders.reduce(
    (acc: Record<OrderStatus, number>, order: Order) => {
      const status = order.status.toLowerCase() as OrderStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<OrderStatus, number>,
  );

  return (
    <UserStatementContent user={user} totalSpent={totalSpent} orderCounts={orderCounts} />
  );
}

export type { Order, UserWithCustomerOrders, OrderStatus, OrderItem, Address, Shift };


