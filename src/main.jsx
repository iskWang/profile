import React from 'react'
import ReactDOM from 'react-dom/client'
import JoshWangProfile from './App.jsx'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import '@fontsource/noto-sans-tc/400.css'
import '@fontsource/noto-sans-tc/700.css'

ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <JoshWangProfile />
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
)

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
          summary: '專注於 React / Next.js 架構設計、AI 開發流程整合與快速交付的軟體開發者',
          highlights: ['AI 驅動開發', '資安意識', '跨平台開發'],
        }),
      },
      {
        name: 'get_contact',
        description: 'Get Josh Wang\'s contact information including email, resume, and portfolio links',
        inputSchema: { type: 'object', properties: {} },
        execute: async () => ({
          email: 'spjay1@gmail.com',
          location: 'Taipei, Taiwan',
          resumePdf_ZH: 'https://joshwang.dev/JoshWang_ZH_Resume.pdf',
          resumePdf_EN: 'https://joshwang.dev/JoshWang_EN_Resume.pdf',
        }),
      },
    ],
  })
}
