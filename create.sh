#!/bin/bash

# MCC Finance Planner - Enhanced Setup Script
# Converts existing CRA project to advanced finance app with Electron support

APP_NAME="MCC-Finance-Planner"

echo "🚀 Enhancing $APP_NAME project with advanced finance features..."

# Backup existing files
echo "📁 Creating backup of existing files..."
mkdir -p backup
cp -r src backup/src-backup 2>/dev/null || true
cp package.json backup/package.json 2>/dev/null || true

# Install additional dependencies for finance app
echo "📦 Installing additional dependencies..."
npm install react-router-dom zustand bootstrap xlsx firebase gapi-script
npm install -D vite @vitejs/plugin-react electron electron-builder concurrently eslint prettier

# Create additional folders for finance app structure
echo "📂 Creating enhanced project structure..."
mkdir -p electron/db src/{components,pages,store,utils,services,hooks}

# --- Electron Files ---
echo "⚡ Setting up Electron files..."
cat > electron/main.js <<'EOF'
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, "../public/favicon.ico"),
    titleBarStyle: 'hiddenInset',
  });

  // Load from development server or production build
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../build/index.html"));
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
EOF

cat > electron/preload.js <<'EOF'
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // File operations
  saveFile: (data) => ipcRenderer.invoke('save-file', data),
  loadFile: () => ipcRenderer.invoke('load-file'),
  
  // Database operations (for future local DB)
  ping: () => "pong",
});
EOF

# --- Enhanced React App Structure ---
echo "🔧 Setting up enhanced React structure..."

# Update main App.js to include router and new components
cat > src/App.js <<'EOF'
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import Goals from "./pages/Goals";
import ImportExport from "./pages/ImportExport";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import { useAuthStore } from "./store/useAuthStore";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <div className="App">
        {user ? (
          <>
            <Navbar />
            <div className="container-fluid mt-3">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/import-export" element={<ImportExport />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </>
        ) : (
          <Login />
        )}
      </div>
    </Router>
  );
}

export default App;
EOF

# --- Navbar Component ---
cat > src/components/Navbar.jsx <<'EOF'
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          💰 MCC Finance Planner
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/")}`} to="/">
                📊 Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/transactions")}`} to="/transactions">
                💳 Transactions
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/budget")}`} to="/budget">
                📋 Budget
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/reports")}`} to="/reports">
                📈 Reports
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/goals")}`} to="/goals">
                🎯 Goals
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/import-export")}`} to="/import-export">
                📁 Import/Export
              </Link>
            </li>
          </ul>
          
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                👤 {user?.email || 'User'}
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/settings">⚙️ Settings</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={logout}>🚪 Logout</button></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
EOF

# --- Zustand Stores ---
echo "🗃️ Setting up state management..."

cat > src/store/useTransactionStore.js <<'EOF'
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTransactionStore = create(
  persist(
    (set, get) => ({
      transactions: [],
      categories: [
        "Food & Dining", "Transportation", "Shopping", "Entertainment",
        "Bills & Utilities", "Healthcare", "Travel", "Education",
        "Business", "Personal Care", "Gifts & Donations", "Investment"
      ],
      
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            ...state.transactions,
            { ...transaction, id: Date.now(), createdAt: new Date().toISOString() }
          ],
        })),
        
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          ),
        })),
        
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        })),
        
      getTransactionsByDateRange: (startDate, endDate) => {
        const transactions = get().transactions;
        return transactions.filter((tx) => {
          const txDate = new Date(tx.date);
          return txDate >= new Date(startDate) && txDate <= new Date(endDate);
        });
      },
      
      getTotalByCategory: () => {
        const transactions = get().transactions;
        return transactions.reduce((acc, tx) => {
          acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
          return acc;
        }, {});
      },
    }),
    {
      name: "mcc-transactions-storage",
    }
  )
);
EOF

cat > src/store/useAuthStore.js <<'EOF'
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "mcc-auth-storage",
    }
  )
);
EOF

cat > src/store/useBudgetStore.js <<'EOF'
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBudgetStore = create(
  persist(
    (set, get) => ({
      budgets: [],
      
      addBudget: (budget) =>
        set((state) => ({
          budgets: [
            ...state.budgets,
            { ...budget, id: Date.now(), createdAt: new Date().toISOString() }
          ],
        })),
        
      updateBudget: (id, updates) =>
        set((state) => ({
          budgets: state.budgets.map((budget) =>
            budget.id === id ? { ...budget, ...updates } : budget
          ),
        })),
        
      deleteBudget: (id) =>
        set((state) => ({
          budgets: state.budgets.filter((budget) => budget.id !== id),
        })),
    }),
    {
      name: "mcc-budget-storage",
    }
  )
);
EOF

# --- Services ---
echo "🔗 Setting up services..."

cat > src/services/firebase.js <<'EOF'
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🚨 Replace with your Firebase config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
EOF

