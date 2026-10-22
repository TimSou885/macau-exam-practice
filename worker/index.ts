import { SITE_ORIGIN, classifyRoute, normalizePath, rewriteShell, type RouteKind } from './seo'

export interface Env {
  DB: D1Database
  /** Present when Workers Static Assets are deployed (`wrangler.toml` `[assets]`). */
  ASSETS?: Fetcher
}

interface QuestionRow {
  id: string
  category: string
  question: string
  options: string
  correct_key: string
  explanation: string | null
  exam_types: string
}

type PublicQuestion = {
  id: string
  examType: string
  category: string
  question: string
  options: { key: string; text: string }[]
  correctKey?: string
  explanation?: string | null
}

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data:",
  "connect-src 'self' https://cloudflareinsights.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

function applySecurityHeaders(headers: Headers): void {
  headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY)
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set(
    'Permissions-Policy',
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
  )
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
}

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers)
  applySecurityHeaders(headers)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function jsonResponse(data: unknown, status = 200): Response {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  applySecurityHeaders(headers)
  return new Response(JSON.stringify(data), { status, headers })
}

function assetsBindingMissingResponse(request: Request): Response {
  const url = new URL(request.url)
  console.error('ASSETS binding is not configured', {
    host: url.host,
    pathname: url.pathname,
    method: request.method,
  })
  const headers = new Headers({
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    'Retry-After': '120',
  })
  applySecurityHeaders(headers)
  return new Response('Static assets are temporarily unavailable. Retry later or use the production custom domain.', {
    status: 503,
    headers,
  })
}

function getAssetsFetcher(env: Env): Fetcher | null {
  const assets = env.ASSETS
  if (assets && typeof assets.fetch === 'function') {
    return assets
  }
  return null
}

function parseOptions(raw: string): { key: string; text: string }[] {
  return JSON.parse(raw) as { key: string; text: string }[]
}

function rowToPublic(row: QuestionRow, examType: string): PublicQuestion {
  return {
    id: row.id,
    examType,
    category: row.category,
    question: row.question,
    options: parseOptions(row.options),
  }
}

function examTypeClause(examType: string): string {
  return `EXISTS (SELECT 1 FROM json_each(exam_types) je WHERE je.value = ${sqlLiteral(examType)})`
}

function sqlLiteral(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}

async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)
  const path = url.pathname

  if (path === '/api/health') {
    return jsonResponse({ ok: true })
  }

  if (path === '/api/questions/count' && request.method === 'GET') {
    const examType = url.searchParams.get('examType')
    const category = url.searchParams.get('category')
    if (examType !== '430' && examType !== '260') {
      return jsonResponse({ error: 'Invalid examType' }, 400)
    }
    let sql = `SELECT COUNT(*) AS count FROM questions WHERE ${examTypeClause(examType)}`
    const binds: string[] = []
    if (category && category !== 'all') {
      sql += ' AND category = ?'
      binds.push(category)
    }
    const result = await env.DB.prepare(sql).bind(...binds).first<{ count: number }>()
    return jsonResponse({ count: result?.count ?? 0 })
  }

  if (path === '/api/questions' && request.method === 'GET') {
    const examType = url.searchParams.get('examType')
    const category = url.searchParams.get('category')
    if (examType !== '430' && examType !== '260') {
      return jsonResponse({ error: 'Invalid examType' }, 400)
    }
    let sql = `SELECT id, category, question, options, exam_types FROM questions WHERE ${examTypeClause(examType)}`
    const binds: string[] = []
    if (category && category !== 'all') {
      sql += ' AND category = ?'
      binds.push(category)
    }
    sql += ' ORDER BY id'
    const { results } = await env.DB.prepare(sql).bind(...binds).all<QuestionRow>()
    const questions = (results ?? []).map((row) => rowToPublic(row, examType))
    return jsonResponse({ questions })
  }

  if (path === '/api/questions/by-ids' && request.method === 'GET') {
    const idsParam = url.searchParams.get('ids') ?? ''
    const examType = url.searchParams.get('examType') ?? '430'
    const ids = idsParam.split(',').map((id) => id.trim()).filter(Boolean)
    if (ids.length === 0) {
      return jsonResponse({ questions: [] })
    }
    if (ids.length > 500) {
      return jsonResponse({ error: 'Too many ids' }, 400)
    }
    const placeholders = ids.map(() => '?').join(', ')
    const sql = `SELECT id, category, question, options, exam_types FROM questions WHERE id IN (${placeholders})`
    const { results } = await env.DB.prepare(sql).bind(...ids).all<QuestionRow>()
    const order = new Map(ids.map((id, i) => [id, i]))
    const questions = (results ?? [])
      .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
      .map((row) => rowToPublic(row, examType))
    return jsonResponse({ questions })
  }

  if (path === '/api/questions/verify' && request.method === 'POST') {
    let body: { questionId?: string; selectedKey?: string }
    try {
      body = await request.json()
    } catch {
      return jsonResponse({ error: 'Invalid JSON' }, 400)
    }
    const questionId = body.questionId
    const selectedKey = body.selectedKey
    if (!questionId || !selectedKey) {
      return jsonResponse({ error: 'questionId and selectedKey required' }, 400)
    }
    const row = await env.DB.prepare(
      'SELECT correct_key, explanation FROM questions WHERE id = ?'
    )
      .bind(questionId)
      .first<{ correct_key: string; explanation: string | null }>()
    if (!row) {
      return jsonResponse({ error: 'Question not found' }, 404)
    }
    const correct = selectedKey === row.correct_key
    return jsonResponse({
      correct,
      correctKey: row.correct_key,
      explanation: row.explanation,
    })
  }

  return jsonResponse({ error: 'Not found' }, 404)
}

