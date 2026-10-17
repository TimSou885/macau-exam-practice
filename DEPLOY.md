# 部署說明

本專案為 **Vite + React SPA**，題庫由 **Cloudflare Workers** 提供 API，並以 **Workers Static Assets** 託管前端。資料儲存在 **D1**。

---

## 方式一：Cloudflare Workers（推薦）

### 前置

1. [Cloudflare 帳號](https://dash.cloudflare.com/) 與 [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)（本 repo 已列為 devDependency）。
2. 登入：`npx wrangler login`

### 1. 建立 D1 資料庫

```bash
npx wrangler d1 create macau-exam-practice
```

將輸出中的 `database_id` 填入 `wrangler.toml` 的 `[[d1_databases]]` → `database_id`（取代 placeholder）。

### 2. 套用 schema 與題庫

```bash
npm install
npm run db:migrate:remote
npm run db:seed:remote
```

若你修改了 `question-banks/` 內的題目，先重新產生 SQL：

```bash
npm run seed:generate
npm run db:seed:remote
```

### 3. 建置並部署

```bash
npm run deploy
```

Workers 會同時提供：

- 靜態資源（`dist/`）
- SPA 路由（未匹配資產時回傳 `index.html`）
- `/api/*` 題庫 API

### 本地開發

```bash
npm install
npm run db:setup:local    # 首次：建立本機 D1 並匯入題庫
npm run dev:worker        # 建置 SPA + wrangler dev（預設 http://localhost:8787）
```

僅改前端時，可另開終端：

```bash
npm run dev               # Vite（5173），/api 會 proxy 到 8787
```

需先執行 `wrangler dev` 或 `npm run dev:worker`。

### API 摘要

| 路徑 | 說明 |
|------|------|
| `GET /api/questions/count?examType=430&category=all` | 題數 |
| `GET /api/questions?examType=430&category=law` | 練習用題目（不含正確答案） |
| `GET /api/questions/by-ids?ids=a,b&reveal=1` | 依 id 載入（錯題本瀏覽可帶 `reveal=1`） |
| `POST /api/questions/verify` | `{ questionId, selectedKey }` → 正確與解析 |

---

## 方式二：Vercel（legacy）

先前的一鍵靜態部署仍可用 `vercel.json`，但 **題庫已不在前端 bundle**，需改為指向已部署的 Workers API（設定 `VITE_API_BASE`）或改用 Cloudflare 為主要環境。

1. 在 Vercel 專案設定 **Build Command**：`npm run build`，**Output Directory**：`dist`
2. 環境變數：`VITE_API_BASE=https://<你的-workers-域名>`

---

## 方式三：Supabase Storage

純靜態託管，無 Workers API。僅適合測試 UI；題目需透過 `VITE_API_BASE` 連到已部署的 Workers。

```bash
npm run build:supabase
```

詳見下方 Hash 路由說明（與先前相同）。

### Supabase 上傳步驟（摘要）

1. Storage 建立公開 bucket（例如 `web`）
2. 上傳 `dist/` 內所有檔案
3. 網址形如：`https://<project_ref>.supabase.co/storage/v1/object/public/web/index.html`

---

## 建置指令對照

| 用途 | 指令 | 路由 / API |
|------|------|------------|
| 本地前端 | `npm run dev` | BrowserRouter + API proxy |
| 本地全棧 | `npm run dev:worker` | Workers + D1 本機 |
| Cloudflare 部署 | `npm run deploy` | Workers Static Assets + API |
| Supabase 靜態 | `npm run build:supabase` | HashRouter |

---

## 題庫來源與匯入

- 原始題目模組：`question-banks/`（由舊 `src/data/questions-*.js` 移出，**不**打包進前端）
- 產生 D1 SQL：`npm run seed:generate` → `scripts/seed.sql`
- Schema：`migrations/0001_schema.sql`
