/**
 * Vue Single File Component (SFC) parser.
 * Uses @vue/compiler-sfc to parse .vue files.
 */

import { parse } from '@vue/compiler-sfc';
import type { FileInfo } from './walker.js';
import type { RuleViolation } from '@longcelot-seo/core';

/** Parsed Vue file result */
export interface ParsedVueFile {
  file: FileInfo;
  descriptor: unknown;
  metadata: VueFileMetadata;
}

/** Extracted metadata from Vue file */
export interface VueFileMetadata {
  hasTitle: boolean;
  hasMetaDescription: boolean;
  images: VueImageInfo[];
  h1Count: number;
  hasCanonical: boolean;
  hasOgTags: boolean;
  hasStructuredData: boolean;
}

/** Image info from Vue template */
export interface VueImageInfo {
  src: string | null;
  alt: string | null;
  line: number;
}

/**
 * Parses a Vue SFC file and extracts metadata for SEO rules.
 */
export function parseVue(file: FileInfo): ParsedVueFile {
  let result;
  try {
    result = parse(file.contents);
  } catch {
    // Return empty on parse error
    result = { descriptor: null };
  }

  const descriptor = result?.descriptor;

  const metadata: VueFileMetadata = {
    hasTitle: false,
    hasMetaDescription: false,
    images: [],
    h1Count: 0,
    hasCanonical: false,
    hasOgTags: false,
    hasStructuredData: false,
  };

  // Parse template
  if (descriptor && typeof descriptor === 'object' && 'template' in descriptor) {
    const template = (descriptor as { template?: { content?: string; ast?: unknown } }).template;
    if (template?.content) {
      // Simple regex-based extraction for template content
      const templateContent = template.content;

      // Check for h1
      const h1Matches = templateContent.match(/<h1/gi);
      if (h1Matches) {
        metadata.h1Count = h1Matches.length;
      }

      // Check for title
      if (templateContent.includes('<title>')) {
        metadata.hasTitle = true;
      }

      // Check for img without alt
      const imgMatches = templateContent.match(/<img[^>]*>/gi);
      if (imgMatches) {
        for (const img of imgMatches) {
          const hasAlt = img.includes('alt=');
          const srcMatch = img.match(/src=["']([^"']+)["']/);
          metadata.images.push({
            src: srcMatch?.[1] ?? null,
            alt: hasAlt ? '' : null,
            line: 1, // Simplified - would need more complex line tracking
          });
        }
      }

      // Check for meta description
      if (templateContent.includes('name="description"') || templateContent.includes('property="og:description"')) {
        metadata.hasMetaDescription = true;
      }

      // Check for canonical
      if (templateContent.includes('rel="canonical"')) {
        metadata.hasCanonical = true;
      }

      // Check for OG tags
      if (templateContent.includes('property="og:')) {
        metadata.hasOgTags = true;
      }

      // Check for structured data
      if (templateContent.includes('application/ld+json')) {
        metadata.hasStructuredData = true;
      }
    }
  }

  // Check script setup for SEO composables
  if (descriptor && typeof descriptor === 'object' && 'script' in descriptor) {
    const script = (descriptor as { script?: { content?: string; setup?: string } }).script;
    const scriptContent = script?.content ?? '';
    const setupContent = script?.setup ?? '';

    if (
      scriptContent.includes('useHead') ||
      scriptContent.includes('useSeo') ||
      scriptContent.includes('useMeta') ||
      setupContent.includes('useHead') ||
      setupContent.includes('useSeo') ||
      setupContent.includes('useMeta')
    ) {
      metadata.hasTitle = true;
      metadata.hasMetaDescription = true;
    }
  }

  return { file, descriptor, metadata };
}

/**
 * Extracts rule violations from a parsed Vue file.
 */
export function extractViolationsFromVue(parsedFile: ParsedVueFile): RuleViolation[] {
  const violations: RuleViolation[] = [];
  const { file, metadata } = parsedFile;
  const line = 1;

  // missing-title
  if (!metadata.hasTitle) {
    violations.push({
      ruleId: 'missing-title',
      message: 'Missing <title> in template or useHead composable',
      severity: 'critical',
      location: file.relativePath,
      line,
    });
  }

  // missing-meta-description
  if (!metadata.hasMetaDescription) {
    violations.push({
      ruleId: 'missing-meta-description',
      message: 'Missing meta description in template or useHead composable',
      severity: 'critical',
      location: file.relativePath,
      line,
    });
  }

  // missing-h1
  if (metadata.h1Count === 0) {
    violations.push({
      ruleId: 'missing-h1',
      message: 'No <h1> found in template',
      severity: 'high',
      location: file.relativePath,
      line,
    });
  }

  // duplicate-h1
  if (metadata.h1Count > 1) {
    violations.push({
      ruleId: 'duplicate-h1',
      message: `Multiple <h1> found (${metadata.h1Count} instances)`,
      severity: 'high',
      location: file.relativePath,
      line,
    });
  }

  // missing-alt-text
  for (const img of metadata.images) {
    if (!img.alt || img.alt.trim() === '') {
      violations.push({
        ruleId: 'missing-alt-text',
        message: '<img> missing alt attribute',
        severity: 'high',
        location: file.relativePath,
        line: img.line,
      });
    }
  }

  // missing-canonical
  if (!metadata.hasCanonical) {
    violations.push({
      ruleId: 'missing-canonical',
      message: 'Missing canonical link tag',
      severity: 'medium',
      location: file.relativePath,
      line,
    });
  }

  // missing-og-tags
  if (!metadata.hasOgTags) {
    violations.push({
      ruleId: 'missing-og-tags',
      message: 'Open Graph meta tags missing',
      severity: 'medium',
      location: file.relativePath,
      line,
    });
  }

  // missing-structured-data
  if (!metadata.hasStructuredData) {
    violations.push({
      ruleId: 'missing-structured-data',
      message: 'No JSON-LD structured data found',
      severity: 'medium',
      location: file.relativePath,
      line,
    });
  }

  return violations;
}