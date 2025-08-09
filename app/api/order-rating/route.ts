import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { RatingType } from '@/constant/enums';

const orderRatingSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
  type: z.nativeEnum(RatingType),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parse = orderRatingSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten().fieldErrors }, { status: 400 });
  }

  const { orderId, rating, comment, type } = parse.data;

  // Optional: Prevent duplicate ratings of the same type by the same user for the same order
  const existing = await prisma.orderRating.findFirst({
    where: { orderId, userId: session.user.id, type },
  });
  if (existing) {
    return NextResponse.json({ error: 'You have already submitted this rating.' }, { status: 409 });
  }

  // Optional: Check if user is allowed to rate this order/type (ownership, delivered, etc.)

  const orderRating = await prisma.orderRating.create({
    data: {
      orderId,
      userId: session.user.id,
      rating,
      comment,
      type,
    },
  });

  return NextResponse.json({ success: true, orderRating });
} 