import React from 'react'
import ReactDOM from 'react-dom/client'
import JoshWangProfile from './App.jsx'
import './index.css'

ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <JoshWangProfile />
  </React.StrictMode>
)
