// app/dashboard/contact/actions/fetchSubmissions.ts
'use server';
import db from '../../../../../lib/prisma';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export async function fetchSubmissions() {
  try {
    const submissions = await db.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      include: { replies: { select: { id: true } } },
    });
    return submissions.map((submission) => ({
      ...submission,
      createdAt: format(new Date(submission.createdAt), 'dd/MM/yyyy HH:mm:ss', {
        locale: ar,
      }),
    }));
  } catch (error) {
    console.error('Error fetching submissions:', error);
    throw new Error('Failed to fetch submissions');
  }
}
