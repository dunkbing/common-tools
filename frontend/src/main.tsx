import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Toaster } from './components/ui/toaster';
import IndentProvider from './contexts/IndentContext';
import './index.css';

const container = document.getElementById('root');

const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <IndentProvider>
      <App />
    </IndentProvider>
    <Toaster />
  </React.StrictMode>,
);
