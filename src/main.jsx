import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Bootstrap CSS - imported first for proper styling
import 'bootstrap/dist/css/bootstrap.min.css';

// Font Awesome CSS
import '@fortawesome/fontawesome-free/css/all.min.css';

// Initialize stores
import { useAuthStore } from './store/useAuthStore';

// Initialize stores when app loads
const initializeStores = () => {
  const authStore = useAuthStore.getState();
  authStore.initializeAuth();
};

initializeStores();

// Initialize root and render app
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);