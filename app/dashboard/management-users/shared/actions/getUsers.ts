"use server";
import db from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function getUsers(role: UserRole) {
  try {
    const users = await db.user.findMany({
      where: {
        role: role,
      },
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users.');
  }
}
