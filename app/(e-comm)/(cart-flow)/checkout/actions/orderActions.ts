"use server";

import db from "@/lib/prisma";
import { checkIsLogin } from "@/lib/check-is-login";
import { getCart } from "@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions";
import { z } from "zod";
import { OrderNumberGenerator } from "@/helpers/orderNumberGenerator";
import { revalidatePath, revalidateTag } from "next/cache";

// Validation schema
const checkoutSchema = z.object({
  fullName: z.string()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(50, "الاسم طويل جداً")
    .regex(/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\u0020-\u007E]+$/, "يرجى إدخال اسم صحيح"),
  phone: z.string()
    .min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل")
    .max(15, "رقم الهاتف طويل جداً")
    .regex(/^[+]?[0-9\s\-\(\)]+$/, "رقم الهاتف غير صحيح")
    .transform(phone => phone.replace(/\s/g, '')),
  addressId: z.string().min(1, "يرجى اختيار عنوان التوصيل"),
  shiftId: z.string().min(1, "يرجى اختيار وقت التوصيل"),
  paymentMethod: z.enum(["CASH", "CARD", "WALLET"], {
    errorMap: () => ({ message: "يرجى اختيار طريقة الدفع" })
  }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "يجب الموافقة على الشروط والأحكام"
  })
});

// Types
interface PlatformSettings {
  taxPercentage: number;
  shippingFee: number;
  minShipping: number;
}

interface OrderCalculation {
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  total: number;
}

// Single Responsibility: Get platform settings
async function getPlatformSettings(): Promise<PlatformSettings> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/platform-settings`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching platform settings:', error);
  }

  return { taxPercentage: 15, shippingFee: 25, minShipping: 200 };
}

// Single Responsibility: Calculate order totals
function calculateOrderTotals(cart: any, platformSettings: PlatformSettings): OrderCalculation {
  const subtotal = cart.items.reduce((sum: number, item: any) => {
    const effectivePrice = (item.product as any)?.discountedPrice || item.product?.price || 0;
    return sum + effectivePrice * (item.quantity || 1);
  }, 0);

  const deliveryFee = subtotal >= platformSettings.minShipping ? 0 : platformSettings.shippingFee;
  const taxAmount = subtotal * (platformSettings.taxPercentage / 100);
  const total = subtotal + deliveryFee + taxAmount;

  return { subtotal, deliveryFee, taxAmount, total };
}

// Single Responsibility: Validate and get address
async function validateAddress(addressId: string, userId: string) {
  const address = await db.address.findFirst({
    where: { id: addressId, userId }
  });

  if (!address) {
    throw new Error("العنوان المحدد غير صحيح أو غير موجود");
  }

  return address;
}

// Single Responsibility: Validate shift
async function validateShift(shiftId: string) {
  const shift = await db.shift.findUnique({
    where: { id: shiftId }
  });

  if (!shift) {
    throw new Error("وقت التوصيل المحدد غير متاح");
  }

  return shift;
}

// Single Responsibility: Update user information
async function updateUserIfNeeded(user: any, validatedData: any) {
  const updateUserData: any = {};

  if (user.name !== validatedData.fullName) {
    updateUserData.name = validatedData.fullName;
  }
  if (user.phone !== validatedData.phone) {
    updateUserData.phone = validatedData.phone;
  }

  if (Object.keys(updateUserData).length > 0) {
    await db.user.update({
      where: { id: user.id },
      data: updateUserData
    });
  }
}

// Single Responsibility: Create order in database
async function createOrderInDatabase(orderData: any) {
  return await db.order.create({
    data: orderData,
    include: {
      items: { include: { product: true } },
      address: true
    }
  });
}

// Single Responsibility: Send notifications to admins
async function notifyAdmins(order: any, customerName: string, total: number) {
  const adminUsers = await db.user.findMany({
    where: { role: { in: ['ADMIN', 'MARKETER'] } },
    select: { id: true }
  });

  if (adminUsers.length === 0) return;

  // Create database notifications
  const notificationPromises = adminUsers.map(admin =>
    db.userNotification.create({
      data: {
        title: 'طلب جديد',
        body: `طلب جديد #${order.orderNumber} بقيمة ${total.toFixed(2)} ر.س من ${customerName}`,
        type: 'ORDER',
        read: false,
        userId: admin.id,
        actionUrl: `/dashboard/management-orders`
      },
    })
  );

  await Promise.all(notificationPromises);

  // Send real-time notifications
  try {
    const { pusherServer } = await import('@/lib/pusherServer');
    const pusherPromises = adminUsers.map(admin =>
      pusherServer.trigger(`admin-${admin.id}`, 'new-order', {
        orderId: order.orderNumber,
        customer: customerName,
        total,
        createdAt: order.createdAt,
      })
    );
    await Promise.all(pusherPromises);
  } catch (error) {
    console.error('Failed to send real-time notifications:', error);
  }

  // Send push notifications
  try {
    const { PushNotificationService } = await import('@/lib/push-notification-service');
    const { ORDER_NOTIFICATION_TEMPLATES } = await import('@/app/(e-comm)/(adminPage)/user/notifications/helpers/notificationTemplates');

    const template = ORDER_NOTIFICATION_TEMPLATES.NEW_ORDER(order.orderNumber, customerName, total);
    const payload = {
      title: template.title,
      body: template.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      tag: `order-${order.id}-new`,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        type: 'new_order',
        customerName,
        total
      },
      requireInteraction: true,
      actions: [
        { action: 'view_order', title: 'عرض الطلب', icon: '/icons/icon-192x192.png' },
        { action: 'close', title: 'إغلاق' }
      ]
    };

    const adminUserIds = adminUsers.map(admin => admin.id);
    await PushNotificationService.sendToUsers(adminUserIds, payload);
  } catch (error) {
    console.error('Failed to send push notifications:', error);
  }
}

