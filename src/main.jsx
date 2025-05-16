import React from 'react'
import ReactDOM from 'react-dom/client'
import './style.scss'
import './tailwind.css'
import App from './App'
import { Provider } from 'react-redux';
import store from './redux/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
