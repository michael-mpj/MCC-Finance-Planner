import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const isActive = (path) => (location.pathname === path ? "active" : "");

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
              <button
                className="nav-link dropdown-toggle btn btn-link text-white border-0"
                type="button"
                data-bs-toggle="dropdown"
                style={{ textDecoration: "none" }}
              >
                👤 {user?.email || "User"}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/settings">
                    ⚙️ Settings
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item" onClick={logout}>
                    🚪 Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
