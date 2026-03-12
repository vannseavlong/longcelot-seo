// lseo.config.js
// longcelot-seo configuration — https://github.com/vannseavlong/longcelot-seo
module.exports = {
  scan: {
    include: ['src/**/*.{js,jsx,ts,tsx,vue}'],
    exclude: ['node_modules', 'dist', '.next'],
    framework: 'auto', // 'nextjs' | 'nuxt' | 'vue' | 'react'
  },
  url: {
    timeout: 15000,
    followRedirects: true,
    delay: 300,         // ms between requests during crawl
    userAgent: 'longcelot-seo-bot/1.0',
  },
  output: {
    format: 'prompt',   // 'prompt' | 'json' | 'markdown' | 'table'
    outputFile: null,   // null = stdout, or path to write file
  },
  rules: {
    missingTitle: true,
    missingMetaDescription: true,
    missingH1: true,
    duplicateH1: true,
    missingAltText: true,
    hashRouting: true,
    jsOnlyLinks: true,
    missingCanonical: true,
    missingOgTags: true,
    missingStructuredData: true,
  },
};
