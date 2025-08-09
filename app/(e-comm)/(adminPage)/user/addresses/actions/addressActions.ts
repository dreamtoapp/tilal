'use server';

import { revalidatePath } from 'next/cache';
import db from '@/lib/prisma';

interface AddressData {
  label: string;
  district: string;
  street: string;
  buildingNumber: string;
  floor?: string;
  apartmentNumber?: string;
  landmark?: string;
  deliveryInstructions?: string;
  latitude?: string;
  longitude?: string;
}

export async function getAddresses(userId: string) {
  try {
    const addresses = await db.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ],
    });

    return {
      success: true,
      addresses,
      message: 'تم جلب العناوين بنجاح',
    };
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return {
      success: false,
      addresses: [],
      message: 'فشل في جلب العناوين',
    };
  }
}

export async function createAddress(userId: string, data: AddressData) {
  try {
    // Check if this is the first address (make it default)
    const existingAddresses = await db.address.count({
      where: { userId },
    });

    const newAddress = await db.address.create({
      data: {
        ...data,
        userId,
        isDefault: existingAddresses === 0, // First address becomes default
      },
    });

    revalidatePath('/user/addresses');
    revalidatePath('/user/profile');

    return {
      success: true,
      address: newAddress,
      message: 'تم إضافة العنوان بنجاح',
    };
  } catch (error) {
    console.error('Error creating address:', error);
    return {
      success: false,
      address: null,
      message: 'فشل في إضافة العنوان',
    };
  }
}

export async function updateAddress(addressId: string, data: AddressData) {
  try {
    const updatedAddress = await db.address.update({
      where: { id: addressId },
      data,
    });

    revalidatePath('/user/addresses');
    revalidatePath('/user/profile');

    return {
      success: true,
      address: updatedAddress,
      message: 'تم تحديث العنوان بنجاح',
    };
  } catch (error) {
    console.error('Error updating address:', error);
    return {
      success: false,
      address: null,
      message: 'فشل في تحديث العنوان',
    };
  }
}

export async function deleteAddress(addressId: string) {
  try {
    // Check if this is the default address
    const address = await db.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      return {
        success: false,
        message: 'العنوان غير موجود',
      };
    }

    // If it's the default address, check if there are other addresses
    if (address.isDefault) {
      const otherAddresses = await db.address.count({
        where: {
          userId: address.userId,
          id: { not: addressId },
        },
      });

      if (otherAddresses === 0) {
        return {
          success: false,
          message: 'لا يمكن حذف العنوان الافتراضي الوحيد. أضف عنوانًا جديدًا أولاً.',
        };
      }
    }

    await db.address.delete({
      where: { id: addressId },
    });

    revalidatePath('/user/addresses');
    revalidatePath('/user/profile');

    return {
      success: true,
      message: 'تم حذف العنوان بنجاح',
    };
  } catch (error) {
    console.error('Error deleting address:', error);
    return {
      success: false,
      message: 'فشل في حذف العنوان',
    };
  }
}

export async function setDefaultAddress(addressId: string) {
  try {
    // Get the address to find the user
    const address = await db.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      return {
        success: false,
        message: 'العنوان غير موجود',
      };
    }

    // Use transaction to ensure consistency
    await db.$transaction([
      // Remove default from all user addresses
      db.address.updateMany({
        where: { userId: address.userId },
        data: { isDefault: false },
      }),
      // Set the selected address as default
      db.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      }),
    ]);

    revalidatePath('/user/addresses');
    revalidatePath('/user/profile');

    return {
      success: true,
      message: 'تم تعيين العنوان كافتراضي بنجاح',
    };
  } catch (error) {
    console.error('Error setting default address:', error);
    return {
      success: false,
      message: 'فشل في تعيين العنوان كافتراضي',
    };
  }
}

export async function getDefaultAddress(userId: string) {
  try {
    const defaultAddress = await db.address.findFirst({
      where: {
        userId,
        isDefault: true,
      },
    });

    return {
      success: true,
      address: defaultAddress,
      message: defaultAddress ? 'تم العثور على العنوان الافتراضي' : 'لا يوجد عنوان افتراضي',
    };
  } catch (error) {
    console.error('Error fetching default address:', error);
    return {
      success: false,
      address: null,
      message: 'فشل في جلب العنوان الافتراضي',
    };
  }
} 