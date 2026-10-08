import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const baseUrl = 'https://www.warsawuprisingmonument.com';

  const languages: Record<string, string> = {
    'zh': `${baseUrl}/zh`,
    'en': `${baseUrl}/en`,
    'pl': `${baseUrl}/pl`,
    'ru': `${baseUrl}/ru`,
    'de': `${baseUrl}/de`,
    'x-default': `${baseUrl}/en`,
  };

  const selfUrl = languages[locale] || languages['pl'];

  let localeCode = 'pl_PL';
  if (locale === 'zh') localeCode = 'zh_CN';
  else if (locale === 'en') localeCode = 'en_US';
  else if (locale === 'ru') localeCode = 'ru_RU';
  else if (locale === 'de') localeCode = 'de_DE';

  return {
    title: messages.meta.title,
    description: messages.meta.description,
    alternates: {
      canonical: selfUrl,
      languages,
    },
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      url: selfUrl,
      siteName: "Warsaw Uprising Monument",
      locale: localeCode,
      type: 'website',
      images: [
        {
          url: `${baseUrl}/gallery/image-1.jpg`,
          alt: 'Warsaw Uprising Monument (Pomnik Powstania Warszawskiego) in Warsaw, Poland',
        },
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  let htmlLang = 'pl';
  if (locale === 'zh') htmlLang = 'zh-CN';
  else if (locale === 'en') htmlLang = 'en';
  else if (locale === 'ru') htmlLang = 'ru';
  else if (locale === 'de') htmlLang = 'de';

  const baseUrl = 'https://warsawuprisingmonument.com';
  const selfUrl = `${baseUrl}/${locale}`;

  // TouristAttraction structured data for entity disambiguation & local SEO.
  // Geo coordinates verified from the official Google Maps place record
  // (maps.app.goo.gl/o1op4p1Fq98DU4WF9 → 52.249386, 21.0059007, plac Krasińskich).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': `${baseUrl}/#attraction`,
    name: 'Warsaw Uprising Monument',
    alternateName: ['Pomnik Powstania Warszawskiego', (messages as any).hero?.title],
    description: (messages as any).meta?.description,
    url: selfUrl,
    image: [
      `${baseUrl}/gallery/image-1.jpg`,
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'plac Krasińskich',
      postalCode: '00-263',
      addressLocality: 'Warsaw',
      addressRegion: 'Masovian Voivodeship',
      addressCountry: 'PL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 52.249386,
      longitude: 21.0059007,
    },
    hasMap: 'https://maps.app.goo.gl/o1op4p1Fq98DU4WF9',
    isAccessibleForFree: true,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    touristType: ['Historical Monument', 'WWII Memorial', 'Cultural Heritage Site'],
    sameAs: [
      'https://pl.wikipedia.org/wiki/Pomnik_Powstania_Warszawskiego',
      'https://www.1944.pl/',
      'https://maps.app.goo.gl/o1op4p1Fq98DU4WF9',
      'https://www.poland.travel/',
    ],
  };

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        {/* GA4 (G-HXM22WWPKP) — consent-gated via cookiePrefs.analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var prefs = JSON.parse(localStorage.getItem('cookiePrefs') || '{}');
                  window.dataLayer = window.dataLayer || [];
                  function gtag() { window.dataLayer.push(arguments); }
                  window.gtag = gtag;
                  function loadGA() {
                    gtag('js', new Date());
                    gtag('config', 'G-HXM22WWPKP', { anonymize_ip: true });
                    var s = document.createElement('script');
                    s.async = true;
                    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-HXM22WWPKP';
                    document.head.appendChild(s);
                  }
                  if (prefs.analytics) { loadGA(); }
                  document.addEventListener('consent-updated', function() {
                    var p = JSON.parse(localStorage.getItem('cookiePrefs') || '{}');
                    if (p.analytics) { loadGA(); }
                  });
                } catch(e) {}
              })();
            `,
          }}
        />
        {/* Service Worker registration (PWA) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
