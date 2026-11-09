// Validates sitemap ↔ worker PUBLIC_ROUTES SEO intent (no live crawl required).
import { readFileSync } from 'node:fs'

const seo = readFileSync(new URL('../worker/seo.ts', import.meta.url), 'utf8')
const sitemap = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8')

const publicBlock = seo.match(/PUBLIC_ROUTES[^=]*=\s*\{([\s\S]*?)\n\}/)
if (!publicBlock) throw new Error('PUBLIC_ROUTES not found in worker/seo.ts')

const publicPaths = [...publicBlock[1].matchAll(/^\s+'([^']+)':/gm)].map((m) => m[1])
const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

const origin = 'https://macau430.com'
const expectedSitemap = [
  `${origin}/`,
  `${origin}/about`,
  ...publicPaths.filter((p) => p !== '/').map((p) => `${origin}${p}`),
].sort()

const actualSitemap = [...sitemapLocs].sort()

const missing = expectedSitemap.filter((u) => !actualSitemap.includes(u))
const extra = actualSitemap.filter((u) => !expectedSitemap.includes(u))

if (missing.length || extra.length) {
  console.error('Sitemap vs PUBLIC_ROUTES mismatch', { missing, extra })
  process.exit(1)
}

const mustNoindexPathPrefixes = [
  '/quiz/',
  '/result',
  '/wrong',
  '/review',
  '/challenge/result',
  '/challenge/430',
  '/challenge/260',
]

for (const prefix of mustNoindexPathPrefixes) {
  if (publicPaths.includes(prefix.replace(/\/$/, ''))) {
    console.error(`PUBLIC_ROUTES must not include private route: ${prefix}`)
    process.exit(1)
  }
}

console.log(`OK: sitemap lists ${actualSitemap.length} indexable URLs aligned with worker SEO`)
