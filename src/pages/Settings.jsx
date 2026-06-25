import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useTransactionStore } from "../store/useTransactionStore";
import { useBudgetStore } from "../store/useBudgetStore";
import { storage } from "../services/localStorage";
import { isFirebaseConfigured } from "../services/firebase";

export default function Settings() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isDemoMode = useAuthStore((state) => state.isDemoMode);
  const firebaseReady = useAuthStore((state) => state.firebaseReady);
  const logout = useAuthStore((state) => state.logout);
  const initializeFirebaseSync = useTransactionStore((state) => state.initializeFirebaseSync);

  const transactions = useTransactionStore((state) => state.transactions);
  const budgets = useBudgetStore((state) => state.budgets);
  const clearAllTransactions = useTransactionStore((state) => state.clearAllTransactions);

  const [settings, setSettings] = useState(() => storage.getSettings());
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const updateSetting = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    storage.setSettings(updated);
  };

  const handleClearData = () => {
    clearAllTransactions();
    useBudgetStore.getState().deleteBudget = () => {};
    budgets.forEach(b => useBudgetStore.getState().deleteBudget(b.id));
    storage.setSettings({});
    setSettings({});
    setShowConfirmClear(false);
    window.location.reload();
  };

  const handleExportAll = async () => {
    const allData = {
      transactions,
      budgets,
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mcc-finance-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="mb-1">
            <i className="fas fa-cog me-2 text-primary"></i>
            Settings
          </h2>
          <p className="text-muted">Manage your app preferences and data</p>
        </div>
      </div>

      {/* User Profile */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="fas fa-user me-2"></i>Profile
              </h6>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center">
                {user?.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="rounded-circle me-3"
                    style={{ width: 64, height: 64, objectFit: "cover" }}
                  />
                )}
                <div>
                  <h5 className="mb-1">{user?.name || "Local User"}</h5>
                  <p className="text-muted mb-1">{user?.email || "privacy@localhost"}</p>
                  <span className="badge bg-success">Authenticated</span>
                  {isDemoMode && <span className="badge bg-warning text-dark ms-1">Demo Mode</span>}
                  {!firebaseReady && <span className="badge bg-secondary ms-1">Local Only</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* App Preferences */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="fas fa-sliders-h me-2"></i>Preferences
              </h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Currency</label>
                <select
                  className="form-select"
                  value={settings.currency || "USD"}
                  onChange={(e) => updateSetting("currency", e.target.value)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Date Format</label>
                <select
                  className="form-select"
                  value={settings.dateFormat || "en-US"}
                  onChange={(e) => updateSetting("dateFormat", e.target.value)}
                >
                  <option value="en-US">MM/DD/YYYY</option>
                  <option value="en-GB">DD/MM/YYYY</option>
                  <option value="en-CA">YYYY-MM-DD</option>
                </select>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="demoModeSwitch"
                  checked={settings.demoMode || false}
                  onChange={(e) => updateSetting("demoMode", e.target.checked)}
                />
                <label className="form-check-label" htmlFor="demoModeSwitch">
                  Force Demo Mode
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="fas fa-cloud me-2"></i>Cloud Sync
              </h6>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <strong>Firebase Status</strong>
                  {isFirebaseConfigured() ? (
                    <div>
                      <span className="badge bg-success ms-2">Configured</span>
                      <small className="d-block text-muted">
                        {firebaseReady ? "Connected" : "Connecting..."}
                      </small>
                    </div>
                  ) : (
                    <div>
                      <span className="badge bg-secondary ms-2">Not Configured</span>
                      <small className="d-block text-muted">Add Firebase env vars to enable sync</small>
                    </div>
                  )}
                </div>
              </div>
              <hr />
              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    if (isAuthenticated && user) {
                      initializeFirebaseSync();
                    }
                  }}
                >
                  <i className="fas fa-sync me-2"></i>Sync Now
                </button>
                {isAuthenticated && (
                  <button className="btn btn-outline-danger" onClick={logout}>
                    <i className="fas fa-sign-out-alt me-2"></i>Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="fas fa-database me-2"></i>Data Management
              </h6>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="card h-100 border-0 bg-light">
                    <div className="card-body text-center">
                      <i className="fas fa-file-export fa-2x text-primary mb-2"></i>
                      <h6>Export All Data</h6>
                      <p className="small text-muted">Download all data as JSON backup</p>
                      <button className="btn btn-sm btn-outline-primary" onClick={handleExportAll}>
                        Download Backup
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card h-100 border-0 bg-light">
                    <div className="card-body text-center">
                      <i className="fas fa-trash-alt fa-2x text-danger mb-2"></i>
                      <h6>Clear All Data</h6>
                      <p className="small text-muted">Remove all transactions and budgets</p>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setShowConfirmClear(true)}
                      >
                        Clear Data
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card h-100 border-0 bg-light">
                    <div className="card-body text-center">
                      <i className="fas fa-info-circle fa-2x text-info mb-2"></i>
                      <h6>Storage Info</h6>
                      <p className="small text-muted">
                        Transactions: {transactions.length}<br />
                        Budgets: {budgets.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card h-100 border-0 bg-light">
                    <div className="card-body text-center">
                      <i className="fas fa-shield-alt fa-2x text-success mb-2"></i>
                      <h6>Security</h6>
                      <p className="small text-muted">
                        Data stored locally and securely.<br />
                        No data sent externally without sync.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmClear && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title">Confirm Delete</h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmClear(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete all transactions and budgets? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowConfirmClear(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger btn-sm" onClick={handleClearData}>
                  Delete All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
