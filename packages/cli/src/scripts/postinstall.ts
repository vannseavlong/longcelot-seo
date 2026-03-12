/**
 * postinstall.ts — Printed when the package is globally installed.
 * Built as CJS (.cjs) so it works without ESM loader flags.
 * Uses hardcoded ASCII art to avoid runtime figlet dependency issues.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const chalk = require('chalk') as { default: { hex: (color: string) => (text: string) => string } };
const pkg = require('../../package.json') as { version: string };
/* eslint-enable @typescript-eslint/no-var-requires */

const BRAND_COLOR = '#0EA5E9';

/** Sky-blue ASCII art banner matching the SPEC. */
const ASCII_ART = `
  ██╗      ███████╗███████╗ ██████╗
  ██║      ██╔════╝██╔════╝██╔═══██╗
  ██║      ███████╗█████╗  ██║   ██║
  ██║      ╚════██║██╔══╝  ██║   ██║
  ███████╗ ███████║███████╗╚██████╔╝
`;

function printBanner(): void {
  const sky = chalk.default.hex(BRAND_COLOR);

  process.stdout.write(sky(ASCII_ART) + '\n');
  process.stdout.write(sky(`  LONGCELOT-SEO TOOLKIT  v${pkg.version}\n`));
  process.stdout.write(sky("  The SEO engineer's best friend.\n"));
  process.stdout.write('\n');
  process.stdout.write('  Get started:\n');
  process.stdout.write('    lseo init    — scaffold lseo.config.js\n');
  process.stdout.write('    lseo scan    — scan your codebase for SEO issues\n');
  process.stdout.write('    lseo --help  — list all commands\n');
  process.stdout.write('\n');
}

printBanner();
