import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      'bin/lseo': 'src/bin/lseo.ts',
    },
    format: ['esm'],
    dts: false,
    clean: true,
    sourcemap: true,
    target: 'node18',
    banner: {
      js: '#!/usr/bin/env node',
    },
    external: ['chalk', 'figlet', 'commander', 'cosmiconfig', 'zod', 'ora', 'cli-table3'],
  },
  {
    entry: {
      'scripts/postinstall': 'src/scripts/postinstall.ts',
    },
    format: ['cjs'],
    outExtension: (): { js: string } => ({ js: '.cjs' }),
    dts: false,
    sourcemap: false,
    target: 'node18',
    external: ['chalk', 'figlet'],
  },
]);
