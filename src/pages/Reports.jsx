import React, { useState, useMemo } from "react";
import { useTransactionStore } from "../store/useTransactionStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { exportFinancialReport, exportYearlyReport } from "../utils/excelUtils";

const COLORS = [
  "#667eea",
  "#764ba2",
  "#f093fb",
  "#f5576c",
  "#4facfe",
  "#43e97b",
  "#fa709a",
  "#fee140",
  "#30cfd0",
  "#a8edea",
  "#ff9a9e",
  "#f6d365",
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Reports() {
  const transactions = useTransactionStore((state) => state.transactions);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [reportType, setReportType] = useState("overview");

  const currentYear = new Date().getFullYear();

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    if (selectedMonth !== null) {
      filtered = filtered.filter((tx) => {
        const d = new Date(tx.date);
        return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
      });
    } else {
      filtered = filtered.filter((tx) => new Date(tx.date).getFullYear() === selectedYear);
    }
    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions, selectedYear, selectedMonth]);

  const categoryData = useMemo(() => {
    const map = {};
    filteredTransactions.forEach((tx) => {
      if (!map[tx.category]) map[tx.category] = 0;
      map[tx.category] += Number(tx.amount);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filteredTransactions]);

  const monthlyData = useMemo(() => {
    const months = {};
    filteredTransactions.forEach((tx) => {
      const d = new Date(tx.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!months[key]) months[key] = { income: 0, expenses: 0, date: key };
      if (tx.type === "income") months[key].income += Number(tx.amount);
      else months[key].expenses += Number(tx.amount);
    });
    return Object.values(months).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredTransactions]);

  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpenses = filteredTransactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const topExpenses = useMemo(() => {
    const map = {};
    filteredTransactions
      .filter((tx) => tx.type === "expense")
      .forEach((tx) => {
        if (!map[tx.category]) map[tx.category] = 0;
        map[tx.category] += Number(tx.amount);
      });
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [filteredTransactions]);

  const handleExportCurrent = async () => {
    await exportFinancialReport({
      transactions: filteredTransactions,
      budgets: [],
      summary: { totalIncome, totalExpenses, netAmount: totalIncome - totalExpenses },
    });
  };

  const handleExportYearly = async () => {
    await exportYearlyReport(transactions, selectedYear);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  };

  const handlePrevYear = () => setSelectedYear((y) => y - 1);
  const handleNextYear = () => setSelectedYear((y) => Math.min(y + 1, currentYear));
  const handleMonthClick = (index) => setSelectedMonth(index);
  const handleShowAll = () => setSelectedMonth(null);

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="mb-1">
            <i className="fas fa-chart-line me-2 text-primary"></i>
            Reports
          </h2>
          <p className="text-muted">Analyze your income and expenses over time</p>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-3">
          <label className="form-label">Report Type</label>
          <select
            className="form-select"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="overview">Overview</option>
            <option value="income">Income Analysis</option>
            <option value="expenses">Expense Analysis</option>
          </select>
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <div className="d-grid gap-2 w-100">
            <button
              className="btn btn-outline-success"
              onClick={handleExportCurrent}
              disabled={filteredTransactions.length === 0}
            >
              <i className="fas fa-file-excel me-2"></i>Export Current View
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={handleExportYearly}
              disabled={transactions.length === 0}
            >
              <i className="fas fa-calendar-alt me-2"></i>Export Yearly Excel
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card border-success">
            <div className="card-body text-center">
              <h5 className="card-title text-success">Income</h5>
              <h4>{formatCurrency(totalIncome)}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-danger">
            <div className="card-body text-center">
              <h5 className="card-title text-danger">Expenses</h5>
              <h4>{formatCurrency(totalExpenses)}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className={`card ${totalIncome - totalExpenses >= 0 ? "border-success" : "border-danger"}`}
          >
            <div className="card-body text-center">
              <h5
                className={`card-title ${totalIncome - totalExpenses >= 0 ? "text-success" : "text-danger"}`}
              >
                Net
              </h5>
              <h4 className={totalIncome - totalExpenses >= 0 ? "text-success" : "text-danger"}>
                {formatCurrency(totalIncome - totalExpenses)}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row mb-4">
        {reportType !== "income" && (
          <div className="col-md-6 mb-3">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="mb-0">Expenses by Category</h6>
              </div>
              <div className="card-body">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={90}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted text-center py-5">No expense data</p>
                )}
              </div>
            </div>
          </div>
        )}
        <div className={reportType === "overview" ? "col-md-6" : "col-md-12"}>
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">
                {reportType === "income" ? "Income Trend" : "Income vs Expenses Trend"}
              </h6>
            </div>
            <div className="card-body">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  {reportType === "income" ? (
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#28a745"
                        strokeWidth={2}
                        name="Income"
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="income" fill="#28a745" name="Income" />
                      <Bar dataKey="expenses" fill="#dc3545" name="Expenses" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <p className="text-muted text-center py-5">No trend data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Expenses Table */}
      {reportType !== "income" && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">Top 5 Expense Categories</h6>
              </div>
              <div className="card-body">
                {topExpenses.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Category</th>
                          <th className="text-end">Total Spent</th>
                          <th style={{ width: 200 }}>Bar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topExpenses.map((item, idx) => {
                          const maxVal = topExpenses[0]?.amount || 1;
                          return (
                            <tr key={item.name}>
                              <td>
                                <span className="badge bg-light text-dark me-2">#{idx + 1}</span>
                                {item.name}
                              </td>
                              <td className="text-end fw-bold text-danger">
                                {formatCurrency(item.amount)}
                              </td>
                              <td>
                                <div className="progress" style={{ height: "8px" }}>
                                  <div
                                    className="progress-bar bg-danger"
                                    role="progressbar"
                                    style={{ width: `${(item.amount / maxVal) * 100}%` }}
                                  ></div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted text-center py-3">
                    No expense data for the selected period
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Year + Month Footer */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-footer d-flex flex-wrap justify-content-between align-items-center gap-2">
              <button className="btn btn-outline-secondary" onClick={handlePrevYear}>
                <i className="fas fa-chevron-left me-1"></i> {selectedYear - 1}
              </button>

              <div className="d-flex flex-wrap gap-1 justify-content-center">
                {MONTH_NAMES.map((name, index) => {
                  const isActive = selectedMonth === index;
                  return (
                    <button
                      key={name}
                      className={`btn btn-sm ${isActive ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => handleMonthClick(index)}
                    >
                      {name.slice(0, 3)}
                    </button>
                  );
                })}
                <button
                  className={`btn btn-sm ${selectedMonth === null ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={handleShowAll}
                >
                  All
                </button>
              </div>

              <button
                className="btn btn-outline-secondary"
                onClick={handleNextYear}
                disabled={selectedYear >= currentYear}
              >
                {selectedYear + 1} <i className="fas fa-chevron-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
