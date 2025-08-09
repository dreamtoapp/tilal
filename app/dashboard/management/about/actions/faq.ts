import db from '@/lib/prisma';
import { z } from 'zod';

const faqSchema = z.object({
  question: z.string().min(2, 'السؤال مطلوب'),
  answer: z.string().min(2, 'الإجابة مطلوبة'),
});

export type FAQFormValues = z.infer<typeof faqSchema>;

export async function getFAQs() {
  try {
    const faqs = await db.fAQ.findMany();
    return { success: true, faqs };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function createFAQ(data: FAQFormValues & { aboutPageId: string }) {
  const parsed = faqSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() };
  }
  try {
    const faq = await db.fAQ.create({
      data: {
        question: data.question,
        answer: data.answer,
        aboutPage: { connect: { id: data.aboutPageId } },
      },
    });
    return { success: true, faq };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updateFAQ(id: string, data: FAQFormValues) {
  const parsed = faqSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() };
  }
  try {
    const faq = await db.fAQ.update({ where: { id }, data });
    return { success: true, faq };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function deleteFAQ(id: string) {
  try {
    await db.fAQ.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
} 