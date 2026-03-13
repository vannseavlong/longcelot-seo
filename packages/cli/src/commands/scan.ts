import type { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'node:path';
import {
  walkFiles,
  detectFramework,
  parseJsx,
  extractViolations,
  parseVue,
  extractViolationsFromVue,
} from '@longcelot-seo/scanner';
import { runRules } from '@longcelot-seo/core';
import { loadConfig } from '../lib/config.js';
import { formatOutput } from '../lib/output.js';
import { generateSummary } from '../lib/prompt-generator.js';
import type { FrameworkType, RuleId, RuleViolation, ScanResult } from '@longcelot-seo/core';

function writeStdout(message: string): void {
  process.stdout.write(`${message}\n`);
}

function writeStderr(message: string): void {
  process.stderr.write(`${message}\n`);
}

/** Register the `lseo scan` command (Phase 2 implementation). */
export function registerScanCommand(program: Command): void {
  program
    .command('scan')
    .description('Scan your codebase for SEO issues and output an AI-ready prompt')
    .option('--dir <path>', 'Root directory to scan', process.cwd())
    .option('--framework <name>', 'Override framework detection: nextjs | nuxt | vue | react')
    .option('--output <format>', 'Output format: prompt | json | markdown | table', 'prompt')
    .option('--file <path>', 'Write output to file instead of stdout')
    .option('--rules <list>', 'Comma-separated list of rules to run')
    .option('--verbose', 'Show all files scanned, not just violations')
    .option('--ci', 'Exit code 1 if any critical violations found')
    .action(async (options) => {
      try {
        const dir = resolve(options.dir);
        const frameworkArg = options.framework as FrameworkType | undefined;
        const outputFormat = options.output as 'prompt' | 'json' | 'markdown' | 'table';
        const outputFile = options.file ? resolve(options.file) : null;
        const verbose = options.verbose ?? false;
        const ci = options.ci ?? false;

        // Parse rules list
        const rulesList = options.rules
          ? (options.rules.split(',') as RuleId[])
          : undefined;

        // Load config
        const config = await loadConfig(dir);

        // Detect framework
        const framework = detectFramework(dir, frameworkArg);

        if (verbose) {
          writeStdout(chalk.dim(`Detected framework: ${framework}`));
          writeStdout(chalk.dim(`Scanning directory: ${dir}`));
        }

        // Walk files
        const include = config.scan.include;
        const exclude = config.scan.exclude;

        const files = await walkFiles(dir, include, exclude);

        if (verbose) {
          writeStdout(chalk.dim(`Found ${files.length} file(s) to scan`));
        }

        // Scan each file
        const results: ScanResult[] = [];

        for (const file of files) {
          let violations: RuleViolation[] = [];

          if (file.extension === 'vue') {
            // Parse Vue files
            const parsed = parseVue(file);
            violations = extractViolationsFromVue(parsed);
          } else if (['tsx', 'jsx', 'ts', 'js'].includes(file.extension)) {
            // Parse JSX/TSX files
            const parsed = parseJsx(file);
            violations = extractViolations(parsed);
          }

          // Also run the rule engine for additional checks
          const ruleResults = runRules({
            filePath: file.relativePath,
            extension: file.extension,
            framework,
            contents: file.contents,
          }, rulesList);

          // Merge violations (deduplicate by ruleId + location + line)
          const allViolations = [...violations];
          for (const v of ruleResults) {
            const exists = allViolations.some(
              (existing) =>
                existing.ruleId === v.ruleId &&
                existing.location === v.location &&
                existing.line === v.line
            );
            if (!exists) {
              allViolations.push(v);
            }
          }

          results.push({
            target: file.relativePath,
            type: 'codebase',
            framework,
            violations: allViolations,
            scannedAt: new Date().toISOString(),
          });
        }

        // Filter results if verbose is false (only show files with violations)
        const resultsToShow = verbose ? results : results.filter((r) => r.violations.length > 0);

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
          writeStdout(`\n${chalk.dim(generateSummary(results))}`);
        }

        // Exit with code if ci flag is set and critical violations found
        if (ci) {
          const criticalCount = results.reduce(
            (sum, r) => sum + r.violations.filter((v) => v.severity === 'critical').length,
            0
          );
          if (criticalCount > 0) {
            writeStdout(chalk.red(`\n✗ Found ${criticalCount} critical violation(s). Exiting with code 1.`));
            process.exit(1);
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        writeStderr(chalk.red(`Error running scan: ${message}`));
        process.exit(1);
      }
    });
}