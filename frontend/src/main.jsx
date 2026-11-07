import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './i18n';
import App from './App';
import AppProviders from './providers/AppProviders';
import { AuthProvider } from './auth/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>
);
