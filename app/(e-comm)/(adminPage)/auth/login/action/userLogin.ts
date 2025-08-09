'use server';

import { signIn } from '../../../../../../auth';
import db from '../../../../../../lib/prisma';

export const userLogin = async (
  _state: { success: boolean; message: string } | null,
  formData: FormData
): Promise<{ success: boolean; message: string } | null> => {
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;


  // Validate input data
  if (!phone || !password) {
    return { success: false, message: 'جميع الحقول مطلوبة' };
  }

  // Check if the user already exists
  if (!phone) return null;
  const existingUser = await db.user.findUnique({ where: { phone } });
  if (!existingUser) {
    return { success: false, message: 'المعلومات غير صحيحة' };
  }

  if (existingUser.password !== password) {
    return { success: false, message: 'المعلومات غير صحيحة' };
  }

  // Sign in with NextAuth (without redirect - handle redirect in client)
  console.log('🔐 DEBUG: About to sign in with NextAuth...');
  try {
    const result = await signIn('credentials', {
      phone,
      password,
      redirect: false, // Don't redirect automatically
    });
    console.log('✅ DEBUG: NextAuth signIn completed, result:', result);

    // Cart sync will be triggered by client-side after successful login
    console.log('🎯 DEBUG: Returning success response from userLogin action');
    return { success: true, message: 'تم تسجيل الدخول بنجاح' };
  } catch (error: any) {
    console.error('❌ DEBUG: NextAuth signIn failed:', error);
    return { success: false, message: 'فشل في تسجيل الدخول' };
  }
};
