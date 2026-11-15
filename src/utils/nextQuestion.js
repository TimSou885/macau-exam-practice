/** Next index in a quiz. Stays put on the last question. */
export function nextQuestionIndex(currentIndex, length) {
  if (length <= 1) return 0
  if (currentIndex >= length - 1) return currentIndex
  return currentIndex + 1
}
