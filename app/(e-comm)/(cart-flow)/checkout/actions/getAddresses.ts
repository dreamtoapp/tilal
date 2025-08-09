import db from "@/lib/prisma";

export async function getAddresses(userId: string) {
  const addresses = await db.address.findMany({ 
    where: { userId },
    orderBy: [
      { isDefault: 'desc' }, // العنوان الافتراضي أولاً
      { createdAt: 'desc' }  // ثم الأحدث
    ]
  });

  return addresses;
} 