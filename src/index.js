
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Suppress external browser extension errors (like MetaMask inpage.js)
window.addEventListener('error', (event) => {
  if (
    event?.filename?.includes('chrome-extension://') ||
    event?.message?.includes('MetaMask') ||
    event?.error?.message?.includes('MetaMask')
  ) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
}, true);

window.addEventListener('unhandledrejection', (event) => {
  const reason = event?.reason;
  const msg = (reason?.message || reason?.stack || String(reason) || '');
  if (
    msg.includes('MetaMask') ||
    msg.includes('chrome-extension://') ||
    msg.includes('nkbihfbeogaeaoehlefnkodbefgpgknn')
  ) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
}, true);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
