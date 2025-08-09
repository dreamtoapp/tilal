'use server';

import db from '@/lib/prisma';
import { registerSchema } from '../helpers/registerSchema';
import { createSystemNotification, SYSTEM_NOTIFICATIONS } from '@/helpers/systemNotifications';

export async function registerUser(_prevState: any, formData: FormData) {
  try {
    const validatedFields = registerSchema.safeParse({
      name: formData.get('name'),
      phone: formData.get('phone'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    if (!validatedFields.success) {
      // Collect all error messages from Zod
      const errorMessages = validatedFields.error.errors.map(e => e.message);
      return {
        success: false,
        message: errorMessages.join('، '), // Join with Arabic comma
      };
    }

    const { name, phone, password } = validatedFields.data;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return {
        success: false,
        message: 'رقم الهاتف مسجل بالفعل. إذا كنت تملك حساباً، يرجى تسجيل الدخول.',
      };
    }

    // Create new user
    const newUser = await db.user.create({
      data: {
        name,
        phone,
        password,
        role: 'CUSTOMER',
      },
    });

    // 🔔 Create onboarding system notifications (3 notifications for better UX)
    try {
      // 1️⃣ Welcome notification
      await createSystemNotification({
        userId: newUser.id,
        title: SYSTEM_NOTIFICATIONS.WELCOME.title,
        body: SYSTEM_NOTIFICATIONS.WELCOME.body,
        actionUrl: '/'
      });

      // 2️⃣ Add address notification 
      await createSystemNotification({
        userId: newUser.id,
        title: SYSTEM_NOTIFICATIONS.ADD_ADDRESS.title,
        body: SYSTEM_NOTIFICATIONS.ADD_ADDRESS.body,
        actionUrl: '/user/addresses'
      });

      // 3️⃣ Account activation notification
      await createSystemNotification({
        userId: newUser.id,
        title: SYSTEM_NOTIFICATIONS.ACTIVATE_ACCOUNT.title,
        body: SYSTEM_NOTIFICATIONS.ACTIVATE_ACCOUNT.body,
        actionUrl: '/auth/verify'
      });

      console.log('✅ Created 3 onboarding notifications for user:', newUser.id);
    } catch (notificationError) {
      // Don't fail registration if notification fails
      console.error('⚠️ Failed to create onboarding notifications:', notificationError);
    }

    // Return phone and password for client-side signIn
    return {
      success: true,
      redirectTo: '/user/addresses?welcome=true&message=أضف عنوانك الأول لتسهيل عملية التوصيل',
      phone,
      password,
    };
    
  } catch (error: any) {
    // Enhance error feedback for known DB errors
    if (error.code === 'P2002') {
      // Prisma unique constraint failed
      return {
        success: false,
        message: 'رقم الهاتف مستخدم بالفعل. يرجى استخدام رقم آخر أو تسجيل الدخول.',
      };
    }
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'حدث خطأ غير متوقع أثناء التسجيل. يرجى المحاولة لاحقاً أو التواصل مع الدعم.',
    };
  }
}
