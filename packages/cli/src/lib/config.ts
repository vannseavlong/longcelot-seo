import { cosmiconfig } from 'cosmiconfig';
import { z } from 'zod';
import { DEFAULT_CONFIG } from '@longcelot-seo/core';
import type { LseoConfig } from '@longcelot-seo/core';

const frameworkSchema = z.enum(['nextjs', 'nuxt', 'vue', 'react', 'auto', 'unknown']);
const outputFormatSchema = z.enum(['prompt', 'json', 'markdown', 'table']);

const lseoConfigSchema = z.object({
  scan: z
    .object({
      include: z.array(z.string()).default([...DEFAULT_CONFIG.scan.include]),
      exclude: z.array(z.string()).default([...DEFAULT_CONFIG.scan.exclude]),
      framework: frameworkSchema.default(DEFAULT_CONFIG.scan.framework),
    })
    .default({
      include: [...DEFAULT_CONFIG.scan.include],
      exclude: [...DEFAULT_CONFIG.scan.exclude],
      framework: DEFAULT_CONFIG.scan.framework,
    }),

  url: z
    .object({
      timeout: z.number().int().positive().default(DEFAULT_CONFIG.url.timeout),
      followRedirects: z.boolean().default(DEFAULT_CONFIG.url.followRedirects),
      delay: z.number().int().min(0).default(DEFAULT_CONFIG.url.delay),
      userAgent: z.string().min(1).default(DEFAULT_CONFIG.url.userAgent),
    })
    .default(DEFAULT_CONFIG.url),

  output: z
    .object({
      format: outputFormatSchema.default(DEFAULT_CONFIG.output.format),
      outputFile: z.string().nullable().default(DEFAULT_CONFIG.output.outputFile),
    })
    .default(DEFAULT_CONFIG.output),

  rules: z
    .object({
      missingTitle: z.boolean().default(DEFAULT_CONFIG.rules.missingTitle),
      missingMetaDescription: z.boolean().default(DEFAULT_CONFIG.rules.missingMetaDescription),
      missingH1: z.boolean().default(DEFAULT_CONFIG.rules.missingH1),
      duplicateH1: z.boolean().default(DEFAULT_CONFIG.rules.duplicateH1),
      missingAltText: z.boolean().default(DEFAULT_CONFIG.rules.missingAltText),
      hashRouting: z.boolean().default(DEFAULT_CONFIG.rules.hashRouting),
      jsOnlyLinks: z.boolean().default(DEFAULT_CONFIG.rules.jsOnlyLinks),
      missingCanonical: z.boolean().default(DEFAULT_CONFIG.rules.missingCanonical),
      missingOgTags: z.boolean().default(DEFAULT_CONFIG.rules.missingOgTags),
      missingStructuredData: z.boolean().default(DEFAULT_CONFIG.rules.missingStructuredData),
    })
    .default(DEFAULT_CONFIG.rules),
});

const explorer = cosmiconfig('lseo', {
  searchPlaces: [
    'lseo.config.js',
    'lseo.config.cjs',
    'lseo.config.mjs',
    'lseo.config.ts',
    '.lseorc',
    '.lseorc.json',
    '.lseorc.js',
    'package.json',
  ],
});

/**
 * Load and validate the lseo config from the project root.
 * Falls back to defaults when no config file is found.
 */
export async function loadConfig(searchFrom?: string): Promise<LseoConfig> {
  const result = await explorer.search(searchFrom);

  const rawConfig: unknown = result?.config ?? {};
  const parsed = lseoConfigSchema.safeParse(rawConfig);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid lseo config:\n${issues}`);
  }

  return parsed.data;
}
