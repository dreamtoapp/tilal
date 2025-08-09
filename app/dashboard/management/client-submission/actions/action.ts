// app/dashboard/contact/actions.ts
'use server';
import db from '../../../../../lib/prisma';

export async function fetchContactSubmissions() {
  try {
    return await db.contactSubmission.findMany({
      include: { replies: true }, // Include replies for each submission
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    throw new Error('Failed to fetch submissions.');
  }
}

export async function createReply(submissionId: string, replyMessage: string) {
  try {
    const reply = await db.reply.create({
      data: {
        content: replyMessage,
        contactSubmissionId: submissionId,
      },
    });

    return reply;
  } catch (error) {
    console.error('Error creating reply:', error);
    throw new Error('Failed to save reply.');
  }
}
