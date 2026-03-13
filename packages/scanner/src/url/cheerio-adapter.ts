/**
 * Cheerio adapter for URL-based SEO rule checking.
 * Applies SEO rules to live webpage DOM using cheerio.
 */

import type * as cheerio from 'cheerio';
import type { RuleViolation } from '@longcelot-seo/core';

export interface PageMetadata {
  /** Page title */
  title: string;
  /** Meta description */
  description: string;
  /** Canonical URL */
  canonical: string | null;
  /** Open Graph tags */
  og: {
    title: string | null;
    description: string | null;
    image: string | null;
    url: string | null;
    type: string | null;
  };
  /** Twitter card data */
  twitter: {
    card: string | null;
    title: string | null;
    description: string | null;
    image: string | null;
  };
  /** H1 tags found */
  h1s: string[];
  /** All headings (h1-h6) */
  headings: Array<{ level: number; text: string }>;
  /** Images */
  images: Array<{ src: string; alt: string; hasAlt: boolean }>;
  /** Links */
  links: Array<{ href: string; text: string; isInternal: boolean; isHash: boolean }>;
  /** Structured data scripts */
  structuredData: string[];
  /** Language attribute */
  lang: string | null;
  /** Charset */
  charset: string | null;
}

/**
 * Extract all SEO-relevant metadata from a page.
 */
export function extractMetadata($: cheerio.CheerioAPI, baseUrl: string): PageMetadata {
  const base = new URL(baseUrl);

  // Extract title
  const title = $('title').first().text().trim() ?? '';

  // Extract meta description
  const description = $('meta[name="description"]').attr('content') ?? '';

  // Extract canonical URL
  const canonical = $('link[rel="canonical"]').attr('href') ?? null;

  // Extract Open Graph tags
  const og = {
    title: $('meta[property="og:title"]').attr('content') ?? null,
    description: $('meta[property="og:description"]').attr('content') ?? null,
    image: $('meta[property="og:image"]').attr('content') ?? null,
    url: $('meta[property="og:url"]').attr('content') ?? null,
    type: $('meta[property="og:type"]').attr('content') ?? null,
  };

  // Extract Twitter card data
  const twitter = {
    card: $('meta[name="twitter:card"]').attr('content') ?? null,
    title: $('meta[name="twitter:title"]').attr('content') ?? null,
    description: $('meta[name="twitter:description"]').attr('content') ?? null,
    image: $('meta[name="twitter:image"]').attr('content') ?? null,
  };

  // Extract H1s
  const h1s: string[] = [];
  $('h1').each(function () {
    const text = $(this).text().trim();
    if (text) h1s.push(text);
  });

  // Extract all headings
  const headings: Array<{ level: number; text: string }> = [];
  for (let level = 1; level <= 6; level++) {
    $(`h${level}`).each(function () {
      const text = $(this).text().trim();
      if (text) headings.push({ level, text });
    });
  }

  // Extract images
  const images: Array<{ src: string; alt: string; hasAlt: boolean }> = [];
  $('img').each(function () {
    const img = $(this);
    const src = img.attr('src') ?? img.attr('data-src') ?? '';
    const alt = img.attr('alt') ?? '';
    if (src) {
      images.push({ src, alt, hasAlt: alt.length > 0 });
    }
  });

  // Extract links
  const links: Array<{ href: string; text: string; isInternal: boolean; isHash: boolean }> = [];
  $('a[href]').each(function () {
    const anchor = $(this);
    const href = anchor.attr('href') ?? '';
    const text = anchor.text().trim();

    if (href) {
      try {
        const resolved = new URL(href, baseUrl);
        const isInternal = resolved.hostname === base.hostname;
        const isHash = href.startsWith('#');

        links.push({ href: resolved.toString(), text, isInternal, isHash });
      } catch {
        // Invalid URL, skip
      }
    }
  });

  // Extract structured data (JSON-LD)
  const structuredData: string[] = [];
  $('script[type="application/ld+json"]').each(function () {
    const content = $(this).html();
    if (content) structuredData.push(content);
  });

  // Extract language
  const lang = $('html').attr('lang') ?? null;

  // Extract charset
  const charset = $('meta[charset]').attr('charset') ?? 
                 $('meta[http-equiv="Content-Type"]').attr('content')?.split('charset=')[1] ?? 
                 null;

  return {
    title,
    description,
    canonical,
    og,
    twitter,
    h1s,
    headings,
    images,
    links,
    structuredData,
    lang,
    charset,
  };
}

/**
 * Run SEO rules on extracted metadata.
 */
