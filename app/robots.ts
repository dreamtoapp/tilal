import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // User/account pages
          '/account',
          '/account/',
          '/account/*',
          '/profile',
          '/user',
          '/login',
          '/logout',
          '/register',
          '/settings',

          // Cart/checkout
          '/cart',
          '/cart/*',
          '/checkout',
          '/checkout/*',

          // Admin/back-office
          '/admin',
          '/admin/*',
          '/dashboard',
          '/dashboard/*',

          // Internal search and query params
          '/search',
          '/search?',
          '/*?q=',
          '/*?s=',
          '/*?page=',
          '/*&page=',
          '/*?sort=',
          '/*?filter=',
          '/*?category=',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
