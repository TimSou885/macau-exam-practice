import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
})

test('home keeps the unofficial notice and a wrong-book destination', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: '澳門政府統考練習' })).toBeVisible()
  await expect(page.getByText('非官方練習站')).toBeVisible()
  await page.getByRole('navigation', { name: '主要選單' }).getByRole('link', { name: '錯題本' }).click()
  await expect(page).toHaveURL(/\/wrong$/)
  await expect(page.getByRole('heading', { level: 1, name: '錯題本' })).toBeVisible()
})

test('a law round names the category and keeps misses after refresh', async ({ page }) => {
  await page.goto('/practice/430?category=law')
  await expect(page.getByRole('button', { name: /法律/ })).toBeVisible()
  await page.getByRole('button', { name: '10 題' }).click()
  await page.getByRole('link', { name: /開始練習/ }).click()
  await expect(page).toHaveURL(/\/quiz\/430/)

  for (let step = 0; step < 10; step += 1) {
    await page.getByRole('radio').first().click()
    await page.getByRole('button', { name: '提交答案' }).click()
    await page.getByRole('button', { name: step === 9 ? '查看結果' : '下一題' }).click()
  }

  await expect(page).toHaveURL(/\/result$/)
  await expect(page.getByText('430 統考 · 法律')).toBeVisible()
  await expect(page.getByRole('heading', { name: '這一輪答錯的題' })).toBeVisible()
  await expect(page.getByText('law', { exact: true })).toHaveCount(0)
  await page.reload()
  await expect(page.getByRole('heading', { name: '這一輪答錯的題' })).toBeVisible()
})

test('exam mode hides the explanation until the result page', async ({ page }) => {
  await page.goto('/quiz/430?category=reading&count=5&mode=exam&timed=0')
  await expect(page.getByRole('heading', { level: 2, name: '閱讀題幹' })).toBeVisible()
  await page.getByRole('radio', { name: /乙/ }).click()
  await page.getByRole('button', { name: '提交答案' }).click()
  await expect(page).toHaveURL(/\/result$/)
  await expect(page.getByText('因為甲')).toBeVisible()
})

test('chart questions render a table', async ({ page }) => {
  await page.goto('/quiz/430?category=chart&count=5&mode=tutor&timed=0')
  await expect(page.getByRole('table', { name: '由題幹整理的圖表' })).toBeVisible()
  await expect(page.getByRole('cell', { name: '65' })).toHaveCount(0)
  await expect(page.getByRole('cell', { name: '12' })).toBeVisible()
  await expect(page.getByRole('cell', { name: '第一季' })).toBeVisible()
})

test('spaced review advances to the next question', async ({ page }) => {
  await page.addInitScript(() => {
    const past = Date.now() - 60_000
    localStorage.setItem(
      'macau-exam-review-schedule',
      JSON.stringify({
        q1: { nextReviewAt: past, stage: 0, addedAt: past, lastReviewedAt: past, category: 'law' },
        q2: { nextReviewAt: past, stage: 0, addedAt: past, lastReviewedAt: past, category: 'law' },
      }),
    )
  })
  await page.goto('/review/session')
  const first = await page.getByRole('heading', { level: 2 }).innerText()
  await page.getByRole('radio').first().click()
  await page.getByRole('button', { name: '提交答案' }).click()
  await page.getByRole('button', { name: '下一題' }).click()
  await expect(page.getByRole('heading', { level: 2 })).not.toHaveText(first)
  await expect(page.getByText('第 2 / 2 題')).toBeVisible()
})

test('challenge shows the fifth miss before the result page', async ({ page }) => {
  await page.goto('/challenge/430?count=20')
  for (let step = 0; step < 4; step += 1) {
    await page.getByRole('radio').nth(2).click()
    await page.getByRole('button', { name: '提交答案' }).click()
    await page.getByRole('button', { name: '下一題' }).click()
  }
  await page.getByRole('radio').nth(2).click()
  await page.getByRole('button', { name: '提交答案' }).click()
  await expect(page).toHaveURL(/\/challenge\/430/)
  await expect(page.getByText('答錯了')).toBeVisible()
  await page.getByRole('button', { name: '查看結果' }).click()
  await expect(page).toHaveURL(/\/challenge\/result$/)
  await expect(page.getByRole('heading', { name: '挑戰失敗' })).toBeVisible()
})

test('wrong-book review removes a correct answer and pages the list', async ({ page }) => {
  await page.addInitScript(() => {
    const entries = Array.from({ length: 12 }, (_, index) => ({
      id: `w${index + 1}`,
      category: 'law',
      examType: '430',
      addedAt: Date.now(),
    }))
    localStorage.setItem('macau-exam-wrong', JSON.stringify(entries))
  })
  await page.goto('/wrong')
  await expect(page.getByText('錯題樣本 1')).toBeVisible()
  await page.getByRole('button', { name: /下一頁|Next/ }).click()
  await expect(page.getByText('錯題樣本 9')).toBeVisible()

  await page.goto('/wrong/quiz')
  await page.getByRole('radio', { name: /丙/ }).click()
  await page.getByRole('button', { name: '提交答案' }).click()
  await expect(page.getByText('已移出錯題本')).toBeVisible()
})

test('appearance control switches color mode and Chinese font is requested', async ({ page }) => {
  await page.goto('/')
  const font = await page.getByRole('heading', { level: 1 }).evaluate((node) => getComputedStyle(node).fontFamily)
  expect(font).toContain('Noto Sans TC')
  await page.getByRole('button', { name: '外觀：跟隨系統' }).click()
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.colorMode)).toBe('light')
  await page.getByRole('button', { name: '外觀：淺色' }).click()
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.colorMode)).toBe('dark')
})

test('mobile navigation includes the wrong book', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('navigation', { name: '主要選單' }).getByRole('link', { name: '錯題本' }).click()
  await expect(page).toHaveURL(/\/wrong$/)
})

test('leaving a round can be resumed from home', async ({ page }) => {
  await page.goto('/quiz/430?category=math&count=5&mode=tutor&timed=0')
  await page.getByRole('radio').first().click()
  await page.getByRole('link', { name: '澳門統考練習' }).click()
  await page.getByText('繼續未完成的練習', { exact: true }).click()
  await expect(page.getByRole('heading', { level: 2, name: /數學題幹/ })).toBeVisible()
  await expect(page.getByRole('radio').first()).toBeChecked()
})
