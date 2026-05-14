import React from 'react'
import { renderToString } from 'react-dom/server'
import JoshWangProfile from './App.jsx'
import { LanguageProvider } from './context/LanguageContext'

export function render() {
  return renderToString(
    <React.StrictMode>
      <LanguageProvider>
        <JoshWangProfile />
      </LanguageProvider>
    </React.StrictMode>
  )
}
