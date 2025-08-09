// lib/actions.ts
'use server';

import { EntityType, GlobalSEO } from '@prisma/client';

import db from '../../../../../lib/prisma';

export const getSEOData = async (
  entityId: string,
  entityType: EntityType = 'PAGE',
  locale: string
): Promise<GlobalSEO | null> => {
  try {
    return await db.globalSEO.findUnique({
      where: {
        entityId_entityType_locale: {
          entityId,
          entityType,
          locale,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    return null;
  }
};
