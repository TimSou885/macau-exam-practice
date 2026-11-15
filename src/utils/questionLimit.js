/** A single practice or challenge round never pulls more than this many questions. */
export const SESSION_QUESTION_MAX = 100
export const SESSION_QUESTION_MIN = 5

/**
 * @param {string | null | undefined} raw
 * @returns {number | null} null when the caller did not ask for a sample
 */
export function clampSessionLimit(raw) {
  if (raw == null || String(raw).trim() === '') return null
  const n = Number(raw)
  if (!Number.isInteger(n) || n < 1) return null
  return Math.min(SESSION_QUESTION_MAX, n)
}

/**
 * @param {number} requested
 * @param {number} available
 */
export function resolveSessionCount(requested, available) {
  const capped = Math.min(SESSION_QUESTION_MAX, Math.max(SESSION_QUESTION_MIN, requested))
  if (!Number.isFinite(available) || available <= 0) return capped
  return Math.min(capped, available)
}
