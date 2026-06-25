import { useState } from "react";
import { useTransactionStore } from "../store/useTransactionStore";
import { useBudgetStore } from "../store/useBudgetStore";
import { exportTransactions, importTransactions, exportBudgets, exportFinancialReport, exportYearlyReport } from "../utils/excelUtils";
import { getDemoTransactions, exportDemoXlsx } from "../utils/demoData";

export default function ImportExport() {
  const { transactions, addTransactions } = useTransactionStore();
  const { budgets } = useBudgetStore();
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [exportResult, setExportResult] = useState(null);

  const loadDemoData = () => {
    const demoTx = getDemoTransactions();
    addTransactions(demoTx);
    setImportResult({
      success: true,
      message: `Loaded ${demoTx.length} demo transactions`,
    });
  };

  const handleExportDemoXlsx = async () => {
    setIsExporting(true);
    setExportResult(null);
    try {
      const result = await exportDemoXlsx();
      setExportResult(result);
    } catch (error) {
      setExportResult({ success: false, message: "Export demo failed: " + error.message });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportTransactions = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      const result = await importTransactions(file);
      setImportResult(result);

      if (result.success && result.data.length > 0) {
        // Use batch import function for better performance and real-time updates
        addTransactions(result.data);
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Import failed: ' + error.message,
        errors: [error.message]
      });
    } finally {
      setIsImporting(false);
      // Clear file input
      event.target.value = '';
    }
  };

  const handleExportTransactions = async () => {
    if (transactions.length === 0) {
      setExportResult({ success: false, message: 'No transactions to export' });
      return;
    }

    setIsExporting(true);
    setExportResult(null);

    try {
      const result = await exportTransactions(transactions);
      setExportResult(result);
    } catch (error) {
      setExportResult({ success: false, message: 'Export failed: ' + error.message });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportBudgets = async () => {
    if (budgets.length === 0) {
      setExportResult({ success: false, message: 'No budgets to export' });
      return;
    }

    setIsExporting(true);
    setExportResult(null);

    try {
      const result = await exportBudgets(budgets);
      setExportResult(result);
    } catch (error) {
      setExportResult({ success: false, message: 'Budget export failed: ' + error.message });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportFinancialReport = async () => {
    setIsExporting(true);
    setExportResult(null);

    try {
      const totalIncome = transactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + Number(tx.amount), 0);
      
      const totalExpenses = transactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + Number(tx.amount), 0);

      const reportData = {
        transactions,
        budgets,
        summary: {
          totalIncome,
          totalExpenses,
          netAmount: totalIncome - totalExpenses,
          transactionCount: transactions.length,
          budgetCount: budgets.length
        }
      };

      const result = await exportFinancialReport(reportData);
      setExportResult(result);
    } catch (error) {
      setExportResult({ success: false, message: 'Report export failed: ' + error.message });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportYearly = async () => {
    setIsExporting(true);
    setExportResult(null);
    try {
      const result = await exportYearlyReport(transactions);
      setExportResult(result);
    } catch (error) {
      setExportResult({ success: false, message: 'Yearly export failed: ' + error.message });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h2 className="mb-0">📁 Import & Export</h2>
              <p className="text-muted mb-0">Manage your financial data with secure Excel import/export</p>
            </div>
            <div className="card-body">
              {/* Status Messages */}
              {importResult && (
                <div className={`alert ${importResult.success ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
                  <h6 className="mb-2">
                    <i className={`fas ${importResult.success ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`}></i>
                    Import {importResult.success ? 'Successful' : 'Failed'}
                  </h6>
                  <p className="mb-2">{importResult.message}</p>
                  {importResult.errors && importResult.errors.length > 0 && (
                    <div>
                      <strong>Errors:</strong>
                      <ul className="mb-0 mt-1">
                        {importResult.errors.slice(0, 5).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                        {importResult.errors.length > 5 && (
                          <li>...and {importResult.errors.length - 5} more errors</li>
                        )}
                      </ul>
                    </div>
                  )}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setImportResult(null)}
                  ></button>
                </div>
              )}

              {exportResult && (
                <div className={`alert ${exportResult.success ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
                  <i className={`fas ${exportResult.success ? 'fa-download' : 'fa-exclamation-circle'} me-2`}></i>
                  {exportResult.message}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setExportResult(null)}
                  ></button>
                </div>
              )}

              <div className="row">
                {/* Import Section */}
                <div className="col-md-6 mb-4">
                  <div className="card h-100">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0">
                        <i className="fas fa-upload me-2"></i>
                        Import Data
                      </h5>
                    </div>
                    <div className="card-body">
                      <h6>Import Transactions from Excel</h6>
                      <p className="text-muted small">
                        Upload an Excel file (.xlsx) with columns: ID 	Date 	Title 	Description	Category 	Type 	Amount 	Actions
                      </p>
                      
                      <div className="mb-3">
                        <label htmlFor="importFile" className="form-label">Select Excel File</label>
                        <input
                          type="file"
                          className="form-control"
                          id="importFile"
                          accept=".xlsx,.xls"
                          onChange={handleImportTransactions}
                          disabled={isImporting}
                        />
                      </div>

                      {isImporting && (
                        <div className="text-center">
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                          Processing file...
                        </div>
                      )}

                      <div className="alert alert-info">
                        <strong>File Format:</strong>
                        <ul className="mb-0 mt-2">
                          <li>Excel file (.xlsx or .xls)</li>
                          <li>First row should be headers</li>
                          <li>Required columns: Date, Category, Type, Amount</li>
                           <li>Type must be &apos;income&apos; or &apos;expense&apos;</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export Section */}
                <div className="col-md-6 mb-4">
                  <div className="card h-100">
                    <div className="card-header bg-success text-white">
                      <h5 className="mb-0">
                        <i className="fas fa-download me-2"></i>
                        Export Data
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-outline-success"
                          onClick={handleExportTransactions}
                          disabled={isExporting || transactions.length === 0}
                        >
                          <i className="fas fa-file-excel me-2"></i>
                          Export Transactions ({transactions.length})
                        </button>

                        <button
                          className="btn btn-outline-success"
                          onClick={handleExportBudgets}
                          disabled={isExporting || budgets.length === 0}
                        >
                          <i className="fas fa-chart-pie me-2"></i>
                          Export Budgets ({budgets.length})
                        </button>

                        <button
                          className="btn btn-success"
                          onClick={handleExportFinancialReport}
                          disabled={isExporting || (transactions.length === 0 && budgets.length === 0)}
                        >
                          <i className="fas fa-chart-line me-2"></i>
                          Export Complete Report
                        </button>

                        <button
                          className="btn btn-outline-primary"
                          onClick={handleExportYearly}
                          disabled={isExporting || transactions.length === 0}
                        >
                          <i className="fas fa-calendar-alt me-2"></i>
                          Export Yearly Excel (12 Sheets)
                        </button>
                      </div>

                      {isExporting && (
                        <div className="text-center mt-3">
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                          Generating file...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Summary */}
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">
                        <i className="fas fa-info-circle me-2"></i>
                        Current Data Summary
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row text-center">
                        <div className="col-md-3">
                          <div className="border rounded p-3">
                            <h4 className="text-primary">{transactions.length}</h4>
                            <small className="text-muted">Transactions</small>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="border rounded p-3">
                            <h4 className="text-success">{budgets.length}</h4>
                            <small className="text-muted">Budgets</small>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="border rounded p-3">
                            <h4 className="text-info">
                              ${transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + Number(tx.amount), 0).toFixed(2)}
                            </h4>
                            <small className="text-muted">Total Income</small>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="border rounded p-3">
                            <h4 className="text-warning">
                              ${transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + Number(tx.amount), 0).toFixed(2)}
                            </h4>
                            <small className="text-muted">Total Expenses</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Data */}
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="mb-0">
                        <i className="fas fa-flask me-2"></i>
                        Demo Data
                      </h6>
                    </div>
                    <div className="card-body">
                      <p className="text-muted">
                        Quickly populate the app with sample transactions to explore features,
                        or download a ready-made Excel file for import.
                      </p>
                      <div className="d-flex gap-2 flex-wrap">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={loadDemoData}
                          disabled={isImporting}
                        >
                          <i className="fas fa-magic me-2"></i>
                          Load Demo Transactions
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={handleExportDemoXlsx}
                          disabled={isExporting}
                        >
                          <i className="fas fa-file-download me-2"></i>
                          Download Demo Excel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="alert alert-success mt-4">
                <h6 className="mb-2">
                  <i className="fas fa-shield-alt me-2"></i>
                  Secure Import/Export
                </h6>
                <ul className="mb-0">
                  <li>Uses ExcelJS library (secure alternative to xlsx)</li>
                  <li>No prototype pollution vulnerabilities</li>
                  <li>All data parsing uses safe array-based methods</li>
                  <li>Files are processed locally - no data sent to external servers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
