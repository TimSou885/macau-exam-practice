const API_BASE = import.meta.env.VITE_API_BASE ?? ''

async function parseJson(response) {
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed (${response.status})`)
  }
  return response.json()
}

export async function fetchQuestionCount(examType, category = 'all') {
  const params = new URLSearchParams({ examType, category })
  const data = await parseJson(await fetch(`${API_BASE}/api/questions/count?${params}`))
  return data.count ?? 0
}

export async function fetchQuestions(examType, category = 'all', { reveal = false } = {}) {
  const params = new URLSearchParams({ examType, category })
  if (reveal) params.set('reveal', '1')
  const data = await parseJson(await fetch(`${API_BASE}/api/questions?${params}`))
  return data.questions ?? []
}

export async function fetchQuestionsByIds(ids, { reveal = false, examType = '430' } = {}) {
  if (!ids.length) return []
  const params = new URLSearchParams({
    ids: ids.join(','),
    examType,
  })
  if (reveal) params.set('reveal', '1')
  const data = await parseJson(await fetch(`${API_BASE}/api/questions/by-ids?${params}`))
  return data.questions ?? []
}

export async function verifyAnswer(questionId, selectedKey) {
  const data = await parseJson(
    await fetch(`${API_BASE}/api/questions/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, selectedKey }),
    })
  )
  return data
}
