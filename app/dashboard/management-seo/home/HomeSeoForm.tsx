// HomeSeoForm.tsx

import { EntityType } from '@prisma/client';

export type HomeSeoFormProps = {
  defaultValues: {
    entityId: string;
    metaTitle: string;
    metaDescription: string;
    entityType: EntityType;
    canonicalUrl: string;
    robots: string;
    keywords: string[];
    openGraphTitle: string;
    openGraphImages: string;
    twitterCardType: string;
    twitterImages: string;
    securityHeaders: string[];
    preloadAssets: string[];
    httpEquiv: string[];
    defaultLanguage: string;
    supportedLanguages: string[];
    hreflang: string;
    schemaOrg: string;
    industryData: string;
  };
  mode: 'edit' | 'create';
  id?: string;
};

export default function HomeSeoForm({ defaultValues, mode, }: HomeSeoFormProps) {
  // Minimal, clear, and custom for homepage only
  return (
    <form className="space-y-6">
      <div>
        <label htmlFor="metaTitle" className="block font-medium mb-1">Meta Title</label>
        <input
          id="metaTitle"
          name="metaTitle"
          type="text"
          defaultValue={defaultValues.metaTitle}
          className="w-full border rounded px-3 py-2"
          maxLength={120}
          required
        />
      </div>
      <div>
        <label htmlFor="metaDescription" className="block font-medium mb-1">Meta Description</label>
        <textarea
          id="metaDescription"
          name="metaDescription"
          defaultValue={defaultValues.metaDescription}
          className="w-full border rounded px-3 py-2"
          maxLength={320}
          required
        />
      </div>
      {/* Add more fields as needed for homepage SEO */}
      <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
        {mode === 'edit' ? 'Update SEO' : 'Create SEO'}
      </button>
    </form>
  );
}
