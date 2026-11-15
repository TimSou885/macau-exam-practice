const QUESTIONS = [
  q('q1', '430', 'law', '法律題幹一', ['甲', '乙', '丙', '丁'], 'B', '因為乙。'),
  q('q2', '430', 'law', '法律題幹二', ['子', '丑', '寅', '卯'], 'A', '因為子。'),
  q('q3', '430', 'math', '數學題幹：2+2', ['3', '4', '5', '6'], 'B', '2+2=4。'),
  q(
    'q4',
    '430',
    'chart',
    '下表為某部門第一至第四季度支出（萬元）：12、18、15、20。問全年總支出多少萬元？',
    ['60', '65', '62', '63'],
    'B',
    '全年總支出 = 65 萬元。',
  ),
  q('q5', '430', 'logic', '邏輯題幹', ['甲', '乙', '丙', '丁'], 'D', '因為丁。'),
  q('q6', '430', 'reading', '閱讀題幹', ['甲', '乙', '丙', '丁'], 'A', '因為甲。'),
  q('s1', '260', 'law', '260法律題', ['甲', '乙', '丙', '丁'], 'B', '260 的答案是乙。'),
  ...Array.from({ length: 12 }, (_, index) =>
    q(`w${index + 1}`, '430', 'law', `錯題樣本 ${index + 1}`, ['甲', '乙', '丙', '丁'], 'C', '樣本解析。'),
  ),
]

function q(id, examType, category, question, choices, correctKey, explanation) {
  return {
    id,
    examType,
    category,
    question,
    options: choices.map((text, index) => ({ key: String.fromCharCode(65 + index), text })),
    correctKey,
    explanation,
  }
}

function publicQuestion(item, examType) {
  return {
    id: item.id,
    examType,
    category: item.category,
    question: item.question,
    options: item.options,
  }
}

function filter(url) {
  const examType = url.searchParams.get('examType')
  const category = url.searchParams.get('category') || 'all'
  return QUESTIONS.filter(
    (item) => item.examType === examType && (category === 'all' || item.category === category),
  )
}

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString()
  return raw ? JSON.parse(raw) : {}
}

function send(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

export function mockApiPlugin() {
  return {
    name: 'mock-exam-api',
    configureServer(server) {
      if (process.env.VITE_MOCK_API !== '1') return
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '/', 'http://127.0.0.1')
        if (!url.pathname.startsWith('/api/')) {
          next()
          return
        }
        if (url.pathname === '/api/health') {
          send(res, 200, { ok: true })
          return
        }
        if (url.pathname === '/api/questions/count') {
          send(res, 200, { count: filter(url).length })
          return
        }
        if (url.pathname === '/api/questions' && req.method === 'GET') {
          const limit = Number(url.searchParams.get('limit'))
          let list = filter(url)
          if (Number.isInteger(limit) && limit > 0) list = list.slice(0, limit)
          const examType = url.searchParams.get('examType')
          send(res, 200, { questions: list.map((item) => publicQuestion(item, examType)) })
          return
        }
        if (url.pathname === '/api/questions/by-ids') {
          const ids = (url.searchParams.get('ids') || '').split(',').filter(Boolean)
          const examType = url.searchParams.get('examType') || '430'
          const questions = ids
            .map((id) => QUESTIONS.find((item) => item.id === id))
            .filter(Boolean)
            .map((item) => publicQuestion(item, examType))
          send(res, 200, { questions })
          return
        }
        if (req.method === 'POST' && (url.pathname === '/api/questions/verify' || url.pathname === '/api/questions/reveal')) {
          const body = await readBody(req)
          if (url.pathname === '/api/questions/reveal') {
            const ids = Array.isArray(body.ids) ? body.ids : []
            send(res, 200, {
              answers: ids
                .map((id) => QUESTIONS.find((item) => item.id === id))
                .filter(Boolean)
                .map((item) => ({
                  id: item.id,
                  correctKey: item.correctKey,
                  explanation: item.explanation,
                })),
            })
            return
          }
          const item = QUESTIONS.find((question) => question.id === body.questionId)
          if (!item) {
            send(res, 404, { error: 'Question not found' })
            return
          }
          send(res, 200, {
            correct: body.selectedKey === item.correctKey,
            correctKey: item.correctKey,
            explanation: item.explanation,
          })
          return
        }
        send(res, 404, { error: 'Not found' })
      })
    },
  }
}
