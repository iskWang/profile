import React from 'react'
import { renderToString } from 'react-dom/server'
import JoshWangProfile from './App.jsx'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'

export function render() {
  return renderToString(
    <React.StrictMode>
      <ThemeProvider>
        <LanguageProvider>
          <JoshWangProfile />
        </LanguageProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
}
