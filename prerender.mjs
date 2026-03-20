import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

// Read the client-built HTML template
const template = fs.readFileSync(toAbsolute('dist/client/index.html'), 'utf-8')

// Import and run the server-side render
const { render } = await import('./dist/server/entry-server.js')
const appHtml = render()

// Inline critical CSS to eliminate render-blocking stylesheet request
let html = template.replace(
  '<div id="root"></div>',
  `<div id="root">${appHtml}</div>`
)

// Find the CSS file built by Vite and inline it
// @font-face rules are extracted and loaded async to avoid blocking FCP
const assetsDir = toAbsolute('dist/client/assets')
const cssFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.css'))
for (const cssFile of cssFiles) {
  const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8')
  const linkTag = new RegExp(
    `<link[^>]+href="/assets/${cssFile.replace('.', '\\.')}"[^>]*/?>`
  )

  // Separate @font-face rules from the rest of CSS
  const fontFaceRules = []
  const mainCss = cssContent.replace(/@font-face\s*\{[^}]*\}/gs, (match) => {
    // Change font-display to optional: no late swap means LCP = FCP
    fontFaceRules.push(match.replace(/font-display:\s*swap/, 'font-display:optional'))
    return ''
  })

  // Inline only the non-font CSS (Tailwind + components) — zero round trips
  html = html.replace(linkTag, `<style>${mainCss}</style>`)

  // Write font CSS as a separate asset and load it async (media=print trick)
  // Same-domain serving via Cloudflare Pages, no preconnect needed
  if (fontFaceRules.length > 0) {
    const fontCssFile = 'fonts.css'
    fs.writeFileSync(path.join(assetsDir, fontCssFile), fontFaceRules.join('\n'))
    html = html.replace(
      '</head>',
      `<link rel="stylesheet" href="/assets/${fontCssFile}" media="print" onload="this.onload=null;this.media='all'">\n</head>`
    )
  }
}

// Move <script type="module"> from <head> to end of <body>
// so the browser paints prerendered content before discovering JS
const scriptMatch = html.match(/<script type="module"[^>]*src="[^"]*"[^>]*><\/script>/)
if (scriptMatch) {
  html = html.replace(scriptMatch[0], '')
  html = html.replace('</body>', `${scriptMatch[0]}\n</body>`)
}

// Copy client assets to dist/ and write final index.html
fs.cpSync(toAbsolute('dist/client'), toAbsolute('dist'), { recursive: true })
fs.writeFileSync(toAbsolute('dist/index.html'), html)

// Clean up intermediate build directories
fs.rmSync(toAbsolute('dist/client'), { recursive: true })
fs.rmSync(toAbsolute('dist/server'), { recursive: true })

console.log('Pre-rendering complete: dist/index.html')
