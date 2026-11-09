#!/usr/bin/env node
/**
 * Local-only: after hydration, client must not add canonical or JSON-LD (none in React today).
 * Requires wrangler dev at BASE (default http://127.0.0.1:8787).
 */
import { chromium } from 'playwright'

const BASE = process.env.SEO_SMOKE_BASE ?? 'http://127.0.0.1:8787'
const routes = [
  { path: '/exam', expectCanonical: 'https://macau430.com/exam', expectNoindex: false },
  { path: '/practice/430', expectCanonical: 'https://macau430.com/practice/430', expectNoindex: false },
  { path: '/quiz/430', expectCanonical: null, expectNoindex: true },
]

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ serviceWorkers: 'block' })
const page = await context.newPage()
let failed = 0

for (const { path, expectCanonical, expectNoindex } of routes) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('#root *', { timeout: 15000 })

  const head = await page.evaluate(() => {
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null
    const ldJsonCount = document.querySelectorAll('script[type="application/ld+json"]').length
    const ldHasFaq = [...document.querySelectorAll('script[type="application/ld+json"]')].some((el) =>
      el.textContent?.includes('FAQPage'),
    )
    return { canonical, robots, ldJsonCount, ldHasFaq }
  })

  if (expectCanonical !== head.canonical) {
    console.error(`${path}: canonical want ${expectCanonical} got ${head.canonical}`)
    failed++
  }
  if (expectNoindex !== (head.robots?.includes('noindex') ?? false)) {
    console.error(`${path}: robots want noindex=${expectNoindex} got ${head.robots}`)
    failed++
  }
  if (head.ldJsonCount > 1) {
    console.error(`${path}: unexpected extra JSON-LD scripts (${head.ldJsonCount})`)
    failed++
  }
  if (path !== '/' && head.ldHasFaq) {
    console.error(`${path}: FAQPage still in hydrated DOM JSON-LD`)
    failed++
  }
  console.log(`OK hydrated ${path}`, head)
}

await browser.close()
if (failed) process.exit(1)
