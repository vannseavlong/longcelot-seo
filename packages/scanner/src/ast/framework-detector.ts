/**
 * Framework auto-detector for codebase scanning.
 * Detects Next.js, Nuxt, Vue, or React from package.json and file structure.
 */

import fs from 'node:fs';
import path from 'node:path';
import type { FrameworkType } from '@longcelot-seo/core';

/** Package.json structure for detection */
interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}

/**
 * Detects the framework type from a project directory.
 * @param rootDir - Root directory to check
 * @param explicitFramework - Optional explicit framework override
 */
export function detectFramework(
  rootDir: string,
  explicitFramework?: FrameworkType
): FrameworkType {
  // If explicitly specified, use that
  if (explicitFramework && explicitFramework !== 'auto') {
    return explicitFramework;
  }

  const packageJsonPath = path.join(rootDir, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    return 'unknown';
  }

  try {
    const content = fs.readFileSync(packageJsonPath, 'utf-8');
    const pkg: PackageJson = JSON.parse(content);

    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };
    const scripts = pkg.scripts || {};

    // Check for Next.js
    if (
      allDeps.next ||
      scripts.dev?.includes('next') ||
      scripts.build?.includes('next') ||
      fs.existsSync(path.join(rootDir, 'next.config.js')) ||
      fs.existsSync(path.join(rootDir, 'next.config.ts')) ||
      fs.existsSync(path.join(rootDir, 'app'))
    ) {
      return 'nextjs';
    }

    // Check for Nuxt
    if (
      allDeps.nuxt ||
      scripts.dev?.includes('nuxt') ||
      scripts.build?.includes('nuxt') ||
      fs.existsSync(path.join(rootDir, 'nuxt.config.js')) ||
      fs.existsSync(path.join(rootDir, 'nuxt.config.ts'))
    ) {
      return 'nuxt';
    }

    // Check for Vue with Vite
    if (
      allDeps.vue ||
      allDeps['@vitejs/plugin-vue'] ||
      scripts.dev?.includes('vite') ||
      fs.existsSync(path.join(rootDir, 'vite.config.ts')) ||
      fs.existsSync(path.join(rootDir, 'src/components'))
    ) {
      return 'vue';
    }

    // Check for plain React
    if (allDeps.react || allDeps['react-dom']) {
      return 'react';
    }

    return 'unknown';
  } catch {
    return 'unknown';
  }
}