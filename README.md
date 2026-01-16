# Josh Wang Profile

Personal landing page built with React + Vite + Tailwind CSS.

## 開發

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build
```

## 部署至 Cloudflare Pages

### 方法一：連接 GitHub Repo

1. Push 程式碼到 GitHub
2. 前往 [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages
3. Create a project → Connect to Git
4. 選擇 repo
5. Build settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
6. Deploy!

### 方法二：直接上傳

```bash
npm run build
npx wrangler pages deploy dist --project-name=josh-profile
```

## 自訂 Domain

1. Cloudflare Pages → 你的專案 → Custom domains
2. Add custom domain: `你的網域`
3. 如果 DNS 已在 Cloudflare，會自動設定
