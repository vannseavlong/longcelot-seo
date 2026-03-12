import type { Command } from 'commander';
import { registerInitCommand } from './init.js';
import { registerScanCommand } from './scan.js';
import { registerUrlCommand } from './url.js';
import { registerOpenCommand } from './open.js';

/** Register all lseo subcommands on the root program. */
export function registerCommands(program: Command): void {
  registerInitCommand(program);
  registerScanCommand(program);
  registerUrlCommand(program);
  registerOpenCommand(program);
}
