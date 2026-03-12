import { Command } from 'commander';
import { createRequire } from 'module';
import { printBanner } from '../banner.js';
import { registerCommands } from '../commands/index.js';

const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const pkg = require('../../package.json') as { version: string };

const program = new Command();

program
  .name('lseo')
  .description('longcelot-seo — The SEO engineer\'s best friend')
  .version(pkg.version, '-v, --version', 'Print the current version')
  .hook('preAction', () => {
    printBanner(pkg.version);
  });

registerCommands(program);

program.parse(process.argv);
