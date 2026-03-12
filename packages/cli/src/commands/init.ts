import type { Command } from 'commander';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import { BRAND_COLOR } from '@longcelot-seo/core';

const sky = chalk.hex(BRAND_COLOR);

const CONFIG_TEMPLATE = `// lseo.config.js
// longcelot-seo configuration — https://github.com/vannseavlong/longcelot-seo
module.exports = {
  scan: {
    include: ['src/**/*.{js,jsx,ts,tsx,vue}'],
    exclude: ['node_modules', 'dist', '.next'],
    framework: 'auto', // 'nextjs' | 'nuxt' | 'vue' | 'react'
  },
  url: {
    timeout: 15000,
    followRedirects: true,
    delay: 300,         // ms between requests during crawl
    userAgent: 'longcelot-seo-bot/1.0',
  },
  output: {
    format: 'prompt',   // 'prompt' | 'json' | 'markdown' | 'table'
    outputFile: null,   // null = stdout, or path to write file
  },
  rules: {
    missingTitle: true,
    missingMetaDescription: true,
    missingH1: true,
    duplicateH1: true,
    missingAltText: true,
    hashRouting: true,
    jsOnlyLinks: true,
    missingCanonical: true,
    missingOgTags: true,
    missingStructuredData: true,
  },
};
`;

/** Register the `lseo init` command. */
export function registerInitCommand(program: Command): void {
  program
    .command('init')
    .description('Scaffold lseo.config.js in the current project root')
    .option('--dir <path>', 'Target directory', process.cwd())
    .action((options: { dir: string }) => {
      const configPath = join(options.dir, 'lseo.config.js');

      if (existsSync(configPath)) {
        process.stdout.write(
          chalk.yellow(`⚠️  lseo.config.js already exists at ${configPath}\n`),
        );
        process.stdout.write(chalk.yellow('   Delete it first if you want to regenerate.\n'));
        return;
      }

      writeFileSync(configPath, CONFIG_TEMPLATE, 'utf-8');
      process.stdout.write(sky(`✅ Created lseo.config.js at ${configPath}\n`));
      process.stdout.write('\n');
      process.stdout.write('  Next steps:\n');
      process.stdout.write('    1. Edit lseo.config.js to match your project\n');
      process.stdout.write('    2. Run: lseo scan\n');
      process.stdout.write('    3. Paste the output into your AI agent\n');
    });
}
