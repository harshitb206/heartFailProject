import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  // Removed <StrictMode> here to prevent development-only re-render quirks
  <App />
);