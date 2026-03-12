import chalk from 'chalk';
import figlet from 'figlet';
import { BRAND_COLOR, PACKAGE_NAME } from '@longcelot-seo/core';

/** Synchronously render a sky-blue ASCII art banner to stdout. */
export function printBanner(version: string): void {
  const art = figlet.textSync('LSEO', {
    font: 'ANSI Shadow',
    horizontalLayout: 'default',
    verticalLayout: 'default',
  });

  const sky = chalk.hex(BRAND_COLOR);

  process.stdout.write('\n');
  process.stdout.write(sky(art) + '\n');
  process.stdout.write(
    sky(`  ${PACKAGE_NAME.toUpperCase()} TOOLKIT  v${version}\n`),
  );
  process.stdout.write(sky("  The SEO engineer's best friend.\n"));
  process.stdout.write('\n');
}
