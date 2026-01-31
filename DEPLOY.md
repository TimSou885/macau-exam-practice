# 部署說明

本專案為純前端（Vite + React），無後端。可部署至 **Vercel**（推薦）或 **Supabase Storage**。

---

## 方式一：Vercel（推薦）

Vercel 支援 SPA 路由、一鍵部署、免費額度充足。

1. **推送到 GitHub**（若尚未）
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <你的 repo URL>
   git push -u origin main
   ```

2. **在 Vercel 部署**
   - 前往 [vercel.com](https://vercel.com) 登入
   - 點「Add New」→「Project」→ 匯入你的 GitHub repo
   - 框架預設為 Vite，**Build Command** 用 `npm run build`，**Output Directory** 為 `dist`
   - 點「Deploy」即可

3. **SPA 路由**  
   專案已含 `vercel.json`，會將所有路徑導向 `index.html`，首頁、錯題本、挑戰模式等連結可正常重新整理。

4. **（選用）之後接 Supabase 後端**  
   在 Vercel 專案 → Settings → Environment Variables 新增 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY` 等，前端即可使用。

---

## 方式二：Supabase Storage

Supabase 不提供「靜態站台託管」服務，但可用 **Storage 公開 bucket** 放建置後的靜態檔。因 Storage 無法做「所有路徑回傳 index.html」的 rewrite，需使用 **Hash 路由**（網址會變成 `...#/wrong` 等）。

### 1. 建置（Hash 路由）

```bash
npm run build:supabase
```

會使用 `--mode supabase` 並讀取 `.env.supabase`，產出使用 Hash 路由的 `dist/`，僅依賴單一 `index.html`。

### 2. 在 Supabase 建立公開 bucket

1. 登入 [Supabase Dashboard](https://supabase.com/dashboard)，選專案（或新建）
2. 左側 **Storage** → **New bucket**
3. 名稱例如：`web`；勾選 **Public bucket** → 建立

### 3. 上傳建置結果

將 `dist/` 裡**所有檔案**上傳到該 bucket 的根目錄（不是上傳 `dist` 資料夾本身）。

- **方式 A：Dashboard**  
  Storage → 選 bucket `web` → **Upload file**，把 `dist` 內所有檔案（含 `index.html`、`assets/` 等）拖曳上傳。

- **方式 B：Supabase CLI**
  ```bash
  npx supabase login
  npx supabase link --project-ref <你的 project ref>
  npx supabase storage cp -r dist/* web/
  ```
  （若 CLI 不支援目錄上傳，可改用 Dashboard 或腳本）

### 4. 取得網站網址

- 公開 URL 格式：
  ```
  https://<project_ref>.supabase.co/storage/v1/object/public/web/index.html
  ```
- 將此網址存成書籤或分享給使用者。  
- 使用 Hash 路由時，子頁面為同一 `index.html`，例如：
  - 首頁：`.../web/index.html`
  - 錯題本：`.../web/index.html#/wrong`
  - 挑戰模式：`.../web/index.html#/challenge`

### 5. （選用）自訂網域

若 Supabase 專案有綁自訂網域，可再配合 CDN/反向代理設定，將根路徑指到 Storage 的 `index.html`；本說明以預設 Storage URL 為準。

---

## 建置指令對照

| 用途           | 指令                 | 路由模式   |
|----------------|----------------------|------------|
| 本地開發       | `npm run dev`        | BrowserRouter |
| Vercel 部署    | `npm run build`      | BrowserRouter |
| Supabase 部署  | `npm run build:supabase` | HashRouter   |

---

## 注意事項

- **Supabase Storage** 部署後網址較長，且為 Hash 路由（`#/path`），適合內部或測試使用；對外正式站建議用 **Vercel**。
- 若未來要接 Supabase 資料庫／Auth，前端可部署在 Vercel，在 Vercel 環境變數中設定 Supabase 的 URL 與 anon key 即可。
