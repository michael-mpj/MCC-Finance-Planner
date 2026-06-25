import React, { useState } from "react";
import TransactionsTable from "../components/TransactionsTable";
import AddTransactionModal from "../components/AddTransactionModal";

export default function Transactions() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">
                <i className="fas fa-exchange-alt me-2 text-primary"></i>
                Transactions
              </h2>
              <p className="text-muted mb-0">
                Manage your income and expenses with real-time updates
              </p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                <i className="fas fa-plus me-2"></i>
                Add Transaction
              </button>
            </div>
          </div>

          {/* Real-time Connection Status */}
          <div className="alert alert-info mb-4">
            <div className="d-flex align-items-center">
              <i className="fas fa-info-circle me-2"></i>
              <div className="flex-grow-1">
                <strong>Real-time Updates Active</strong>
                <p className="mb-0 small">
                  This table automatically refreshes when transactions are added, imported, or
                  modified. Changes sync to localStorage and Firebase automatically.
                </p>
              </div>
              <div className="text-end">
                <div className="badge bg-success">
                  <i className="fas fa-circle me-1"></i>
                  Live
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table Component */}
          <TransactionsTable />

          {/* Add Transaction Modal */}
          <AddTransactionModal show={showAddModal} onHide={() => setShowAddModal(false)} />

          {/* Integration Info */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h6 className="mb-0">
                    <i className="fas fa-info-circle me-2"></i>
                    Integration Features
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <h6 className="text-primary">
                        <i className="fas fa-database me-2"></i>
                        Zustand State Management
                      </h6>
                      <ul className="list-unstyled small text-muted">
                        <li>• Global state across all components</li>
                        <li>• Automatic re-rendering on changes</li>
                        <li>• Optimistic updates</li>
                        <li>• Local storage persistence</li>
                      </ul>
                    </div>
                    <div className="col-md-4">
                      <h6 className="text-success">
                        <i className="fas fa-cloud me-2"></i>
                        Firebase Sync
                      </h6>
                      <ul className="list-unstyled small text-muted">
                        <li>• Real-time database sync</li>
                        <li>• Cross-device synchronization</li>
                        <li>• Offline-first architecture</li>
                        <li>• Automatic conflict resolution</li>
                      </ul>
                    </div>
                    <div className="col-md-4">
                      <h6 className="text-warning">
                        <i className="fas fa-file-excel me-2"></i>
                        Secure Excel Integration
                      </h6>
                      <ul className="list-unstyled small text-muted">
                        <li>• ExcelJS for safe import/export</li>
                        <li>• No prototype pollution</li>
                        <li>• Array-based data parsing</li>
                        <li>• Bootstrap UI integration</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
