import React from 'react'
import ReactDOM from 'react-dom/client'
import JoshWangProfile from './App.jsx'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import '@fontsource/noto-sans-tc/chinese-traditional-400.css'
import '@fontsource/noto-sans-tc/chinese-traditional-700.css'
import '@fontsource/noto-sans-tc/latin-400.css'
import '@fontsource/noto-sans-tc/latin-700.css'

const rootElement = document.getElementById('root')
const app = (
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <JoshWangProfile />
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
)

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app)
} else {
  ReactDOM.createRoot(rootElement).render(app)
}

// WebMCP: expose profile tools to AI agents via the browser
if (typeof navigator !== 'undefined' && 'modelContext' in navigator) {
  navigator.modelContext.provideContext({
    tools: [
      {
        name: 'get_profile',
        description: 'Get Josh Wang\'s profile summary: name, title, location, years of experience, and key specialisations',
        inputSchema: { type: 'object', properties: {} },
        execute: async () => ({
          name: 'Josh Wang',
          title: 'Software Developer',
          experience: '10+ years',
          location: 'Taipei, Taiwan',
          summary: '專注 React / Next.js 前端架構，兼具 Node.js 後端與 AI 開發流程整合經驗的全端工程師',
          highlights: ['Frontend Architecture', 'Backend & API', 'AI Workflow', 'CI/CD & Security'],
        }),
      },
      {
        name: 'get_contact',
        description: 'Get Josh Wang\'s contact information including email, resume, and portfolio links',
        inputSchema: { type: 'object', properties: {} },
        execute: async () => ({
          email: 'spjay1@gmail.com',
          github: 'https://github.com/iskWang',
          resumePdf_ZH: 'https://profile.joshwang.dev/JoshWang_ZH_Resume.pdf',
          resumePdf_EN: 'https://profile.joshwang.dev/JoshWang_EN_Resume.pdf',
        }),
      },
    ],
  })
}
