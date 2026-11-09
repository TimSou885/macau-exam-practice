import { describe, expect, it } from 'vitest'
import { SHELL_HTML } from './fixtures/spa-shell.generated'
import { PUBLIC_ROUTES, rewriteShell } from './seo'

const shellHtml = SHELL_HTML

async function rewrittenHtml(path: string, kind: 'public' | 'private' | null): Promise<string> {
  const input = new Response(shellHtml, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
  const output = rewriteShell(input, path, kind)
  return output.text()
}

function graphTypesInScript(html: string, dataSeo: string): Set<string> {
  const re = new RegExp(
    `<script type="application/ld\\+json" data-seo="${dataSeo}">([\\s\\S]*?)</script>`,
  )
  const match = html.match(re)
  if (!match) return new Set()
  const graph = JSON.parse(match[1]) as { '@graph'?: Array<{ '@type'?: string }> }
  return new Set(graph['@graph']?.map((n) => n['@type']))
}

describe('rewriteShell HTMLRewriter', () => {
  it('home: keeps site + homepage FAQ JSON-LD scripts', async () => {
    const html = await rewrittenHtml('/', 'public')
    expect(html).toContain('data-seo="homepage-faq"')
    expect(graphTypesInScript(html, 'site')).toEqual(new Set(['WebSite', 'WebApplication']))
    expect(graphTypesInScript(html, 'homepage-faq')).toEqual(new Set(['FAQPage']))
    expect(html).toContain(`<link rel="canonical" href="https://macau430.com/"`)
    expect(html).toContain(PUBLIC_ROUTES['/'].title)
  })

  it('public /exam: FAQ script removed; site JSON-LD kept; meta rewritten', async () => {
    const html = await rewrittenHtml('/exam', 'public')
    expect(html).not.toContain('data-seo="homepage-faq"')
    expect(graphTypesInScript(html, 'site')).toEqual(new Set(['WebSite', 'WebApplication']))
    expect(html).toContain(`<link rel="canonical" href="https://macau430.com/exam"`)
    expect(html).toContain(PUBLIC_ROUTES['/exam'].description)
    expect(html).toContain(`<meta property="og:url" content="https://macau430.com/exam"`)
    expect(html).toContain('max-image-preview:large')
  })

  it('public /practice/430: FAQ script removed', async () => {
    const html = await rewrittenHtml('/practice/430', 'public')
    expect(html).not.toContain('FAQPage')
    expect(graphTypesInScript(html, 'site')).toEqual(new Set(['WebSite', 'WebApplication']))
    expect(html).toContain(`<link rel="canonical" href="https://macau430.com/practice/430"`)
  })

  it('private /quiz/430: noindex, no canonical; FAQ script removed', async () => {
    const html = await rewrittenHtml('/quiz/430', 'private')
    expect(html).toContain('<meta name="robots" content="noindex, follow"')
    expect(html).not.toMatch(/<link rel="canonical"/)
    expect(html).not.toContain('data-seo="homepage-faq"')
    expect(graphTypesInScript(html, 'site')).toEqual(new Set(['WebSite', 'WebApplication']))
    expect(html).toContain('澳門統考練習 | 430 / 260 綜合能力評估線上題庫')
  })
})
