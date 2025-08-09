import db from '../../../../../lib/prisma';

export async function fetchReplies() {
  try {
    const replies = await db.reply.findMany({
      orderBy: { sentAt: 'desc' },
      include: {
        contactSubmission: {
          select: {
            id: true,
            name: true,
            email: true,
            subject: true,
          },
        },
      },
    });
    return replies;
  } catch (error) {
    console.error('Error fetching replies:', error);
    throw new Error('Failed to fetch replies');
  }
} 