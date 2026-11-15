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

export async function fetchQuestions(examType, category = 'all', { limit } = {}) {
  const params = new URLSearchParams({ examType, category })
  if (limit != null) params.set('limit', String(limit))
  const data = await parseJson(await fetch(`${API_BASE}/api/questions?${params}`))
  return data.questions ?? []
}

export async function revealAnswers(ids) {
  if (!ids.length) return []
  const data = await parseJson(
    await fetch(`${API_BASE}/api/questions/reveal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })
  )
  return data.answers ?? []
}

export async function fetchQuestionsByIds(ids, { examType = '430' } = {}) {
  if (!ids.length) return []
  const params = new URLSearchParams({
    ids: ids.join(','),
    examType,
  })
  const data = await parseJson(await fetch(`${API_BASE}/api/questions/by-ids?${params}`))
  return data.questions ?? []
}

/** Load a page of wrong-book questions together with answers (one reveal request). */
export async function fetchQuestionsByIdsWithAnswers(ids, { examType = '430' } = {}) {
  const questions = await fetchQuestionsByIds(ids, { examType })
  if (!questions.length) return []
  const revealed = await revealAnswers(questions.map((q) => q.id))
  const byId = new Map(revealed.map((row) => [row.id, row]))
  return questions.map((q) => ({
    ...q,
    correctKey: byId.get(q.id)?.correctKey,
    explanation: byId.get(q.id)?.explanation,
  }))
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
