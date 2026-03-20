import React from 'react'
import ReactDOM from 'react-dom/client'
import JoshWangProfile from './App.jsx'
import './index.css'
import '@fontsource/noto-sans-tc/chinese-traditional-400.css'
import '@fontsource/noto-sans-tc/chinese-traditional-700.css'
import '@fontsource/noto-sans-tc/latin-400.css'
import '@fontsource/noto-sans-tc/latin-700.css'

ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <JoshWangProfile />
  </React.StrictMode>
)
