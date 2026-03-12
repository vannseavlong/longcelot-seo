import type { Command } from 'commander';
import chalk from 'chalk';

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
    .action(() => {
      process.stdout.write(
        chalk.yellow('⚠️  lseo scan is not yet implemented — coming in Phase 2.\n'),
      );
      process.stdout.write(chalk.dim('   Follow: https://github.com/vannseavlong/longcelot-seo\n'));
    });
}
