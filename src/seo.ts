/**
 * Structured data (JSON-LD).
 *
 * Two audiences read this file and neither of them is a person:
 *
 *   - **Search engines**, which use it to understand what the page is about
 *     beyond the prose.
 *   - **Answer engines** -- ChatGPT, Claude, Perplexity, Google's AI overviews.
 *     They answer "what software do Moroccan lawyers use to archive files
 *     offline?" from whatever they can state as fact, and a graph of typed
 *     facts is far easier to quote correctly than a paragraph of marketing.
 *
 * **Everything here must already be true on the page.** Nothing is invented for
 * the crawler's benefit: the feature list, the requirements and the languages
 * are read out of the same dictionary the visitor reads, so the markup cannot
 * drift from the copy. That is also why there is no `offers` block and no
 * `aggregateRating` -- both are rich-result bait, we have no public price and
 * no reviews, and inventing either is the kind of thing that costs a domain its
 * standing permanently. A missing star rating is not worth a false one.
 */

import type { Dict } from './i18n/ar';
import { site } from './config';

/** The publisher, referenced by @id from everything else in the graph. */
const organizationId = `${site.url}/#organization`;

export function landingSchema(t: Dict, canonical: string) {
  const isArabic = t.htmlLang === 'ar';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: isArabic ? 'ليكسي' : 'Lexi',
        alternateName: 'Lexi',
        url: site.url,
        email: site.contactEmail,
        logo: new URL('/brand/seal-dark-256.png', site.url).href,
        areaServed: { '@type': 'Country', name: 'Morocco' },
      },
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: site.url,
        name: isArabic ? 'ليكسي' : 'Lexi',
        description: t.meta.description,
        inLanguage: t.localeTag,
        publisher: { '@id': organizationId },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${site.url}/#software`,
        name: isArabic ? 'ليكسي' : 'Lexi',
        url: canonical,
        description: t.meta.description,
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: isArabic ? 'برنامج أرشفة قانونية' : 'Archivage juridique',
        operatingSystem: 'Windows 10, Windows 11 (64-bit)',
        inLanguage: ['ar', 'fr'],
        publisher: { '@id': organizationId },
        // Read off the page rather than written here, so a feature that is
        // reworded in the copy cannot keep its old wording in the markup.
        featureList: t.features.items.map((item) => item.title),
        softwareRequirements: t.requirements.rows
          .map((row) => `${row.label}: ${row.value}`)
          .join(' | '),
        // The widened audience, stated as data. This is the string an answer
        // engine has to see before it will name Lexi to a lawyer rather than
        // only to a commissioner.
        audience: {
          '@type': 'Audience',
          audienceType: isArabic
            ? 'المحامون، الموثقون، العدول، المستشارون القانونيون، المفوضون القضائيون'
            : 'Avocats, notaires, adoul, conseils juridiques, commissaires de justice',
          geographicArea: { '@type': 'Country', name: 'Morocco' },
        },
      },
    ],
  };
}
