import db from '@/lib/prisma';

export async function getUserStatement(userId: string) {
  if (!userId) {
    // Prevent Prisma error if userId is undefined/null
    return null;
  }
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        customerOrders: {
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    imageUrl: true,
                    images: true,
                  }
                }
              }
            },
            address: {
              select: {
                district: true,
                street: true,
                buildingNumber: true,
                floor: true,
                apartmentNumber: true,
                landmark: true,
                deliveryInstructions: true,
              }
            },
            shift: {
              select: {
                name: true,
                startTime: true,
                endTime: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    // Removed console.error to keep build output clean
    throw error;
  }
}
