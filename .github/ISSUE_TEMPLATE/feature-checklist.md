---
name: 📋 Feature Development Checklist
about: Track development progress for Income & Expense Tracker features
title: '[FEATURE] '
labels: ['enhancement', 'feature']
assignees: ''
---

## 📋 Feature Development Checklist

### Feature Category
- [ ] 🔹 Project Setup
- [ ] 🔹 Core App Structure  
- [ ] 🔹 Authentication
- [ ] 🔹 Transactions
- [ ] 🔹 Dashboard & Reports
- [ ] 🔹 Import / Export
- [ ] 🔹 Settings
- [ ] 🔹 Backup & Cloud
- [ ] 🔹 Testing & Quality
- [ ] 🔹 Build & Release

### Specific Tasks

#### Project Setup
- [ ] Run `chmod +x setup.sh && ./setup.sh`
- [ ] Verify dependencies installed (`electron`, `react`, `vite`, `zustand`, `bootstrap`, `firebase`, `exceljs`, etc.)
- [ ] Confirm ESLint + Prettier configs are working (`npm run lint` / `npm run format`)

#### Core App Structure
- [ ] Configure **Electron main process** (`electron/main.js`)
- [ ] Add `preload.js` to bridge Electron <-> React
- [ ] Create **Zustand store** for global state (transactions, auth, settings)
- [ ] Set up **React Router** with pages:
  - [ ] Login
  - [ ] Dashboard
  - [ ] Transactions
  - [ ] Reports
  - [ ] Import/Export
  - [ ] Settings

#### Authentication
- [ ] Enable **Firebase Auth** (Google + Email/Password)
- [ ] Store logged-in user's UID in Zustand store
- [ ] Protect routes (redirect to login if not authenticated)

#### Transactions
- [ ] Create **transaction model** (id, type, category, amount, date, note)
- [ ] Build **Add/Edit/Delete transaction form** (Bootstrap modal/form)
- [ ] Show transaction list (Bootstrap table)
- [ ] Connect to local storage (SQLite or Electron Store)
- [ ] Sync with Firestore (`users/{uid}/transactions/{id}`)

#### Dashboard & Reports
- [ ] Show **current balance** (income – expenses)
- [ ] Show **recent transactions** (last 5–10)
- [ ] Add **charts** with Recharts:
  - [ ] Pie chart (by category)
  - [ ] Line/bar chart (monthly trends)

#### Import / Export
- [ ] Implement **JSON export/import**
- [ ] Implement **Excel/CSV export/import** with `exceljs` (secure alternative to xlsx)
- [ ] Add **FileSaver.js** for downloads
- [ ] Add **upload UI** for imports

#### Settings
- [ ] Profile info (name, email, picture if using Google)
- [ ] Dark/Light theme toggle
- [ ] Local/Cloud backup options

#### Backup & Cloud
- [ ] Firestore security rules (user-only access)
- [ ] Google Drive API integration (backup JSON to Drive)
- [ ] Restore from Google Drive

#### Testing & Quality
- [ ] Unit tests with **Vitest**
- [ ] End-to-end tests with **Playwright** (Electron app flows)
- [ ] Run **ESLint** and **Prettier** consistently

#### Build & Release
- [ ] Test dev mode: `npm run dev`
- [ ] Package app: `npm run electron:build`
- [ ] Verify installers on Windows / macOS / Linux
- [ ] Upload build files to **landing page** (`downloads/` folder)

### Acceptance Criteria
- [ ] Feature is fully functional
- [ ] Tests are passing
- [ ] Code follows project style guidelines
- [ ] Documentation is updated
- [ ] Feature is tested on target platforms

### Additional Notes
<!-- Add any additional context, screenshots, or requirements here -->