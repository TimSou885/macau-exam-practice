import { questions430 } from './questions-430'
import { questions260 } from './questions-260'
import { questions430LawOfficial } from './questions-430-law-official'
import { questions430Past } from './questions-430-past'
import { questions260Official } from './questions-260-official'
import { questions260Past } from './questions-260-past'
import { questionsBasicLawExtra430 } from './questions-basic-law-extra'
import { questionsBasicLawExtra260 } from './questions-basic-law-extra'
import { questionsConstitutionExtra430 } from './questions-constitution-extra'
import { questionsConstitutionExtra260 } from './questions-constitution-extra'
import { questionsGovExtra430 } from './questions-gov-extra'
import { questionsGovExtra260 } from './questions-gov-extra'
import { questionsDeptExtra430 } from './questions-dept-extra'
import { questionsDeptExtra260 } from './questions-dept-extra'
import { questionsProcExtra430 } from './questions-proc-extra'
import { questionsProcExtra260 } from './questions-proc-extra'
import { questionsEstatutoExtra430 } from './questions-estatuto-extra'
import { questionsEstatutoExtra260 } from './questions-estatuto-extra'
import { questionsCareerExtra430 } from './questions-career-extra'
import { questionsCareerExtra260 } from './questions-career-extra'
import { questionsContractExtra430 } from './questions-contract-extra'
import { questionsContractExtra260 } from './questions-contract-extra'
import { questionsPerfExtra430 } from './questions-perf-extra'
import { questionsPerfExtra260 } from './questions-perf-extra'
import { questions430Math } from './questions-430-math'
import { questions430Chart } from './questions-430-chart'
import { questions430Logic } from './questions-430-logic'
import { questions430Reading } from './questions-430-reading'
import { questions260Math } from './questions-260-math'
import { questions260Chart } from './questions-260-chart'
import { questions260Logic } from './questions-260-logic'
import { questions260Reading } from './questions-260-reading'

// 法律題庫共用於 430 與 260（同一組題目、同一 id，兩考試皆出現）
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

const all430 = [...questions430, ...questions430Past, ...questionsLawShared, ...questions430Math, ...questions430Chart, ...questions430Logic, ...questions430Reading]
const all260 = [...questions260, ...questions260Official, ...questions260Past, ...questionsLawShared, ...questions260Math, ...questions260Chart, ...questions260Logic, ...questions260Reading]

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

export { questions430, questions260, questions430LawOfficial, questions430Past, questions260Official, questions260Past, questionsLawShared, questions430Math, questions430Chart, questions430Logic, questions430Reading, questions260Math, questions260Chart, questions260Logic, questions260Reading, questionsBasicLawExtra430, questionsBasicLawExtra260, questionsConstitutionExtra430, questionsConstitutionExtra260, questionsGovExtra430, questionsGovExtra260, questionsDeptExtra430, questionsDeptExtra260, questionsProcExtra430, questionsProcExtra260, questionsEstatutoExtra430, questionsEstatutoExtra260, questionsCareerExtra430, questionsCareerExtra260, questionsContractExtra430, questionsContractExtra260, questionsPerfExtra430, questionsPerfExtra260 }
export { EXAM_TYPES, STORAGE_KEYS, REVIEW_INTERVAL_DAYS } from './examMeta'
