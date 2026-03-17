import React from 'react'
import { renderToString } from 'react-dom/server'
import JoshWangProfile from './App.jsx'

export function render() {
  return renderToString(
    <React.StrictMode>
      <JoshWangProfile />
    </React.StrictMode>
  )
}