cat > src/services/googleDrive.js <<'EOF'
import { gapi } from "gapi-script";

export const initGapi = async () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  
  return new Promise((resolve, reject) => {
    gapi.load("client:auth2", async () => {
      try {
        await gapi.client.init({
          apiKey,
          clientId,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
          scope: "https://www.googleapis.com/auth/drive.file",
        });
        resolve(gapi);
      } catch (err) {
        reject(err);
      }
    });
  });
};

export const uploadToGoogleDrive = async (fileName, fileContent) => {
  const file = new Blob([fileContent], { type: "application/json" });
  const metadata = {
    name: fileName,
    mimeType: "application/json",
  };
  
  const accessToken = gapi.auth2.getAuthInstance()
    .currentUser.get().getAuthResponse().access_token;
    
  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  form.append("file", file);

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
    {
      method: "POST",
      headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
      body: form,
    }
  );
  
  return response.json();
};
EOF

# --- Sample Pages ---
echo "📄 Creating page components..."

for PAGE in Dashboard Transactions Budget Reports Goals ImportExport Settings; do
cat > src/pages/${PAGE}.jsx <<EOF
import React from "react";

export default function ${PAGE}() {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h2 className="mb-0">${PAGE}</h2>
            </div>
            <div className="card-body">
              <p className="text-muted">
                ${PAGE} functionality will be implemented here.
              </p>
              <div className="alert alert-info">
                <strong>Coming Soon!</strong> This ${PAGE} feature is under development.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF
done

# Create Login page
cat > src/pages/Login.jsx <<'EOF'
import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { login, setLoading, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // For demo purposes, simulate login
      setTimeout(() => {
        login({ email, id: Date.now() });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Auth error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center" style={{ minHeight: "100vh", alignItems: "center" }}>
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h1 className="h3 mb-3">💰 MCC Finance</h1>
                <p className="text-muted">
                  {isLogin ? "Sign in to your account" : "Create a new account"}
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
                </button>
              </form>
              
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Need an account? Sign up" : "Have an account? Sign in"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

# --- Update package.json with new scripts ---
echo "📝 Updating package.json..."
cp package.json package.json.backup

# Create new package.json with enhanced scripts
cat > package.json <<'EOF'
{
  "name": "mcc-finance-planner",
  "version": "0.2.0",
  "homepage": "https://michael-mpj.github.io/MCC-Finance-Planner",
  "main": "public/electron.js",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^3.0.4",
    "react-router-dom": "^6.8.0",
    "zustand": "^4.3.2",
    "bootstrap": "^5.2.3",
    "xlsx": "^0.18.5",
    "firebase": "^9.17.1",
    "gapi-script": "^1.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build",
    "electron": "concurrently \"npm start\" \"wait-on http://localhost:3000 && electron .\"",
    "electron-dev": "ELECTRON_IS_DEV=true electron .",
    "build-electron": "npm run build && electron-builder",
    "dist": "npm run build && electron-builder --publish=never"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "gh-pages": "^6.3.0",
    "electron": "^22.0.0",
    "electron-builder": "^24.0.0",
    "concurrently": "^7.6.0",
    "wait-on": "^7.0.1",
    "eslint": "^8.34.0",
    "prettier": "^2.8.4"
  },
  "build": {
    "appId": "com.mcc.finance-planner",
    "productName": "MCC Finance Planner",
    "directories": {
      "output": "dist"
    },
    "files": [
      "build/**/*",
      "electron/**/*",
      "node_modules/**/*"
    ]
  }
}
EOF

# --- Configuration Files ---
echo "⚙️ Creating configuration files..."

cat > .eslintrc.json <<'EOF'
{
  "extends": ["react-app", "react-app/jest"],
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "warn"
  }
}
EOF

cat > .prettierrc <<'EOF'
{
  "singleQuote": false,
  "semi": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100
}
EOF

# Create environment example
cat > .env.example <<'EOF'
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your_app_id

# Google Drive API
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GOOGLE_API_KEY=your_google_api_key

# Vercel Analytics
REACT_APP_VERCEL_ANALYTICS_ID=your_vercel_analytics_id
EOF

echo "✅ MCC Finance Planner enhancement complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Run 'npm install' to install new dependencies"
echo "2. Copy .env.example to .env and add your API keys"
echo "3. Run 'npm start' for web development"
echo "4. Run 'npm run electron' for desktop app development"
echo "5. Run 'npm run build' to create production build"
echo "6. Run 'npm run deploy' to deploy to GitHub Pages"
echo ""
echo "📁 New structure includes:"
echo "   - Desktop app support (Electron)"
echo "   - Advanced state management (Zustand)"
echo "   - Firebase authentication"
echo "   - Google Drive integration"
echo "   - Bootstrap UI framework"
echo "   - Excel import/export capabilities"
echo ""
echo "💡 Check the backup/ folder for your original files"