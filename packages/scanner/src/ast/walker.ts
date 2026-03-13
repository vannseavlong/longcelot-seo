/**
 * File walker for scanning source files in a codebase.
 * Uses fast-glob with .gitignore awareness.
 */

import fg from 'fast-glob';
import fs from 'node:fs';
import path from 'node:path';

/** Information about a discovered file */
export interface FileInfo {
  /** Absolute path to the file */
  path: string;
  /** Relative path from scan root */
  relativePath: string;
  /** File extension */
  extension: string;
  /** File size in bytes */
  size: number;
  /** File contents */
  contents: string;
}

/** Default patterns to include */
const DEFAULT_INCLUDE = [
  'src/**/*.{js,jsx,ts,tsx,vue}',
  'app/**/*.{js,jsx,ts,tsx,vue}',
  'pages/**/*.{js,jsx,ts,tsx,vue}',
  'components/**/*.{js,jsx,ts,tsx,vue}',
];

/** Default patterns to exclude */
const DEFAULT_EXCLUDE = [
  'node_modules',
  'dist',
  '.next',
  '.nuxt',
  '.output',
  'coverage',
  '.git',
  '*.test.ts',
  '*.test.tsx',
  '*.spec.ts',
  '*.spec.tsx',
  '*.d.ts',
];

/**
 * Walks a directory and returns all matching source files.
 * @param rootDir - Root directory to scan
 * @param include - Glob patterns to include
 * @param exclude - Glob patterns to exclude
 */
export async function walkFiles(
  rootDir: string,
  include: string[] = DEFAULT_INCLUDE,
  exclude: string[] = DEFAULT_EXCLUDE
): Promise<FileInfo[]> {
  const files = await fg(include, {
    cwd: rootDir,
    ignore: exclude,
    absolute: true,
    onlyFiles: true,
  });

  const fileInfos: FileInfo[] = [];

  for (const filePath of files) {
    try {
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) continue;

      const contents = fs.readFileSync(filePath, 'utf-8');
      const relativePath = path.relative(rootDir, filePath);
      const extension = path.extname(filePath).slice(1);

      fileInfos.push({
        path: filePath,
        relativePath,
        extension,
        size: stats.size,
        contents,
      });
    } catch {
      // Skip files we can't read
      continue;
    }
  }

  return fileInfos;
}

/**
 * Checks if .gitignore exists and returns its patterns.
 */
export function loadGitignorePatterns(rootDir: string): string[] {
  const gitignorePath = path.join(rootDir, '.gitignore');

  if (!fs.existsSync(gitignorePath)) {
    return [];
  }

  try {
    const content = fs.readFileSync(gitignorePath, 'utf-8');
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));
  } catch {
    return [];
  }
}