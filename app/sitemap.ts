import { MetadataRoute } from 'next';

import prisma from '@/lib/prisma';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/products`, // General products listing page
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/categories`, // General categories listing page
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Add other important static pages here
    // e.g., { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ] as MetadataRoute.Sitemap;

  const products = await prisma.product.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  });

  const productUrls = products.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  })) as MetadataRoute.Sitemap;

  const categories = await prisma.category.findMany({
    // Add a filter if categories can be unpublished, e.g., where: { published: true }
    select: { slug: true, updatedAt: true }, // Ensure 'updatedAt' exists on Category model
    orderBy: { updatedAt: 'desc' },
  });

  const categoryUrls = categories.map((category) => ({
    url: `${BASE_URL}/categories/${category.slug}`,
    lastModified: category.updatedAt, // Ensure 'updatedAt' exists on Category model
    changeFrequency: 'weekly',
    priority: 0.6,
  })) as MetadataRoute.Sitemap;

  return [
    ...staticPages,
    ...productUrls,
    ...categoryUrls,
  ];
}
