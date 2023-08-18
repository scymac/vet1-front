// React
import React from 'react'
import { Provider as ReactAlert } from 'react-alert'
import ReactDOM from 'react-dom/client'

// Custom
import AlertTemplate from 'assets/theme/alert-style'
import MainLayout from './layouts/MainLayout'

// Style
import './index.css'
import 'assets/theme/modal-style.css'

// Web vitals
import reportWebVitals from './reportWebVitals'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
)
root.render(
  <React.StrictMode>
    <ReactAlert template = {AlertTemplate} timeout = {3000} position = "top right">
      <MainLayout />
    </ReactAlert>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
