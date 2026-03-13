import type { Command } from 'commander';
import chalk from 'chalk';
import {
  crawlUrl,
  discoverSitemap,
  parseSitemap,
  extractMetadata,
  runUrlRules,
  fetchPage,
  type CrawlResult,
} from '@longcelot-seo/scanner';
import { loadConfig } from '../lib/config.js';
import { formatOutput } from '../lib/output.js';
import { generateSummary } from '../lib/prompt-generator.js';
import type { ScanResult } from '@longcelot-seo/core';

function writeStdout(message: string): void {
  process.stdout.write(`${message}\n`);
}

function writeStderr(message: string): void {
  process.stderr.write(`${message}\n`);
}

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
    .action(async (url: string, options) => {
      try {
        // Validate URL
        let targetUrl: string;
        try {
          targetUrl = new URL(url).toString();
        } catch {
          writeStderr(chalk.red(`Invalid URL: ${url}`));
          process.exit(1);
        }

        const depth = parseInt(options.depth ?? '1', 10);
        const limit = parseInt(options.limit ?? '50', 10);
        const outputFormat = options.output as 'prompt' | 'json' | 'markdown' | 'table';
        const useSitemap = options.sitemap ?? false;
        const userAgent = options.userAgent ?? 'longcelot-seo/0.1.0 (URL Scanner)';
        const outputFile = options.file ?? null;

        // Load config for URL settings
        const config = await loadConfig(process.cwd());
        const timeout = config.url.timeout ?? 30000;
        const delay = config.url.delay ?? 100;

        writeStdout(chalk.cyan(`\n🔍 Scanning: ${targetUrl}\n`));

        let crawlResults: CrawlResult;

        if (useSitemap) {
          // Try to discover sitemap
          const sitemapUrl = await discoverSitemap(targetUrl);
          
          if (sitemapUrl) {
            writeStdout(chalk.dim(`Found sitemap: ${sitemapUrl}`));
            const sitemapUrls = await parseSitemap(sitemapUrl);
            writeStdout(chalk.dim(`Discovered ${sitemapUrls.length} URL(s) from sitemap\n`));
            
            // Crawl limited number of URLs from sitemap
            const urlsToScan = sitemapUrls.slice(0, limit);
            crawlResults = {
              pages: [],
              successCount: 0,
              errorCount: 0,
              errors: [],
            };

            for (const sitemapUrlItem of urlsToScan) {
              try {
                const data = await fetchPage(sitemapUrlItem, { userAgent, timeout });
                crawlResults.pages.push({
                  url: data.url,
                  status: data.status,
                  depth: 0,
                  data,
                });
                crawlResults.successCount++;
              } catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                crawlResults.errors.push({ url: sitemapUrlItem, message, depth: 0 });
                crawlResults.errorCount++;
              }
            }
          } else {
            writeStdout(chalk.yellow('No sitemap found, crawling from page links\n'));
            crawlResults = await crawlUrl({
              url: targetUrl,
              depth,
              limit,
              userAgent,
              timeout,
              delay,
            });
          }
        } else {
          // Standard crawl
          crawlResults = await crawlUrl({
            url: targetUrl,
            depth,
            limit,
            userAgent,
            timeout,
            delay,
          });
        }

        writeStdout(chalk.dim(`Crawled ${crawlResults.successCount} page(s), ${crawlResults.errorCount} error(s)\n`));

        // Process each crawled page
        const results: ScanResult[] = [];

        for (const page of crawlResults.pages) {
          if (page.status !== 200) {
            continue;
          }

          // Extract metadata and run rules
          const metadata = extractMetadata(page.data.$, page.url);
          const violations = runUrlRules(page.url, metadata, page.data.$);

          results.push({
            target: page.url,
            type: 'url',
            framework: 'unknown',
            violations,
            scannedAt: new Date().toISOString(),
          });
        }

        // Show errors if any
        if (crawlResults.errors.length > 0) {
          writeStdout(chalk.yellow(`\n⚠️  ${crawlResults.errors.length} page(s) failed to fetch:\n`));
          for (const error of crawlResults.errors.slice(0, 5)) {
            writeStdout(chalk.dim(`  - ${error.url}: ${error.message}`));
          }
          if (crawlResults.errors.length > 5) {
            writeStdout(chalk.dim(`  ... and ${crawlResults.errors.length - 5} more`));
          }
        }

        // Filter results (only show pages with violations)
        const resultsToShow = results.filter((r) => r.violations.length > 0);

        if (resultsToShow.length === 0) {
          writeStdout(chalk.green('\n✅ No SEO violations found!\n'));
          if (outputFile) {
            writeStdout(chalk.green(`✓ Results written to ${outputFile}`));
          }
          return;
        }

        // Format output
        const formatted = formatOutput(resultsToShow, outputFormat);

        // Output
        if (outputFile) {
          const fs = await import('node:fs/promises');
          await fs.writeFile(outputFile, formatted, 'utf-8');
          writeStdout(chalk.green(`✓ Results written to ${outputFile}`));
        } else {
          writeStdout(formatted);
        }

        // Show summary
        if (outputFormat === 'prompt') {
          writeStdout(`\n${chalk.dim(generateSummary(resultsToShow))}`);
        }

        // Exit with code if there are critical violations
        const criticalCount = results.reduce(
          (sum, r) => sum + r.violations.filter((v) => v.severity === 'critical').length,
          0
        );
        if (criticalCount > 0) {
          process.exit(1);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        writeStderr(chalk.red(`Error running url scan: ${message}`));
        process.exit(1);
      }
    });
}
