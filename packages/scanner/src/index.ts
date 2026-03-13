/**
 * Scanner package - AST and URL scanning for longcelot-seo.
 * @package
 */

// AST scanning
export { walkFiles, loadGitignorePatterns, type FileInfo } from './ast/walker.js';
export { detectFramework } from './ast/framework-detector.js';
export type { FrameworkType } from '@longcelot-seo/core';
export {
  parseJsx,
  extractViolations,
  type ParsedFile,
  type FileMetadata,
  type ImageInfo,
  type LinkInfo,
} from './ast/jsx-parser.js';
export {
  parseVue,
  extractViolationsFromVue,
  type ParsedVueFile,
  type VueFileMetadata,
  type VueImageInfo,
} from './ast/vue-parser.js';