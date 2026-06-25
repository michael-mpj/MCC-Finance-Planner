import React, { useState, useMemo } from "react";
import { useTransactionStore } from "../store/useTransactionStore";
import { useBudgetStore } from "../store/useBudgetStore";

export default function Budget() {
  const budgets = useBudgetStore((state) => state.budgets);
  const addBudget = useBudgetStore((state) => state.addBudget);
  const updateBudget = useBudgetStore((state) => state.updateBudget);
  const deleteBudget = useBudgetStore((state) => state.deleteBudget);

  const transactions = useTransactionStore((state) => state.transactions);
  const categories = useTransactionStore((state) => state.categories);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    planned: "",
    period: "monthly",
  });

  const budgetWithSpent = useMemo(() => {
    return budgets.map((budget) => {
      const spent = transactions
        .filter((tx) => tx.type === "expense" && tx.category === budget.category)
        .reduce((sum, tx) => sum + Number(tx.amount), 0);
      const remaining = Number(budget.planned) - spent;
      const percent =
        Number(budget.planned) > 0
          ? Math.min(100, Math.round((spent / Number(budget.planned)) * 100))
          : 0;
      return { ...budget, spent, remaining, percent };
    });
  }, [budgets, transactions]);

  const totalPlanned = budgetWithSpent.reduce((sum, b) => sum + Number(b.planned), 0);
  const totalSpent = budgetWithSpent.reduce((sum, b) => sum + b.spent, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.planned) return;

    const data = {
      category: formData.category.trim(),
      planned: Number(formData.planned),
      period: formData.period,
    };

    if (editingId) {
      updateBudget(editingId, data);
    } else {
      addBudget(data);
    }

    setFormData({ category: "", planned: "", period: "monthly" });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (budget) => {
    setFormData({
      category: budget.category,
      planned: budget.planned,
      period: budget.period,
    });
    setEditingId(budget.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this budget?")) {
      deleteBudget(id);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="mb-1">
            <i className="fas fa-chart-pie me-2 text-primary"></i>
            Budgets
          </h2>
          <p className="text-muted">Plan and track your spending limits by category</p>
        </div>
      </div>

      {/* Overall Summary */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card border-primary">
            <div className="card-body text-center">
              <h5 className="card-title text-primary">Total Planned</h5>
              <h4>{formatCurrency(totalPlanned)}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-warning">
            <div className="card-body text-center">
              <h5 className="card-title text-warning">Total Spent</h5>
              <h4>{formatCurrency(totalSpent)}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-info">
            <div className="card-body text-center">
              <h5 className="card-title text-info">Remaining</h5>
              <h4>{formatCurrency(totalPlanned - totalSpent)}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Budget Form */}
      {showForm && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">
                  <i className={`fas ${editingId ? "fa-edit" : "fa-plus-circle"} me-2`}></i>
                  {editingId ? "Edit Budget" : "Create New Budget"}
                </h6>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Category *</label>
                      <input
                        type="text"
                        className="form-control"
                        list="categories"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Select or enter category"
                        required
                      />
                      <datalist id="categories">
                        {categories.map((category) => (
                          <option key={category} value={category} />
                        ))}
                      </datalist>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Planned Amount *</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="form-control"
                          value={formData.planned}
                          onChange={(e) => setFormData({ ...formData, planned: e.target.value })}
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Period</label>
                      <select
                        className="form-select"
                        value={formData.period}
                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                      <div className="d-grid gap-2 w-100">
                        <button type="submit" className="btn btn-primary">
                          <i className="fas fa-save me-1"></i> {editingId ? "Update" : "Add"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            setShowForm(false);
                            setEditingId(null);
                            setFormData({ category: "", planned: "", period: "monthly" });
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budgets List */}
      <div className="row">
        <div className="col-12">
          {!showForm && (
            <div className="mb-3">
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                <i className="fas fa-plus me-2"></i>Create New Budget
              </button>
            </div>
          )}

          {budgetWithSpent.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="fas fa-piggy-bank fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">No budgets yet</h5>
                <p className="text-muted">Create budgets to track your spending by category.</p>
                <button className="btn btn-primary mt-2" onClick={() => setShowForm(true)}>
                  <i className="fas fa-plus me-2"></i>Create Your First Budget
                </button>
              </div>
            </div>
          ) : (
            <div className="row g-3">
              {budgetWithSpent.map((budget) => {
                const isOver = budget.remaining < 0;
                const progressColor = isOver
                  ? "bg-danger"
                  : budget.percent >= 80
                    ? "bg-warning"
                    : "bg-success";
                return (
                  <div key={budget.id} className="col-md-6 col-lg-4">
                    <div className="card h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h5 className="card-title mb-0">{budget.category}</h5>
                            <small className="text-capitalize">{budget.period}</small>
                          </div>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleEdit(budget)}
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(budget.id)}
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>

                        <div className="mb-2">
                          <div className="d-flex justify-content-between small">
                            <span>
                              Spent: <strong>{formatCurrency(budget.spent)}</strong>
                            </span>
                            <span>Planned: {formatCurrency(Number(budget.planned))}</span>
                          </div>
                          <div className="progress" style={{ height: "8px" }}>
                            <div
                              className={`progress-bar ${progressColor}`}
                              role="progressbar"
                              style={{ width: `${budget.percent}%` }}
                              aria-valuenow={budget.percent}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                          <div className="d-flex justify-content-between mt-1">
                            <small className={`fw-bold ${isOver ? "text-danger" : "text-success"}`}>
                              {isOver ? "Over by " : "Remaining: "}
                              {formatCurrency(Math.abs(budget.remaining))}
                            </small>
                            <small className="text-muted">{budget.percent}%</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
