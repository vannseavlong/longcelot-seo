/**
 * JSX/TSX parser using Babel.
 * Extracts AST nodes for SEO rule evaluation.
 */

import { parse } from '@babel/parser';
import * as traverse from '@babel/traverse';
import type { FileInfo } from './walker.js';
import type { RuleViolation } from '@longcelot-seo/core';

/** Parsed AST result */
export interface ParsedFile {
  file: FileInfo;
  ast: unknown;
  metadata: FileMetadata;
}

/** Extracted metadata from file */
export interface FileMetadata {
  hasJsx: boolean;
  hasTitleExport: boolean;
  hasHeadElement: boolean;
  hasMetadataExport: boolean;
  hasGetLayout: boolean;
  hasGetServerSideProps: boolean;
  hasGetStaticProps: boolean;
  images: ImageInfo[];
  links: LinkInfo[];
  h1Count: number;
  hasCanonical: boolean;
  hasOgTags: boolean;
  hasStructuredData: boolean;
  hasHashRouting: boolean;
}

/** Image element info */
export interface ImageInfo {
  src: string | null;
  alt: string | null;
  line: number;
}

/** Link element info */
export interface LinkInfo {
  href: string | null;
  isHashLink: boolean;
  isJsLink: boolean;
  line: number;
}

/**
 * Parses a JSX/TSX file and extracts metadata for SEO rules.
 */
export function parseJsx(file: FileInfo): ParsedFile {
  const isTsx = file.extension === 'tsx';
  const plugins = isTsx
    ? ['typescript', 'jsx']
    : ['jsx'];

  let ast: ReturnType<typeof parse> | null = null;

  try {
    ast = parse(file.contents, {
      sourceType: 'module',
      plugins: plugins as ['jsx'],
      errorRecovery: true,
    });
  } catch {
    // Return empty AST on parse error
    ast = parse('', { sourceType: 'module', plugins: ['jsx'] });
  }

  const metadata: FileMetadata = {
    hasJsx: true,
    hasTitleExport: false,
    hasHeadElement: false,
    hasMetadataExport: false,
    hasGetLayout: false,
    hasGetServerSideProps: false,
    hasGetStaticProps: false,
    images: [],
    links: [],
    h1Count: 0,
    hasCanonical: false,
    hasOgTags: false,
    hasStructuredData: false,
    hasHashRouting: false,
  };

  if (ast) {
    try {
      traverse.default(ast, {
        ExportNamedDeclaration(path: { node: unknown }) {
          const node = path.node as { declaration?: unknown };
          const decl = node.declaration;
          if (!decl) return;

          // Check for metadata export (Next.js)
          if (decl && typeof decl === 'object' && 'type' in decl && decl.type === 'VariableDeclaration') {
            const varDecl = decl as { type: string; declarations: unknown[] };
            for (const decl2 of varDecl.declarations) {
              if (decl2 && typeof decl2 === 'object' && 'id' in decl2) {
                const id = (decl2 as { id: { name?: string } }).id;
                if (id && id.name === 'metadata') {
                  metadata.hasMetadataExport = true;
                  metadata.hasTitleExport = true; // Assume title exists if metadata does
                }
              }
            }
          }

          // Check for getStaticProps / getServerSideProps
          if (decl && typeof decl === 'object' && 'type' in decl && decl.type === 'FunctionDeclaration') {
            const fnDecl = decl as { id?: { name?: string } };
            const fnName = fnDecl.id?.name;
            if (fnName === 'getStaticProps') metadata.hasGetStaticProps = true;
            if (fnName === 'getServerSideProps') metadata.hasGetServerSideProps = true;
          }
        },

        JSXElement(path: { node: unknown }) {
          const jsxNode = path.node as {
            openingElement: {
              name: { name?: string };
              attributes: unknown[];
            };
            loc?: { start?: { line: number } };
          };
          const elementName = jsxNode.openingElement?.name;
          if (!elementName) return;

          const tagName = elementName.name?.toLowerCase();
          const line = jsxNode.loc?.start?.line ?? 0;

          // Handle <h1> elements
          if (tagName === 'h1') {
            metadata.h1Count++;
          }

          // Handle <head> elements
          if (tagName === 'head') {
            metadata.hasHeadElement = true;
            metadata.hasTitleExport = true;
          }

          // Handle <img> elements
          if (tagName === 'img') {
            const src = getJsxAttribute(jsxNode.openingElement.attributes, 'src');
            const alt = getJsxAttribute(jsxNode.openingElement.attributes, 'alt');
            metadata.images.push({
              src: src ?? null,
              alt: alt ?? null,
              line,
            });
          }

          // Handle <a> elements
          if (tagName === 'a') {
            const href = getJsxAttribute(jsxNode.openingElement.attributes, 'href');
            const onClick = getJsxAttribute(jsxNode.openingElement.attributes, 'onClick');

            metadata.links.push({
              href: href ?? null,
              isHashLink: (href ?? '').startsWith('#'),
              isJsLink: onClick !== undefined && (href === undefined || href === null),
              line,
            });
          }

          // Handle <link> elements for canonical and OG
          if (tagName === 'link') {
            const rel = getJsxAttribute(jsxNode.openingElement.attributes, 'rel');
            if (rel === 'canonical') {
              metadata.hasCanonical = true;
            }
            if (rel?.includes('og:')) {
              metadata.hasOgTags = true;
            }
          }

          // Check for script tags with JSON-LD
          if (tagName === 'script') {
            const type = getJsxAttribute(jsxNode.openingElement.attributes, 'type');
            if (type === 'application/ld+json') {
              metadata.hasStructuredData = true;
            }
          }
        },

        JSXFragment(path: { node: unknown }) {
          const jsxNode = path.node as {
            openingFragment: { name: { name?: string } };
          };
          const elementName = jsxNode.openingFragment?.name;
          if (elementName?.name?.toLowerCase() === 'h1') {
            metadata.h1Count++;
          }
        },

        Program() {
          // Check for hash routing patterns in the source
          if (file.contents.includes('useHashRouter') || file.contents.includes('<HashRouter')) {
            metadata.hasHashRouting = true;
          }
        },
      });
    } catch {
      // Skip traversal errors - continue with partial results
    }
  }

  return { file, ast, metadata };
}

