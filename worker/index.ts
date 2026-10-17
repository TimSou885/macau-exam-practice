export interface Env {
  DB: D1Database
  ASSETS: Fetcher
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

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
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

    const assetResponse = await env.ASSETS.fetch(request)
    if (assetResponse.status === 404 && request.method === 'GET') {
      const indexUrl = new URL('/index.html', request.url)
      return env.ASSETS.fetch(new Request(indexUrl, request))
    }
    return assetResponse
  },
}
