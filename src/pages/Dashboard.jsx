import React, { useMemo } from "react";
import { useTransactionStore } from "../store/useTransactionStore";
import { useBudgetStore } from "../store/useBudgetStore";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, Legend, CartesianGrid
} from "recharts";

const COLORS = ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#43e97b", "#fa709a", "#fee140", "#30cfd0", "#a8edea", "#ff9a9e", "#f6d365"];

export default function Dashboard() {
  const transactions = useTransactionStore((state) => state.transactions);

  const summary = useMemo(() => {
    const income = transactions
      .filter(tx => tx.type === "income")
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    const expenses = transactions
      .filter(tx => tx.type === "expense")
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    return { income, expenses, net: income - expenses, count: transactions.length };
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [transactions]);

  const categoryData = useMemo(() => {
    const map = {};
    transactions.forEach(tx => {
      if (!map[tx.category]) map[tx.category] = 0;
      map[tx.category] += Number(tx.amount);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const months = {};
    transactions.forEach(tx => {
      const d = new Date(tx.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!months[key]) months[key] = { income: 0, expenses: 0 };
      if (tx.type === "income") months[key].income += Number(tx.amount);
      else months[key].expenses += Number(tx.amount);
    });
    return Object.entries(months)
      .map(([month, values]) => ({ month, ...values }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);
  }, [transactions]);

  const budgets = useBudgetStore((state) => state.budgets);
  const budgetWarnings = useMemo(() => {
    return budgets.filter(budget => {
      const spent = transactions
        .filter(tx => tx.type === "expense" && tx.category === budget.category)
        .reduce((sum, tx) => sum + Number(tx.amount), 0);
      return spent >= Number(budget.planned);
    });
  }, [budgets, transactions]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="mb-1">
            <i className="fas fa-tachometer-alt me-2 text-primary"></i>
            Dashboard
          </h2>
          <p className="text-muted">Your financial overview at a glance</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-success h-100">
            <div className="card-body text-center">
              <h5 className="card-title text-success">
                <i className="fas fa-arrow-up me-2"></i>Total Income
              </h5>
              <h3 className="text-success">{formatCurrency(summary.income)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-danger h-100">
            <div className="card-body text-center">
              <h5 className="card-title text-danger">
                <i className="fas fa-arrow-down me-2"></i>Total Expenses
              </h5>
              <h3 className="text-danger">{formatCurrency(summary.expenses)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className={`card ${summary.net >= 0 ? "border-success" : "border-danger"} h-100`}>
            <div className="card-body text-center">
              <h5 className={`card-title ${summary.net >= 0 ? "text-success" : "text-danger"}`}>
                <i className="fas fa-balance-scale me-2"></i>Net Balance
              </h5>
              <h3 className={summary.net >= 0 ? "text-success" : "text-danger"}>
                {formatCurrency(summary.net)}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-info h-100">
            <div className="card-body text-center">
              <h5 className="card-title text-info">
                <i className="fas fa-receipt me-2"></i>Transactions
              </h5>
              <h3 className="text-info">{summary.count}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      {budgetWarnings.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-warning">
              <h5 className="mb-2">
                <i className="fas fa-exclamation-triangle me-2"></i>Budget Alerts
              </h5>
              <ul className="mb-0">
                {budgetWarnings.map(b => (
                  <li key={b.id}>
                    <strong>{b.category}</strong>: You&apos;ve reached your budget of {formatCurrency(Number(b.planned))}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="fas fa-chart-pie me-2"></i>Spending by Category
              </h6>
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
                      fill="#8884d8"
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
                <p className="text-muted text-center py-5">No expense data available</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="fas fa-chart-bar me-2"></i>Last 6 Months Income vs Expenses
              </h6>
            </div>
            <div className="card-body">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="income" fill="#28a745" name="Income" />
                    <Bar dataKey="expenses" fill="#dc3545" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted text-center py-5">No monthly data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="mb-0">
                <i className="fas fa-history me-2"></i>Recent Transactions
              </h6>
              <small className="text-muted">Last 5 transactions</small>
            </div>
            <div className="card-body p-0">
              {recentTransactions.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th className="text-end">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map(tx => (
                        <tr key={tx.id}>
                          <td>
                            <small className="text-muted">
                              {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </small>
                          </td>
                          <td className="fw-medium">{tx.title || tx.note || tx.category}</td>
                          <td>
                            <span className="badge bg-light text-dark">{tx.category}</span>
                          </td>
                          <td>
                            <span className={`badge ${tx.type === "income" ? "bg-success" : "bg-danger"}`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className={`text-end fw-bold ${tx.type === "income" ? "text-success" : "text-danger"}`}>
                            {formatCurrency(Number(tx.amount))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted">No transactions yet. Add your first transaction!</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
