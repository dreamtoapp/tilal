import db from "@/lib/prisma";

export async function getUser(userId: string) {
  return db.user.findUnique({ where: { id: userId } });
} 