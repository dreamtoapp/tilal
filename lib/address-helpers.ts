import db from "@/lib/prisma";

/**
 * ترحيل المستخدمين الحاليين (للاستخدام في script منفصل)
 * ملاحظة: هذه الدالة لم تعد مطلوبة بعد إزالة حقول العنوان من جدول User
 */
export async function migrateExistingUsers() {
  return {
    processed: 0,
    created: 0,
    skipped: 0,
    errors: 0,
    message: 'Migration not needed - using AddressBook system'
  };
}

/**
 * تنظيف العناوين المكررة (utility function)
 */
export async function cleanupDuplicateAddresses(userId: string) {
  const addresses = await db.address.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' }
  });

  const duplicates = addresses.filter((address, index) => {
    return addresses.findIndex(a => 
      a.latitude === address.latitude && 
      a.longitude === address.longitude &&
      a.district === address.district
    ) !== index;
  });

  // احذف المكررات (اترك الأول)
  for (const duplicate of duplicates) {
    if (!duplicate.isDefault) { // لا تحذف العنوان الافتراضي
      await db.address.delete({ where: { id: duplicate.id } });
    }
  }

  return { removed: duplicates.length };
}

/**
 * الحصول على العنوان الافتراضي للمستخدم
 */
export async function getDefaultAddress(userId: string) {
  return await db.address.findFirst({
    where: {
      userId,
      isDefault: true,
    },
  });
}

/**
 * التحقق من وجود عناوين للمستخدم
 */
export async function hasAddresses(userId: string): Promise<boolean> {
  const count = await db.address.count({
    where: { userId }
  });
  return count > 0;
} 