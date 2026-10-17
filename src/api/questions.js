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

export async function fetchQuestions(examType, category = 'all') {
  const params = new URLSearchParams({ examType, category })
  const data = await parseJson(await fetch(`${API_BASE}/api/questions?${params}`))
  return data.questions ?? []
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

/** Load questions and fetch per-question answers via POST /api/questions/verify (for wrong-book review). */
export async function fetchQuestionsByIdsWithAnswers(ids, { examType = '430' } = {}) {
  const questions = await fetchQuestionsByIds(ids, { examType })
  if (!questions.length) return []
  const verified = await Promise.all(
    questions.map((q) => {
      const probeKey = q.options[0]?.key ?? 'A'
      return verifyAnswer(q.id, probeKey)
    })
  )
  return questions.map((q, i) => ({
    ...q,
    correctKey: verified[i].correctKey,
    explanation: verified[i].explanation,
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
