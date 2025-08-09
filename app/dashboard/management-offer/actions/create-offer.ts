'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import db from '@/lib/prisma';
import { prevState } from '@/types/commonType';
import { Slugify } from '../../../../utils/slug';
import { revalidateTag } from 'next/cache';

const offerSchema = z.object({
  name: z.string().min(1, 'اسم المجموعة مطلوب'),
  description: z.string().optional(),
  hasDiscount: z.boolean().default(false),
  discountPercentage: z.number().min(0).max(100).optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().min(0).default(0),
});

export async function createOffer(_prevState: prevState, formData: FormData) {
  try {
    // Extract form data
    const name = formData.get('name') as string;
    const description = formData.get('description') as string || undefined;
    const hasDiscount = formData.get('hasDiscount') === 'true';
    const discountPercentage = hasDiscount ? parseFloat(formData.get('discountPercentage') as string) : undefined;
    const isActive = formData.get('isActive') !== 'false'; // Default to true
    const displayOrder = parseInt(formData.get('displayOrder') as string) || 0;
    const selectedProductIds = formData.getAll('selectedProducts') as string[];
    const header = formData.get('header') as string || undefined;
    const subheader = formData.get('subheader') as string || undefined;

    // Validate required fields
    if (!name) {
      return { success: false, message: 'اسم المجموعة مطلوب' };
    }

    if (hasDiscount && (!discountPercentage || discountPercentage <= 0 || discountPercentage > 100)) {
      return { success: false, message: 'نسبة الخصم يجب أن تكون بين 1 و 100' };
    }

    // Validate with Zod
    const validatedData = offerSchema.parse({
      name,
      description,
      hasDiscount,
      discountPercentage,
      isActive,
      displayOrder,
    });

    // Create the offer without banner image (will be added later)
    const newOffer = await db.offer.create({
      data: {
        name: validatedData.name,
        slug: Slugify(validatedData.name),
        description: validatedData.description,
        bannerImage: null, // Will be added later from management interface
        hasDiscount: validatedData.hasDiscount,
        discountPercentage: validatedData.discountPercentage,
        isActive: validatedData.isActive,
        displayOrder: validatedData.displayOrder,
        header,
        subheader,
      },
    });

    revalidateTag('offers');

    // Create product assignments if any products were selected
    if (selectedProductIds.length > 0) {
      await db.offerProduct.createMany({
        data: selectedProductIds.map(productId => ({
          offerId: newOffer.id,
          productId: productId,
        })),
      });
    }

    // Revalidate relevant paths
    revalidatePath('/dashboard/management-offer');
    revalidatePath('/');

  } catch (error) {
    console.error('Error creating offer:', error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        message: error.errors.map(e => e.message).join(', ') 
      };
    }

    return { 
      success: false, 
      message: 'حدث خطأ أثناء إنشاء المجموعة. حاول مرة أخرى.' 
    };
  }

  // Redirect to the offer list with success message (outside try-catch)
  redirect('/dashboard/management-offer?success=created');
} 