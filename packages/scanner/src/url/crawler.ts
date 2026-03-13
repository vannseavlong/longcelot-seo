/**
 * Web crawler for multi-page URL scanning.
 * Implements BFS crawling with depth and limit controls.
 */

import type { FetchedPage } from './fetcher';
import { fetchPage, extractLinks } from './fetcher';

export interface CrawlResult {
  /** All pages crawled */
  pages: CrawledPage[];
  /** Total pages successfully fetched */
  successCount: number;
  /** Total pages that failed */
  errorCount: number;
  /** Errors encountered during crawling */
  errors: CrawlError[];
}

export interface CrawledPage {
  /** The page URL */
  url: string;
  /** HTTP status code */
  status: number;
  /** Depth level (0 = starting URL) */
  depth: number;
  /** The fetched page data */
  data: FetchedPage;
}

export interface CrawlError {
  /** URL that failed */
  url: string;
  /** Error message */
  message: string;
  /** Depth when error occurred */
  depth: number;
}

export interface CrawlOptions {
  /** Starting URL */
  url: string;
  /** Maximum crawl depth */
  depth: number;
  /** Maximum pages to crawl */
  limit: number;
  /** Custom user agent */
  userAgent: string;
  /** Request timeout in ms */
  timeout: number;
  /** Delay between requests in ms */
  delay: number;
  /** Follow redirects */
  followRedirects: boolean;
}

const DEFAULT_CRAWL_OPTIONS: Partial<CrawlOptions> = {
  depth: 1,
  limit: 50,
  userAgent: 'longcelot-seo/0.1.0 (URL Scanner)',
  timeout: 30000,
  delay: 100,
  followRedirects: true,
};

/**
 * Crawl a website starting from a URL.
 */
export async function crawlUrl(
  options: Partial<CrawlOptions>
): Promise<CrawlResult> {
  const opts = { ...DEFAULT_CRAWL_OPTIONS, ...options } as CrawlOptions;

  const visited: Set<string> = new Set();
  const queue: Array<{ url: string; depth: number }> = [];
  const pages: CrawledPage[] = [];
  const errors: CrawlError[] = [];

  // Initialize with starting URL
  queue.push({ url: opts.url, depth: 0 });
  visited.add(opts.url);

  while (queue.length > 0 && pages.length < opts.limit) {
    const current = queue.shift();
    if (!current) break;

    const { url, depth } = current;

    try {
      // Add delay between requests to be polite
      if (pages.length > 0 && opts.delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, opts.delay));
      }

      const data = await fetchPage(url, {
        userAgent: opts.userAgent,
        timeout: opts.timeout,
        followRedirects: opts.followRedirects,
      });

      pages.push({
        url: data.url,
        status: data.status,
        depth,
        data,
      });

      // Extract and queue links if within depth limit
      if (depth < opts.depth) {
        const links = extractLinks(data, data.url);
        
        for (const link of links) {
          if (!visited.has(link) && pages.length + queue.length < opts.limit) {
            visited.add(link);
            queue.push({ url: link, depth: depth + 1 });
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      errors.push({ url, message, depth });
    }
  }

  return {
    pages,
    successCount: pages.length,
    errorCount: errors.length,
    errors,
  };
}

/**
 * Parse sitemap.xml and extract URLs.
 */
export async function parseSitemap(url: string): Promise<string[]> {
  try {
    const data = await fetchPage(url, {
      userAgent: 'longcelot-seo/0.1.0 (Sitemap Parser)',
      timeout: 15000,
    });

    const urls: string[] = [];

    // Handle XML sitemap
    data.$('url loc').each((_index, elem) => {
      const loc = data.$(elem).text().trim();
      if (loc) urls.push(loc);
    });

    // Handle sitemap index (nested sitemaps)
    const sitemapElements = data.$('sitemap loc').toArray();
    for (const elem of sitemapElements) {
      const loc = data.$(elem).text().trim();
      if (loc) {
        try {
          // Recursively parse nested sitemaps
          const nested = await parseSitemap(loc);
          urls.push(...nested);
        } catch {
          // Ignore nested sitemap errors
        }
      }
    }

    return urls;
  } catch {
    return [];
  }
}

/**
 * Auto-discover sitemap from URL.
 */
export async function discoverSitemap(baseUrl: string): Promise<string | null> {
  const urlObj = new URL(baseUrl);
  const possibleSitemaps = [
    `${urlObj.origin}/sitemap.xml`,
    `${urlObj.origin}/sitemap_index.xml`,
    `${urlObj.origin}/sitemap-index.xml`,
  ];

  for (const sitemapUrl of possibleSitemaps) {
    try {
      const data = await fetchPage(sitemapUrl, {
        userAgent: 'longcelot-seo/0.1.0 (Sitemap Discovery)',
        timeout: 5000,
      });

      if (data.status === 200 && data.html.includes('<urlset')) {
        return sitemapUrl;
      }
    } catch {
      continue;
    }
  }

  return null;
}
