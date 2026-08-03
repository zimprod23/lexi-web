// @ts-check
import { defineConfig } from 'astro/config';

// Static output, no adapter, no server runtime. Netlify serves the bundle as
// files -- there is nothing here worth running a server for, and a static host
// is what keeps the site up while the licence server (a different machine
// entirely) is off.
export default defineConfig({
  site: 'https://lexiarchive.com',
  output: 'static',
  trailingSlash: 'always',
  build: {
    // One stylesheet in <style> rather than a second request. The whole site's
    // CSS is a few KB; on a bad mobile connection a round trip costs more than
    // the bytes do.
    inlineStylesheets: 'always',
  },
  compressHTML: true,
  devToolbar: { enabled: false },
});
