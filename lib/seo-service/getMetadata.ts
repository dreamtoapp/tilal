import { Metadata } from 'next';

import db from '@/lib/prisma';

type EntityType = "PAGE" | "PRODUCT" | "CATEGORY"; // extend as needed

export function getPageMetadata(
  entityType: EntityType,
  routePath?: string // optional override path
) {
  return async ({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> => {
    const locale = params.locale;
    const entityId = params.slug;

    // Fetch matching SEO entry
    const seo = await db.globalSEO.findUnique({
      where: {
        entityId_entityType_locale: {
          entityId,
          entityType,
          locale,
        },
      },
    });

    if (!seo) {
      // console.warn(`[SEO] No metadata found for ${entityType}/${entityId}/${locale}`);
      return {};
    }

    // Fetch all localized versions for hreflang
    const hreflangEntries = await db.globalSEO.findMany({
      where: {
        entityId,
        entityType,
      },
      select: {
        locale: true,
      },
    });

    const baseUrl = "https://yourdomain.com"; // Replace with your real domain
    const path = routePath || entityType.toLowerCase(); // fallback to entityType as path
    const alternates = Object.fromEntries(
      hreflangEntries.map(({ locale }) => [
        locale,
        `${baseUrl}/${locale}/${path}/${entityId}`,
      ])
    );

    return {
      title: seo.metaTitle,
      description: seo.metaDescription,
      alternates: {
        canonical: seo.canonicalUrl || `${baseUrl}/${locale}/${path}/${entityId}`,
        languages: alternates,
      },
      openGraph: {
        title: seo.openGraphTitle || seo.metaTitle,
        description: seo.openGraphDescription || seo.metaDescription,
        images: seo.openGraphImage ? [seo.openGraphImage] : [],
        locale,
        type: "website",
      },

      robots: seo.robots,
      other: {
        schemaOrg: JSON.stringify(seo.schemaOrg || {}),
      },
    };
  };
}


// this how to use it
// import { getPageMetadata } from "@/lib/seo/getMetadata";

// export const generateMetadata = getPageMetadata("PRODUCT");

