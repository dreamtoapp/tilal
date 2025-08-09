export type OrderNotificationType = 'order_shipped' | 'trip_started' | 'order_delivered';

export interface OrderNotificationTemplate {
  title: string;
  body: string;
}

export const ORDER_NOTIFICATION_TEMPLATES = {
  ORDER_SHIPPED: (orderNumber: string, driverName?: string): OrderNotificationTemplate => ({
    title: '🚚 تم شحن طلبك',
    body: `تم شحن طلبك رقم ${orderNumber} بواسطة السائق ${driverName || 'غير معروف'}`
  }),
  
  TRIP_STARTED: (orderNumber: string, driverName?: string): OrderNotificationTemplate => ({
    title: '🚗 بدأ السائق رحلته',
    body: `السائق ${driverName || 'غير معروف'} بدأ توصيل طلبك رقم ${orderNumber}`
  }),
  
  ORDER_DELIVERED: (orderNumber: string): OrderNotificationTemplate => ({
    title: '✅ تم توصيل طلبك',
    body: `تم توصيل طلبك رقم ${orderNumber} بنجاح!`
  })
}; 