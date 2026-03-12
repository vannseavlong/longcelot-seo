import type { Command } from 'commander';
import chalk from 'chalk';

/** Register the `lseo url` command (Phase 3 implementation). */
export function registerUrlCommand(program: Command): void {
  program
    .command('url <url>')
    .description('Audit any live website URL with optional deep multi-page crawl')
    .option('--depth <n>', 'Crawl linked pages up to depth n', '1')
    .option('--limit <n>', 'Max pages to crawl', '50')
    .option('--output <format>', 'Output format: prompt | json | markdown | table', 'prompt')
    .option('--file <path>', 'Write results to file')
    .option('--psi', 'Run PageSpeed Insights API on each URL')
    .option('--compare <url>', 'Compare two URLs side-by-side')
    .option('--sitemap', 'Auto-discover URLs from sitemap.xml')
    .option('--user-agent <string>', 'Custom user agent string')
    .action((_url: string) => {
      process.stdout.write(
        chalk.yellow('⚠️  lseo url is not yet implemented — coming in Phase 3.\n'),
      );
      process.stdout.write(chalk.dim('   Follow: https://github.com/vannseavlong/longcelot-seo\n'));
    });
}
