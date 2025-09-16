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
