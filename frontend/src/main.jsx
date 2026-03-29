import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global Error Catch for White Screen Debugging
window.onerror = function (message, source, lineno, colno, error) {
  const root = document.getElementById('root');
  if (root) {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '10px';
    errorDiv.style.left = '10px';
    errorDiv.style.right = '10px';
    errorDiv.style.padding = '20px';
    errorDiv.style.background = '#FEE2E2';
    errorDiv.style.border = '2px solid #EF4444';
    errorDiv.style.color = '#B91C1C';
    errorDiv.style.zIndex = '999999';
    errorDiv.style.borderRadius = '12px';
    errorDiv.style.fontFamily = 'monospace';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.whiteSpace = 'pre-wrap';
    errorDiv.innerHTML = `<strong>!! CRITICAL FRONTEND CRASH !!</strong><br/><br/>${message}<br/>at ${source}:${lineno}:${colno}`;
    document.body.appendChild(errorDiv);
  }
  return false;
};

createRoot(document.getElementById('root')).render(
  <App />
)
