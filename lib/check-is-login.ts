// lib/check-is-login.ts
'use server';

import { auth } from '@/auth';
import { User } from '@/types/databaseTypes';
import db from '@/lib/prisma';

export const checkIsLogin = async (): Promise<User | null> => {
  try {
    const session = await auth();
    // Removed console.log for cleaner build output
    if (!session?.user) return null;
    
    // Convert session user to User type by fetching from database
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });
    
    return user;
  } catch (error) {
    // Removed console.error for cleaner build output
    return null;
  }
};
