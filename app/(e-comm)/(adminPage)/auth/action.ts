'use server';
import { signOut } from '../../../../auth';
import db from '../../../../lib/prisma';

export const getAccountById = async (userId: string) => {
  try {
    const account = await db.account.findFirst({
      where: { userId: userId },
    });
    return account;
  } catch (error) {
    console.error('Error fetching account:', error);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id: id },
    });

    return user;
  } catch (error) {
    console.error('Error fetching account:', error);
    return null;
  }
};

export const userLogOut = async () => {
  await signOut({ redirectTo: '/' });
};
