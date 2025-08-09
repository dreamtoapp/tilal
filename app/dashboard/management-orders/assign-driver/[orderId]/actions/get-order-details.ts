'use server';

import prisma from '@/lib/prisma';

export interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  amount: number;
  createdAt: Date;
  customer: {
    id: string;
    name: string;
    phone: string;
    email?: string;
  } | null;
  location: {
    address: string;
    latitude?: number;
    longitude?: number;
    district?: string;
    city?: string;
  } | null;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      images: string[];
    };
  }[];
  driver?: {
    id: string;
    name: string;
    phone: string;
    rating: number;
  } | null;
}

export async function getOrderDetails(orderId: string): Promise<OrderDetails | null> {
  try {
    // Validate orderId format
    if (!orderId || orderId.length !== 24) {
      // console.warn('Invalid order ID format:', orderId);
      return null;
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        address: {
          select: {
            id: true,
            label: true,
            district: true,
            street: true,
            buildingNumber: true,
            floor: true,
            apartmentNumber: true,
            landmark: true,
            latitude: true,
            longitude: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return null;
    }

    // Transform the data to match our interface
    return {
      id: order.id,
      orderNumber: order.orderNumber || order.id.slice(-8),
      status: order.status,
      amount: order.amount || 0,
      createdAt: order.createdAt,
      customer: order.customer ? {
        id: order.customer.id,
        name: order.customer.name || 'عميل',
        phone: order.customer.phone || '',
        email: order.customer.email || undefined,
      } : null,
      location: {
        address: order.address?.label || 'عنوان غير محدد',
        latitude: order.address?.latitude ? parseFloat(order.address.latitude) : undefined,
        longitude: order.address?.longitude ? parseFloat(order.address.longitude) : undefined,
        district: order.address?.district,
        city: 'الرياض', // Default city
      },
      items: order.items?.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        product: {
          id: item.product?.id || '',
          name: item.product?.name || 'منتج',
          images: item.product?.images || [],
        },
      })) || [],
      driver: order.driver ? {
        id: order.driver.id,
        name: order.driver.name || 'سائق',
        phone: order.driver.phone || '',
        rating: 4.5, // Default since rating not in User model
      } : null,
    };
  } catch (error) {
    console.error('Error fetching order details:', error);
    return null;
  }
} 