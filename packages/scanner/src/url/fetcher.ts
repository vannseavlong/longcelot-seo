/**
 * URL fetcher for live site scanning.
 * Handles HTTP requests with proper error handling and timeout.
 */

import * as cheerio from 'cheerio';

export interface FetchedPage {
  /** The final URL after redirects */
  url: string;
  /** HTTP status code */
  status: number;
  /** Response headers */
  headers: Record<string, string>;
  /** Parsed HTML DOM */
  $: cheerio.CheerioAPI;
  /** Raw HTML content */
  html: string;
}

export interface FetchOptions {
  /** Custom user agent string */
  userAgent: string;
  /** Request timeout in ms */
  timeout: number;
  /** Follow HTTP redirects */
  followRedirects: boolean;
}

const DEFAULT_OPTIONS: FetchOptions = {
  userAgent: 'longcelot-seo/0.1.0 (URL Scanner)',
  timeout: 30000,
  followRedirects: true,
};

/**
 * Fetch a URL and parse its HTML content.
 */
export async function fetchPage(
  url: string,
  options: Partial<FetchOptions> = {}
): Promise<FetchedPage> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), opts.timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: opts.followRedirects ? 'follow' : 'manual',
      headers: {
        'User-Agent': opts.userAgent,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    clearTimeout(timeoutId);

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract headers from response
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    return {
      url: response.url,
      status: response.status,
      headers,
      $,
      html,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${opts.timeout}ms: ${url}`);
      }
      throw new Error(`Failed to fetch ${url}: ${error.message}`);
    }
    throw new Error(`Failed to fetch ${url}: Unknown error`);
  }
}

/**
 * Check if a URL is valid and reachable.
 */
export async function isUrlReachable(url: string, options?: Partial<FetchOptions>): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), (options?.timeout ?? 5000));

    const response = await fetch(url, {
      signal: controller.signal,
      method: 'HEAD',
      headers: {
        'User-Agent': options?.userAgent ?? DEFAULT_OPTIONS.userAgent,
      },
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Extract all internal links from a fetched page.
 */
export function extractLinks(page: FetchedPage, baseUrl: string): string[] {
  const links: Set<string> = new Set();
  const base = new URL(baseUrl);

  page.$('a[href]').each((_i) => {
    const href = page.$('a[href]').eq(_i).attr('href');
    if (!href) return;

    try {
      // Handle relative URLs
      const resolved = new URL(href, baseUrl);
      
      // Only include internal links (same domain)
      if (resolved.hostname === base.hostname) {
        // Remove hash fragments
        const cleanUrl = resolved.toString().split('#')[0];
        if (cleanUrl) {
          links.add(cleanUrl);
        }
      }
    } catch {
      // Invalid URL, skip
    }
  });

  return Array.from(links);
}

/**
 * Extract all image URLs from a fetched page.
 */
export function extractImages(page: FetchedPage): Array<{ src: string; alt: string }> {
  const images: Array<{ src: string; alt: string }> = [];

  page.$('img').each((_i) => {
    const img = page.$('img').eq(_i);
    const src = img.attr('src') ?? img.attr('data-src') ?? '';
    const alt = img.attr('alt') ?? '';

    if (src) {
      images.push({ src, alt });
    }
  });

  return images;
}
