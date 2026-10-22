// Verifies worker/seo.ts ROUTE_PATTERNS mirrors the <Route path> list in src/App.jsx.
import { readFileSync } from 'node:fs'

const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
const seo = readFileSync(new URL('../worker/seo.ts', import.meta.url), 'utf8')

const appPaths = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]).filter((p) => p !== '*')
const block = seo.match(/ROUTE_PATTERNS[^=]*=\s*\[([\s\S]*?)\]/)
if (!block) throw new Error('ROUTE_PATTERNS not found in worker/seo.ts')
const workerPaths = [...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1])

const missing = appPaths.filter((p) => !workerPaths.includes(p))
const extra = workerPaths.filter((p) => !appPaths.includes(p))
if (missing.length || extra.length) {
  console.error('Route list mismatch', { missingInWorker: missing, notInApp: extra })
  process.exit(1)
}
console.log(`OK: ${appPaths.length} routes in sync`)
