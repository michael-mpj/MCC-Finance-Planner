import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useTransactionStore } from "./store/useTransactionStore";
import { getDemoTransactions } from "./utils/demoData";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import Goals from "./pages/Goals";
import ImportExport from "./pages/ImportExport";
import Settings from "./pages/Settings";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import "./App.css";

function App() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isDemoMode = useAuthStore((state) => state.isDemoMode);
  const firebaseReady = useAuthStore((state) => state.firebaseReady);
  const transactions = useTransactionStore((state) => state.transactions);
  const addTransactions = useTransactionStore((state) => state.addTransactions);
  const initializeFirebaseSync = useTransactionStore((state) => state.initializeFirebaseSync);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      initializeFirebaseSync();

      if (transactions.length === 0 && isDemoMode && !firebaseReady) {
        const demoTx = getDemoTransactions();
        addTransactions(demoTx);
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    user,
    initializeFirebaseSync,
    transactions.length,
    isDemoMode,
    firebaseReady,
    addTransactions,
  ]);

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={!user ? <LandingPage /> : <Navigate to="/dashboard" replace />}
          />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

          <Route
            path="/dashboard"
            element={
              user ? (
                <>
                  <Navbar />
                  <Dashboard />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/transactions"
            element={
              user ? (
                <>
                  <Navbar />
                  <Transactions />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/budget"
            element={
              user ? (
                <>
                  <Navbar />
                  <Budget />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/reports"
            element={
              user ? (
                <>
                  <Navbar />
                  <Reports />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/goals"
            element={
              user ? (
                <>
                  <Navbar />
                  <Goals />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/import-export"
            element={
              user ? (
                <>
                  <Navbar />
                  <ImportExport />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/settings"
            element={
              user ? (
                <>
                  <Navbar />
                  <Settings />
                </>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
