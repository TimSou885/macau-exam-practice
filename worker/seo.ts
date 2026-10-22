/**
 * SEO metadata for the SPA shell (index.html) served by the Worker.
 *
 * ROUTE_PATTERNS must mirror the <Route path> list in src/App.jsx.
 * `node scripts/check-routes.mjs` fails if they drift apart.
 */

export const SITE_ORIGIN = 'https://macau430.com'
const BRAND = '澳門統考練習'

export type RouteKind = 'public' | 'private'

export interface PublicMeta {
  title: string
  description: string
  ogTitle: string
}

/** Every path declared in src/App.jsx (React Router v6 syntax). */
export const ROUTE_PATTERNS: readonly string[] = [
  '/',
  '/exam',
  '/practice/:examType',
  '/quiz/:examType',
  '/result',
  '/wrong',
  '/wrong/quiz',
  '/review',
  '/review/session',
  '/challenge',
  '/challenge/result',
  '/challenge/:examType',
]

const EXAM_TYPES = new Set(['430', '260'])

/** Indexable routes with their own canonical, title and description. */
export const PUBLIC_ROUTES: Record<string, PublicMeta> = {
  '/': {
    title: `${BRAND} | 430 / 260 綜合能力評估線上題庫 — macau430.com`,
    description:
      '澳門公職 430 統考、260 統考綜合能力評估免費線上練習：法律、數學、圖表分析、推理邏輯、閱讀理解。錯題本、挑戰模式、間隔複習，助你備考。（非官方網站）',
    ogTitle: `${BRAND} | 430 / 260 綜合能力評估`,
  },
  '/exam': {
    title: `選擇考試：430 / 260 統考練習 | ${BRAND} — macau430.com`,
    description:
      '選擇澳門公職 430 統考（學士學位程度）或 260 統考（技術員程度）綜合能力評估，按法律、數學、圖表分析、推理邏輯、閱讀理解分類練習。（非官方網站）',
    ogTitle: `選擇考試：430 / 260 統考練習 | ${BRAND}`,
  },
  '/practice/430': {
    title: `430 統考練習：學士學位程度綜合能力評估 | ${BRAND} — macau430.com`,
    description:
      '澳門公職 430 統考（學士學位程度綜合能力評估開考）免費線上練習，涵蓋法律、數學、圖表分析、推理邏輯、閱讀理解，並附答案解析。（非官方網站）',
    ogTitle: `430 統考練習：學士學位程度綜合能力評估 | ${BRAND}`,
  },
  '/practice/260': {
    title: `260 統考練習：技術員程度綜合能力評估 | ${BRAND} — macau430.com`,
    description:
      '澳門公職 260 統考（技術員程度綜合能力評估開考）免費線上練習，涵蓋法律、數學、圖表分析、推理邏輯、閱讀理解，並附答案解析。（非官方網站）',
    ogTitle: `260 統考練習：技術員程度綜合能力評估 | ${BRAND}`,
  },
  '/challenge': {
    title: `挑戰模式：430 / 260 統考隨機測驗 | ${BRAND} — macau430.com`,
    description:
      '澳門 430、260 統考挑戰模式：全類別隨機出題，答錯五題即告失敗，檢驗備考程度；答錯的題目會自動加入錯題本。（非官方網站）',
    ogTitle: `挑戰模式：430 / 260 統考隨機測驗 | ${BRAND}`,
  },
}

export const NOT_FOUND_TITLE = `找不到頁面 | ${BRAND} — macau430.com`

function matchPattern(pattern: string, path: string): boolean {
  const p = pattern.split('/')
  const s = path.split('/')
  if (p.length !== s.length) return false
  return p.every((seg, i) => {
    if (seg.startsWith(':')) {
      if (s[i] === '') return false
      // Every dynamic segment in App.jsx is :examType.
      return seg === ':examType' ? EXAM_TYPES.has(s[i]) : true
    }
    return seg === s[i]
  })
}

/** Strip a trailing slash (except for "/"). */
export function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.replace(/\/+$/, '') || '/'
  }
  return pathname
}

/** Classify a normalized path: indexable, private (noindex) or unknown (404). */
export function classifyRoute(path: string): RouteKind | null {
  if (PUBLIC_ROUTES[path]) return 'public'
  return ROUTE_PATTERNS.some((pattern) => matchPattern(pattern, path)) ? 'private' : null
}

class SetAttr {
  constructor(
    private attr: string,
    private value: string,
  ) {}
  element(el: Element) {
    el.setAttribute(this.attr, this.value)
  }
}

class Remove {
  element(el: Element) {
    el.remove()
  }
}

class SetText {
  constructor(private content: string) {}
  element(el: Element) {
    el.setInnerContent(this.content)
  }
}

/** Rewrite head tags of the SPA shell for the given route. */
export function rewriteShell(response: Response, path: string, kind: RouteKind | null): Response {
  let rw = new HTMLRewriter()

  if (kind === 'public') {
    const meta = PUBLIC_ROUTES[path]
    const url = path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`
    rw = rw
      .on('title', new SetText(meta.title))
      .on('link[rel="canonical"]', new SetAttr('href', url))
      .on('meta[name="description"]', new SetAttr('content', meta.description))
      .on('meta[property="og:url"]', new SetAttr('content', url))
      .on('meta[property="og:title"]', new SetAttr('content', meta.ogTitle))
      .on('meta[property="og:description"]', new SetAttr('content', meta.description))
      .on('meta[name="twitter:title"]', new SetAttr('content', meta.ogTitle))
      .on('meta[name="twitter:description"]', new SetAttr('content', meta.description))
  } else {
    // Personal/data pages and unknown paths: keep out of the index, no canonical.
    rw = rw
      .on('meta[name="robots"]', new SetAttr('content', 'noindex, follow'))
      .on('link[rel="canonical"]', new Remove())
      .on('meta[property="og:url"]', new Remove())
    if (kind === null) rw = rw.on('title', new SetText(NOT_FOUND_TITLE))
  }

  return rw.transform(response)
}
