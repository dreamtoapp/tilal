// Check if a newsletter email exists
import db from '@/lib/prisma';

export async function checkNewsletterExists(email: string) {
  return await db.newLetter.findUnique({ where: { email } });
}

export async function addNewsletter(email: string) {
  return await db.newLetter.create({ data: { email } });
} 