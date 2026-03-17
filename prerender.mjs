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

// Inject rendered HTML into the template
const html = template.replace(
  '<div id="root"></div>',
  `<div id="root">${appHtml}</div>`
)

// Copy client assets to dist/ and write final index.html
fs.cpSync(toAbsolute('dist/client'), toAbsolute('dist'), { recursive: true })
fs.writeFileSync(toAbsolute('dist/index.html'), html)

// Clean up intermediate build directories
fs.rmSync(toAbsolute('dist/client'), { recursive: true })
fs.rmSync(toAbsolute('dist/server'), { recursive: true })

console.log('Pre-rendering complete: dist/index.html')
