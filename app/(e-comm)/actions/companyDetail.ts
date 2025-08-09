'use server';

import { cacheData } from '@/lib/cache';
import db from '@/lib/prisma';

// Cached company info (1 hour revalidate, tag for on-demand invalidation)
export const companyInfo = async () => {
  return await cacheData(
    async () => {
      const company = await db.company.findFirst();
      return company;
    },
    ['companyInfo'],
    { revalidate: 1, tags: ['company'] }
  )();
};
