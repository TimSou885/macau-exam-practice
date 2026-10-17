import { questions430 } from './questions-430.js'
import { questions260 } from './questions-260.js'
import { questions430LawOfficial } from './questions-430-law-official.js'
import { questions430Past } from './questions-430-past.js'
import { questions260Official } from './questions-260-official.js'
import { questions260Past } from './questions-260-past.js'
import { questionsBasicLawExtra430 } from './questions-basic-law-extra.js'
import { questionsConstitutionExtra430 } from './questions-constitution-extra.js'
import { questionsGovExtra430 } from './questions-gov-extra.js'
import { questionsDeptExtra430 } from './questions-dept-extra.js'
import { questionsProcExtra430 } from './questions-proc-extra.js'
import { questionsEstatutoExtra430 } from './questions-estatuto-extra.js'
import { questionsCareerExtra430 } from './questions-career-extra.js'
import { questionsContractExtra430 } from './questions-contract-extra.js'
import { questionsPerfExtra430 } from './questions-perf-extra.js'
import { questions430Math } from './questions-430-math.js'
import { questions430Chart } from './questions-430-chart.js'
import { questions430Logic } from './questions-430-logic.js'
import { questions430Reading } from './questions-430-reading.js'
import { questions260Math } from './questions-260-math.js'
import { questions260Chart } from './questions-260-chart.js'
import { questions260Logic } from './questions-260-logic.js'
import { questions260Reading } from './questions-260-reading.js'

const questionsLawShared = [
  ...questions430LawOfficial,
  ...questionsBasicLawExtra430,
  ...questionsConstitutionExtra430,
  ...questionsGovExtra430,
  ...questionsDeptExtra430,
  ...questionsProcExtra430,
  ...questionsEstatutoExtra430,
  ...questionsCareerExtra430,
  ...questionsContractExtra430,
  ...questionsPerfExtra430,
]

const lawSharedIds = new Set(questionsLawShared.map((q) => q.id))

const all430 = [
  ...questions430,
  ...questions430Past,
  ...questionsLawShared,
  ...questions430Math,
  ...questions430Chart,
  ...questions430Logic,
  ...questions430Reading,
]
const all260 = [
  ...questions260,
  ...questions260Official,
  ...questions260Past,
  ...questionsLawShared,
  ...questions260Math,
  ...questions260Chart,
  ...questions260Logic,
  ...questions260Reading,
]

/** All unique questions keyed by id (for seeding). */
export function getAllQuestionsForSeed() {
  const byId = new Map()
  for (const q of [...all430, ...all260]) {
    if (!byId.has(q.id)) {
      byId.set(q.id, q)
    }
  }
  return [...byId.values()].map((q) => ({
    ...q,
    examTypes: resolveExamTypes(q),
  }))
}

function resolveExamTypes(q) {
  const types = new Set([q.examType])
  if (lawSharedIds.has(q.id)) {
    types.add('430')
    types.add('260')
  }
  return [...types].sort()
}

export function getQuestionsByExam(examType) {
  if (examType === '430') return [...all430]
  if (examType === '260') return [...all260]
  return []
}

export function getQuestionsByExamAndCategory(examType, category) {
  const all = getQuestionsByExam(examType)
  if (!category || category === 'all') return all
  return all.filter((q) => q.category === category)
}
