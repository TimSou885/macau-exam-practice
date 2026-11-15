const ACTIVE_KEY = 'macau-exam-active-session'
const RESULT_KEY = 'macau-exam-last-result'

function read(key) {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    if (value == null) sessionStorage.removeItem(key)
    else sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Private mode or a full quota should not block answering.
  }
}

export function loadSession(key) {
  const data = read(ACTIVE_KEY)
  if (!data || data.key !== key || !Array.isArray(data.questions) || data.questions.length === 0) {
    return null
  }
  return data
}

export function loadAnySession() {
  const data = read(ACTIVE_KEY)
  if (!data || !Array.isArray(data.questions) || data.questions.length === 0) return null
  if (data.index >= data.questions.length) return null
  return data
}

export function saveSession(key, patch) {
  write(ACTIVE_KEY, { ...patch, key, updatedAt: Date.now() })
}

export function clearSession() {
  write(ACTIVE_KEY, null)
}

export function saveLastResult(result) {
  write(RESULT_KEY, result)
}

export function loadLastResult() {
  const data = read(RESULT_KEY)
  if (!data || !data.total) return null
  return data
}