export function runUrlRules(
  url: string,
  metadata: PageMetadata,
  $?: cheerio.CheerioAPI
): RuleViolation[] {
  const violations: RuleViolation[] = [];

  // Rule: missing-title
  if (!metadata.title || metadata.title.length === 0) {
    violations.push({
      ruleId: 'missing-title',
      message: 'Page is missing a title tag',
      severity: 'critical',
      location: url,
    });
  }

  // Rule: missing-meta-description
  if (!metadata.description || metadata.description.length === 0) {
    violations.push({
      ruleId: 'missing-meta-description',
      message: 'Page is missing a meta description',
      severity: 'high',
      location: url,
    });
  }

  // Rule: missing-h1
  if (metadata.h1s.length === 0) {
    violations.push({
      ruleId: 'missing-h1',
      message: 'Page has no H1 heading',
      severity: 'high',
      location: url,
    });
  }

  // Rule: duplicate-h1
  if (metadata.h1s.length > 1) {
    const uniqueH1s = new Set(metadata.h1s.map((h) => h.toLowerCase()));
    if (uniqueH1s.size < metadata.h1s.length) {
      violations.push({
        ruleId: 'duplicate-h1',
        message: `Page has ${metadata.h1s.length} H1 tags with duplicate content`,
        severity: 'medium',
        location: url,
      });
    }
  }

  // Rule: missing-alt-text
  const imagesWithoutAlt = metadata.images.filter((img) => !img.hasAlt);
  if (imagesWithoutAlt.length > 0) {
    violations.push({
      ruleId: 'missing-alt-text',
      message: `${imagesWithoutAlt.length} image(s) missing alt text`,
      severity: 'medium',
      location: url,
      snippet: imagesWithoutAlt.slice(0, 3).map((i) => i.src).join(', '),
    });
  }

  // Rule: hash-routing
  const hashLinks = metadata.links.filter((link) => link.isHash);
  if (hashLinks.length > 0) {
    violations.push({
      ruleId: 'hash-routing',
      message: `${hashLinks.length} hash-based navigation link(s) found (poor for SEO)`,
      severity: 'medium',
      location: url,
      snippet: hashLinks.slice(0, 3).map((l) => l.href).join(', '),
    });
  }

  // Rule: js-only-links (links with only JavaScript handlers)
  const jsLinks = metadata.links.filter(
    (link) => link.text === '' && !link.isHash
  );
  if (jsLinks.length > 0) {
    violations.push({
      ruleId: 'js-only-links',
      message: `${jsLinks.length} link(s) with no anchor text found`,
      severity: 'low',
      location: url,
    });
  }

  // Rule: missing-canonical
  if (!metadata.canonical) {
    violations.push({
      ruleId: 'missing-canonical',
      message: 'Page is missing a canonical URL',
      severity: 'medium',
      location: url,
    });
  }

  // Rule: missing-og-tags
  const ogTagsPresent = [metadata.og.title, metadata.og.description, metadata.og.image].filter(
    (v) => v !== null
  ).length;
  if (ogTagsPresent < 2) {
    violations.push({
      ruleId: 'missing-og-tags',
      message: `Page is missing Open Graph tags (${3 - ogTagsPresent} of 3 missing)`,
      severity: 'medium',
      location: url,
    });
  }

  // Rule: missing-structured-data
  if (metadata.structuredData.length === 0) {
    violations.push({
      ruleId: 'missing-structured-data',
      message: 'Page has no structured data (JSON-LD)',
      severity: 'low',
      location: url,
    });
  }

  // Rule: missing-lang-attr
  if (!metadata.lang) {
    violations.push({
      ruleId: 'missing-lang-attr',
      message: 'Page is missing lang attribute on html element',
      severity: 'high',
      location: url,
    });
  }

  // Rule: title-too-short
  if (metadata.title && metadata.title.length > 0 && metadata.title.length < 30) {
    violations.push({
      ruleId: 'title-too-short',
      message: `Title is too short (${metadata.title.length} chars, recommended: 30-60)`,
      severity: 'medium',
      location: url,
    });
  }

  // Rule: title-too-long
  if (metadata.title && metadata.title.length > 60) {
    violations.push({
      ruleId: 'title-too-long',
      message: `Title is too long (${metadata.title.length} chars, recommended: 30-60)`,
      severity: 'medium',
      location: url,
    });
  }

  // Rule: description-too-short
  if (metadata.description && metadata.description.length > 0 && metadata.description.length < 120) {
    violations.push({
      ruleId: 'description-too-short',
      message: `Meta description is too short (${metadata.description.length} chars, recommended: 120-160)`,
      severity: 'medium',
      location: url,
    });
  }

  // Rule: description-too-long
  if (metadata.description && metadata.description.length > 160) {
    violations.push({
      ruleId: 'description-too-long',
      message: `Meta description is too long (${metadata.description.length} chars, recommended: 120-160)`,
      severity: 'medium',
      location: url,
    });
  }

  // Rule: multiple-canonical
  // Check if there are multiple canonical tags
  if ($) {
    let canonicalCount = 0;
    $('link[rel="canonical"]').each(function () {
      canonicalCount++;
    });
    if (canonicalCount > 1) {
      violations.push({
        ruleId: 'multiple-canonical',
        message: `Page has ${canonicalCount} canonical URLs (should have exactly 1)`,
        severity: 'high',
        location: url,
      });
    }
  }

  // Rule: missing-viewport
  if ($) {
    const viewportMeta = $('meta[name="viewport"]');
    if (viewportMeta.length === 0) {
      violations.push({
        ruleId: 'missing-viewport',
        message: 'Page is missing viewport meta tag (important for mobile)',
        severity: 'high',
        location: url,
      });
    }
  }

  // Rule: missing-charset
  if (!metadata.charset) {
    violations.push({
      ruleId: 'missing-charset',
      message: 'Page is missing charset meta tag',
      severity: 'high',
      location: url,
    });
  }

  return violations;
}
