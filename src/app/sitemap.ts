import type { MetadataRoute } from 'next';

const BASE_URL = 'https://www.warsawuprisingmonument.com';
const LOCALES = ['zh', 'en', 'pl', 'ru', 'de'] as const;
const PATHS = ['', '/privacy-policy', '/terms-of-service', '/cookie-settings'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of PATHS) {
      const url = `${BASE_URL}/${locale}${path}`;
      const languages: Record<string, string> = {
        'x-default': `${BASE_URL}/en${path}`,
      };
      for (const l of LOCALES) {
        languages[l] = `${BASE_URL}/${l}${path}`;
      }
      entries.push({
        url,
        lastModified: new Date('2026-09-01'),
        alternates: { languages },
      });
    }
  }

  // Root redirect page (/) → /en
  entries.push({
    url: `${BASE_URL}/`,
    lastModified: new Date('2026-09-01'),
    alternates: {
      languages: {
        'x-default': `${BASE_URL}/en`,
        zh: `${BASE_URL}/zh`,
        en: `${BASE_URL}/en`,
        pl: `${BASE_URL}/pl`,
        ru: `${BASE_URL}/ru`,
        de: `${BASE_URL}/de`,
      },
    },
  });

  return entries;
}