/**
 * Helper to get a JSX attribute value as a string.
 */
function getJsxAttribute(
  attributes: unknown[],
  name: string
): string | null | undefined {
  if (!Array.isArray(attributes)) return undefined;

  for (const attr of attributes) {
    if (attr && typeof attr === 'object' && 'type' in attr && attr.type === 'JSXAttribute') {
      const jsxAttr = attr as { name?: { name?: string }; value?: { type?: string; value?: string } };
      const attrName = jsxAttr.name?.name;
      if (attrName === name && jsxAttr.value) {
        if (jsxAttr.value.type === 'StringLiteral' && 'value' in jsxAttr.value) {
          return jsxAttr.value.value as string;
        }
        if (jsxAttr.value.type === 'JSXExpressionContainer') {
          // Handle expressions like {someVar}
          return null;
        }
      }
    }
  }

  return undefined;
}

/**
 * Extracts all rule violations from a parsed JSX file.
 */
export function extractViolations(parsedFile: ParsedFile): RuleViolation[] {
  const violations: RuleViolation[] = [];
  const { file, metadata } = parsedFile;
  const line = 1;

  // missing-title
  if (!metadata.hasTitleExport && !metadata.hasHeadElement) {
    violations.push({
      ruleId: 'missing-title',
      message: 'Missing <title> in Metadata export or <Head> component',
      severity: 'critical',
      location: file.relativePath,
      line,
    });
  }

  // missing-h1
  if (metadata.h1Count === 0) {
    violations.push({
      ruleId: 'missing-h1',
      message: 'No <h1> found in rendered output',
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

  // js-only-links
  for (const link of metadata.links) {
    if (link.isJsLink || (link.href === null && link.line > 0)) {
      violations.push({
        ruleId: 'js-only-links',
        message: '<a> without href (JS-only navigation)',
        severity: 'high',
        location: file.relativePath,
        line: link.line,
      });
    }
  }

  // missing-canonical
  if (!metadata.hasCanonical && metadata.hasMetadataExport) {
    violations.push({
      ruleId: 'missing-canonical',
      message: 'Missing canonical tag in Metadata',
      severity: 'medium',
      location: file.relativePath,
      line,
    });
  }

  // missing-og-tags
  if (!metadata.hasOgTags && metadata.hasMetadataExport) {
    violations.push({
      ruleId: 'missing-og-tags',
      message: 'Open Graph tags missing in Metadata',
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

  // hash-routing
  if (metadata.hasHashRouting) {
    violations.push({
      ruleId: 'hash-routing',
      message: 'Hash-based routing detected (not ideal for SEO)',
      severity: 'high',
      location: file.relativePath,
      line,
    });
  }

  return violations;
}