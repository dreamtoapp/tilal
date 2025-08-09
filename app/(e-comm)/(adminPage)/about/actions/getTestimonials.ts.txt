"use server"
import db from '../../../../../lib/prisma';
import type { Review } from '@prisma/client';

export async function getFeaturedTestimonials() {
  try {
    const testimonials = (await db.review.findMany({
      where: {
        rating: { gte: 4 },
        comment: { not: '' },
      },
      take: 12,
      orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
      include: {
        user: { select: { name: true, image: true } },
      },
    })) as Array<Review & { user: { name: string | null; image: string | null } | null }>;

    const formatted = testimonials.map((t) => ({
      id: t.id,
      name: t.user?.name ?? 'مستخدم غير معروف',
      text: t.comment ?? '',
      rating: t.rating,
      avatar: t.user?.image ?? null,
    }));

    return formatted;
  } catch (error) {
    console.error('❌ Failed to fetch testimonials:', error);
    // Fallback dummy testimonials
    return [
      { id: 'dummy-1', name: 'محمد العتيبي', text: 'مياه أمواج غيرت تجربتي اليومية! نقاء لا مثيل له وخدمة توصيل لا تتأخر أبدًا.', rating: 5, avatar: null },
      { id: 'dummy-2', name: 'سارة القحطاني', text: 'أفضل خيار للمياه النقية! الجودة ممتازة والتوصيل دائمًا في الموعد.', rating: 5, avatar: null },
    ];
  }
} 