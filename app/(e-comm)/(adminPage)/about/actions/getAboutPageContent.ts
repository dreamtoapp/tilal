import db from '@/lib/prisma';

/**
 * Fetch the single AboutPageContent (with features, testimonials, and FAQ).
 */
export async function getAboutPageContent() {
  const aboutPage = await db.aboutPageContent.findFirst({
    include: {
      features: true,
      testimonials: true,
      faq: true,
    },
  });
  return aboutPage;
} 