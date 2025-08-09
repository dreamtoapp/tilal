import db from '@/lib/prisma';

export async function getCategoryById(id: string) {
  return db.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true, // 'name' is correct for Category model
      // Add other fields as needed
    },
  });
}
