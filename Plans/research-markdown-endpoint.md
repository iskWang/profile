# 雙語履歷與 AI-friendly Markdown Endpoint 最佳實踐

## 結論

推薦把 `resume.zh.md` 與 `resume.en.md` 當作履歷內容的 canonical source，再由同一個解析／產生流程輸出：

- Web 的中英文內容
- 中文與英文 PDF
- AI-friendly 的 Markdown endpoint
- 可選的 `/llms.txt` 導覽檔

`public/` 在 Vite 中是靜態資產來源目錄，不是 build output；Vite build 會把它原樣複製到 `dist/`。因此 `public/index.md` 可以是部署用的 endpoint 輸出，但若要避免手動漂移，應由 canonical Markdown 在 build 時產生。

## 1. HTTP content negotiation

RFC 9110 定義 proactive content negotiation：客戶端用 `Accept` 表達偏好的媒體型別，伺服器選擇 representation；`Accept-Language` 可用來選擇語言。若回應會因 request header 而改變，`Vary` 必須列出影響選擇的 header。

因此若 `/` 依 `Accept: text/markdown` 回傳 Markdown，現有 Worker 的做法方向正確，但完整回應應維持：

```http
Content-Type: text/markdown; charset=utf-8
Vary: Accept
```

若再依 `Accept-Language` 選語言，則應為：

```http
Content-Type: text/markdown; charset=utf-8
Content-Language: zh-TW
Vary: Accept, Accept-Language
```

`ETag`、`Last-Modified` 與適當的 `Cache-Control` 可用於靜態或生成後的 Markdown；動態依 header 組合內容時，快取 key 必須反映 `Vary`。

來源：

- [RFC 9110 §8.3 Content-Type](https://www.rfc-editor.org/rfc/rfc9110.html#section-8.3)
- [RFC 9110 §8.5 Content-Language](https://www.rfc-editor.org/rfc/rfc9110.html#section-8.5)
- [RFC 9110 §12.5.1 Accept](https://www.rfc-editor.org/rfc/rfc9110.html#section-12.5.1)
- [RFC 9110 §12.5.4 Accept-Language](https://www.rfc-editor.org/rfc/rfc9110.html#section-12.5.4)
- [RFC 9110 §12.5.5 Vary](https://www.rfc-editor.org/rfc/rfc9110.html#section-12.5.5)

## 2. URL 語言與 endpoint 設計

推薦提供固定且可分享的語言 URL：

```text
/index.zh.md
/index.en.md
```

`Accept-Language` 可以作為 `/index.md` 的 fallback，但不應是唯一入口。固定 URL 的好處：

- 快取與 CDN 行為較簡單
- URL 可分享、可 bookmark
- 不依賴客戶端是否正確送出 `Accept-Language`
- 搜尋、爬蟲與 agent 容易明確選語言

若保留目前 `/` + `Accept: text/markdown` 行為，建議讓它回傳預設語言（例如 `zh-TW`），並在 Markdown 內連到另一語言版本；或讓它依 `Accept-Language` 選擇，但必須正確設定 `Vary: Accept, Accept-Language`。

## 3. Markdown for Agents 與 llms.txt

`llms.txt` 目前是公開提案，不是 IETF 正式標準。提案建議：

- root 或子路徑提供 `llms.txt`
- H1 為必要欄位
- 用簡短摘要與 H2 file lists 導向詳細 Markdown
- HTML 頁面可用 `.md` 版本
- 使用 `rel="alternate" type="text/markdown"` 或 HTTP `Link` header 宣告 Markdown 版本

本專案現在的 `public/.well-known/api-catalog` 與 Worker 的 `Accept: text/markdown` 路徑，已經是在做相同方向的 agent discoverability；但它們不等於 `llms.txt` 規格。

建議：

- `index.zh.md` / `index.en.md`：完整履歷內容
- `/llms.txt`：短小導覽，連到兩份完整履歷與 PDF
- 保留 `Link: rel="alternate"; type="text/markdown"` 宣告

來源：

- [The /llms.txt file proposal](https://llmstxt.org/)

## 4. Vite `public/` 與 Cloudflare 靜態資產

Vite 官方文件指出，`public/` 適合：

- 不由 source code import 的檔案
- 必須保留固定檔名的檔案
- 直接以 root URL 提供的靜態資產

這些檔案開發時由 `/` 提供，build 時原樣複製到 `dist/` root。故本專案的：

```text
public/index.md → dist/index.md → 部署後 /index.md
```

是正確的靜態資產資料流。`public/index.md` 不是 build output，而是 build input/static source；`dist/index.md` 才是 build copy。

Cloudflare Workers Static Assets 也建議讓匹配到的靜態檔直接由 assets 層服務，只有需要動態路由時才進入 Worker。這支持「build-time 產生固定 Markdown，部署成靜態檔」的方案，而不是每次 request 動態拼接。

來源：

- [Vite Static Asset Handling — The public Directory](https://vite.dev/guide/assets#the-public-directory)
- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)

## 5. Single source 與 Web/PDF 產生

建議的資料流：

```text
resume.zh.md ─┐
              ├─→ typed ResumeContent ─→ Web 中文
              ├─→ typed ResumeContent ─→ 中文 PDF
              └─→ index.zh.md

resume.en.md ─┐
              ├─→ typed ResumeContent ─→ Web 英文
              ├─→ typed ResumeContent ─→ 英文 PDF
              └─→ index.en.md
```

Markdown 應使用固定 headings、front matter 或其他可驗證結構。不要用散落的 regex 直接從任意自由格式 Markdown 推導所有欄位；內容格式固定後，可使用 parser/AST 或小型明確 parser，並在 build 時檢查必要欄位、語言與職稱。

介面專用文字可以留在 Web 程式碼中，例如導覽列、按鈕、動畫與 UI-only labels；職稱、日期、經歷、成就、專案、技能、學歷、聯絡資料應只存在 canonical Markdown。

## 推薦落地方案

1. 建立 `resume.zh.md` 與 `resume.en.md` 作為 canonical source。
2. 定義固定的履歷 Markdown 結構與必要欄位。
3. 寫一個共用 parser，輸出 typed `ResumeContent`。
4. Web 與 `resume-tool` 共用 parser/model，不再各自維護履歷常數。
5. build 時產生 `public/index.zh.md`、`public/index.en.md`。
6. 產生 `public/index.md` 作為預設語言或雙語入口；若雙語入口很長，改成短導覽並連到兩個語言檔。
7. 提供 `/llms.txt`，連到兩份 Markdown 與 PDF。
8. 驗證 Web、PDF、Markdown endpoint 的職稱、日期與主要事實完全一致。

## 取捨

### Build-time 靜態產生（推薦）

優點：固定 URL、CDN 快取簡單、部署穩定、可在 build 時驗證內容。缺點：改 Markdown 後要重新 build/deploy。

### Worker runtime 動態組合

優點：可依 `Accept`、`Accept-Language` 即時選 representation。缺點：需要處理 `Vary`、快取、ETag、錯誤與 asset fetch；對公開履歷沒有必要的動態性。

### 只在 `index.md` 放連結

優點：檔案很短。缺點：agent 不一定會追蹤連結，完整內容可發現性較差。推薦 `index.md` 做短導覽，並提供固定語言 Markdown URL；若目標是讓單次 fetch 取得完整履歷，則直接內嵌雙語內容。