async function serveStatic(request: Request, env: Env): Promise<Response> {
  const assets = getAssetsFetcher(env)
  if (!assets) {
    return assetsBindingMissingResponse(request)
  }

  const url = new URL(request.url)

  if (url.pathname === '/favicon.ico') {
    const iconUrl = new URL('/favicon.svg', request.url)
    const iconResponse = await assets.fetch(new Request(iconUrl, { method: 'GET' }))
    if (!iconResponse.ok) {
      return new Response('Not Found', { status: 404 })
    }
    const headers = new Headers(iconResponse.headers)
    headers.set('Content-Type', 'image/svg+xml')
    headers.set('Cache-Control', 'public, max-age=86400')
    return withSecurityHeaders(new Response(iconResponse.body, { status: 200, headers }))
  }

  // SPA routes (no file extension, not the static about page) get the index.html
  // shell with per-route canonical / title / robots and a real 404 for unknown paths.
  const lastSegment = url.pathname.split('/').pop() ?? ''
  const isAboutPath = /^\/about(\.html|\/)?$/.test(url.pathname)
  if (!lastSegment.includes('.') && !isAboutPath) {
    const path = normalizePath(url.pathname)
    const kind = classifyRoute(path)
    if (path !== url.pathname && kind !== null) {
      return redirectResponse(`${url.origin}${path}${url.search}`, 301)
    }
    return serveShell(assets, request, path, kind)
  }

  const assetResponse = await assets.fetch(request)
  const contentType = assetResponse.headers.get('Content-Type') ?? ''
  // Missing files (or the asset layer's own SPA fallback for them) are real 404s.
  if (assetResponse.status === 404 || (contentType.includes('text/html') && !isAboutPath)) {
    return serveShell(assets, request, normalizePath(url.pathname), null)
  }

  return withSecurityHeaders(assetResponse)
}

async function serveShell(
  assets: Fetcher,
  request: Request,
  path: string,
  kind: RouteKind | null,
): Promise<Response> {
  // Fetch "/" without conditional headers: the rewritten body differs per route,
  // so the shared index.html ETag must not be reused.
  const shell = await assets.fetch(new Request(new URL('/', request.url), { method: 'GET' }))
  if (!shell.ok) {
    return withSecurityHeaders(shell)
  }
  const rewritten = rewriteShell(shell, path, kind)
  const headers = new Headers(rewritten.headers)
  headers.delete('ETag')
  headers.delete('Content-Length')
  applySecurityHeaders(headers)
  return new Response(request.method === 'HEAD' ? null : rewritten.body, {
    status: kind === null ? 404 : 200,
    headers,
  })
}

function redirectResponse(location: string, status: 301 | 302 = 301): Response {
  const headers = new Headers({ Location: location, 'Cache-Control': 'public, max-age=3600' })
  applySecurityHeaders(headers)
  return new Response(null, { status, headers })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (url.hostname === 'www.macau430.com') {
      return redirectResponse(`${SITE_ORIGIN}${url.pathname}${url.search}`, 301)
    }
    if (url.pathname.startsWith('/api/')) {
      try {
        return await handleApi(request, env)
      } catch (err) {
        console.error(err)
        return jsonResponse({ error: 'Internal error' }, 500)
      }
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 })
    }

    try {
      return await serveStatic(request, env)
    } catch (err) {
      console.error(err)
      return new Response('Internal error', { status: 500 })
    }
  },
}
