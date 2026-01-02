/**
 * =====================================================
 * URBAN-MOVE WEB APP - ENTRY POINT
 * =====================================================
 * 
 * Main entry file that bootstraps the React application.
 * Initializes Firebase and sets up routing.
 * =====================================================
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import './index.css';

// Render the application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);

