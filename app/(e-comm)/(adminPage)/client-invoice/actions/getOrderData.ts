'use server';

import db from '@/lib/prisma';

export async function getOrderData(id: string) {
  try {
    const order = await db.order.findUnique({
      where: { id }, // Ensure this matches your schema
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
        shift: {
          select: {
            name: true,
            startTime: true,
            endTime: true,
          },
        },
        items: {
          include: {
            order: true, // Since `OrderItem` does not have `product`, we need a workaround
          },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return {
      id: order.id,
      invoiceNo: order.orderNumber, // Your schema does not have a direct `invoiceNo`, so using `orderNumber`
      orderNumber: order.orderNumber,
      customerName: order.customer?.name || 'Unknown',
      customerEmail: order.customer?.email || 'No Email',
      amount: order.amount,
      status: order.status,
      shift: `${order.shift.name} (${order.shift.startTime} - ${order.shift.endTime})`,
      items: order.items.map((item) => ({
        productId: item.productId, // Assuming this refers to a Product ID
        productName: `Product ${item.productId}`, // No direct relation to Product in schema
        quantity: item.quantity,
        price: item.price,
      })),
    };
  } catch (error) {
    console.error('❌ Error fetching order data:', error);
    return null;
  }
}
