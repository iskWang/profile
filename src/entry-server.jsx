import React from 'react'
import { renderToString } from 'react-dom/server'
import JoshWangProfile from './App.jsx'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'

export function render(lang = 'zh') {
  return renderToString(
    <React.StrictMode>
      <ThemeProvider>
        <LanguageProvider initialLang={lang}>
          <JoshWangProfile />
        </LanguageProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
}
