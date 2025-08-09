/**
 * Pre-built notification templates for common ORDER events
 */
export const ORDER_NOTIFICATION_TEMPLATES = {
  NEW_ORDER: (orderNumber: string, customerName: string, total: number) => ({
    title: '🛒 طلب جديد',
    body: `طلب جديد #${orderNumber} بقيمة ${total.toFixed(2)} ر.س من ${customerName}`,
  }),
  
  ORDER_SHIPPED: (orderNumber: string, driverName?: string) => ({
    title: '🚚 تم شحن طلبك',
    body: `طلبك رقم ${orderNumber} تم شحنه بنجاح!${driverName ? ` السائق ${driverName} سيقوم بالتوصيل.` : ''}`,
  }),
  
  TRIP_STARTED: (orderNumber: string, driverName: string) => ({
    title: 'بدأ السائق في التوجه إليك 🚗',
    body: `السائق ${driverName} بدأ رحلة توصيل طلبك ${orderNumber}. سيصل إليك قريباً!`,
  }),
  
  DRIVER_ASSIGNED: (orderNumber: string, driverName: string) => ({
    title: 'تم تعيين سائق للتوصيل',
    body: `تم تعيين السائق ${driverName} لتوصيل طلبك ${orderNumber}. سيبدأ التوصيل قريباً.`,
  }),
  
  ORDER_DELIVERED: (orderNumber: string) => ({
    title: 'تم توصيل طلبك بنجاح ✅',
    body: `تم توصيل طلبك ${orderNumber} بنجاح. شكراً لاختيارك متجرنا!`,
  }),
  
  ORDER_CANCELLED: (orderNumber: string, reason?: string) => ({
    title: 'تم إلغاء طلبك',
    body: `تم إلغاء طلبك ${orderNumber}${reason ? ` - ${reason}` : ''}. سيتم استرداد المبلغ إلى محفظتك.`,
  })
}; 