// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Suppress Monaco Editor benign cancellation errors in Strict Mode
window.addEventListener('unhandledrejection', function (event) {
  if (event.reason && event.reason.type === 'cancelation' && event.reason.msg === 'operation is manually canceled') {
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