// Single Responsibility: Revalidate cache
function revalidateCache(userId: string) {
  revalidatePath('/');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/management-dashboard');
  revalidatePath('/dashboard/management-orders');
  revalidateTag('analyticsData');
  revalidateTag('fetchOrders');
  revalidateTag('userStats');
  revalidateTag(`user-${userId}`);
  revalidateTag('products');
  revalidateTag('promotions');
}

// Main function - orchestrates the order creation process
export async function createDraftOrder(formData: FormData) {
  try {
    // Get user and cart
    const user = await checkIsLogin();
    const cart = await getCart();

    if (!user?.id) {
      throw { code: 'REDIRECT_TO_LOGIN', message: 'User not authenticated' };
    }

    if (!cart?.items?.length) {
      throw { code: 'REDIRECT_TO_HAPPYORDER', message: 'redirect to happyorder' };
    }

    // Validate form data
    const validatedData = checkoutSchema.parse({
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      addressId: formData.get("addressId"),
      shiftId: formData.get("shiftId"),
      paymentMethod: formData.get("paymentMethod"),
      termsAccepted: formData.get("termsAccepted") === "true"
    });

    // Validate address and shift
    const [address] = await Promise.all([
      validateAddress(validatedData.addressId, user.id),
      validateShift(validatedData.shiftId)
    ]);

    // Update user if needed
    await updateUserIfNeeded(user, validatedData);

    // Get platform settings and calculate totals
    const platformSettings = await getPlatformSettings();
    const { total } = calculateOrderTotals(cart, platformSettings);

    // Generate order number
    const orderNumber = await OrderNumberGenerator.generateOrderNumber();

    // Create order data
    const orderData = {
      orderNumber,
      customerId: user.id,
      addressId: validatedData.addressId,
      status: "PENDING" as const,
      amount: total,
      paymentMethod: validatedData.paymentMethod,
      shiftId: validatedData.shiftId,
      deliveryInstructions: address.deliveryInstructions,
      items: {
        createMany: {
          data: cart.items.map((ci: any) => ({
            productId: ci.productId,
            quantity: ci.quantity ?? 1,
            price: ((ci.product as any)?.discountedPrice || ci.product?.price) ?? 0,
          })),
        },
      },
    };

    // Create order
    const order = await createOrderInDatabase(orderData);

    // Send notifications
    await notifyAdmins(order, validatedData.fullName, total);

    // Revalidate cache
    revalidateCache(user.id);

    return order.orderNumber;

  } catch (error) {
    console.error("Order creation error:", error);

    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => err.message);
      throw { validationErrors: errorMessages };
    }

    throw new Error("حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى");
  }
} 