import type { Command } from 'commander';
import chalk from 'chalk';

/** Register the `lseo open` command (Phase 4 implementation). */
export function registerOpenCommand(program: Command): void {
  program
    .command('open')
    .description('Launch the Web Tools dashboard in your default browser')
    .option('--tool <name>', 'Open directly to a specific tool: gsc | psi | sf')
    .option('--url <url>', 'Pre-fill the URL input in the dashboard')
    .action(() => {
      process.stdout.write(
        chalk.yellow('⚠️  lseo open is not yet implemented — coming in Phase 4.\n'),
      );
      process.stdout.write(chalk.dim('   Follow: https://github.com/vannseavlong/longcelot-seo\n'));
    });
}
