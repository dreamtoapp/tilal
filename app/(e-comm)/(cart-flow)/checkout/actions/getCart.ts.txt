import db from "@/lib/prisma";

export async function getCart(userId: string) {
  return db.cart.findFirst({ 
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });
} 