import React, { useState } from "react";
import { storage } from "../services/localStorage";

const GOALS_STORAGE_KEY = "finance-goals";

export function getGoals() {
  try {
    const data = localStorage.getItem(GOALS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveGoal(goal) {
  const goals = getGoals();
  const existing = goals.find(g => g.id === goal.id);
  if (existing) {
    Object.assign(existing, goal);
  } else {
    goals.push({ ...goal, id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` });
  }
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  return goals;
}

export function deleteGoal(id) {
  const goals = getGoals().filter(g => g.id !== id);
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  return goals;
}

export function updateGoalProgress(id, currentAmount) {
  const goals = getGoals();
  const goal = goals.find(g => g.id === id);
  if (goal) {
    goal.currentAmount = Number(currentAmount);
    goal.updatedAt = new Date().toISOString();
  }
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  return goals;
}

export default function Goals() {
  const [goals, setGoals] = useState(getGoals);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    category: "savings",
    priority: "medium",
  });

  const refreshGoals = () => setGoals(getGoals());

  const totalTarget = goals.reduce((sum, g) => sum + Number(g.targetAmount), 0);
  const totalCurrent = goals.reduce((sum, g) => sum + Number(g.currentAmount), 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

  const completedGoals = goals.filter(g => Number(g.currentAmount) >= Number(g.targetAmount)).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.targetAmount) return;

    const data = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      targetAmount: Number(formData.targetAmount),
      currentAmount: Number(formData.currentAmount) || 0,
      deadline: formData.deadline || "",
      category: formData.category,
      priority: formData.priority,
      createdAt: editingId ? goals.find(g => g.id === editingId)?.createdAt : new Date().toISOString(),
    };

    saveGoal(data);
    refreshGoals();

    setFormData({ title: "", description: "", targetAmount: "", currentAmount: "", deadline: "", category: "savings", priority: "medium" });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (goal) => {
    setFormData({
      title: goal.title,
      description: goal.description || "",
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: goal.deadline || "",
      category: goal.category,
      priority: goal.priority,
    });
    setEditingId(goal.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this goal?")) {
      deleteGoal(id);
      refreshGoals();
    }
  };

  const handleProgressUpdate = (id, amount) => {
    updateGoalProgress(id, amount);
    refreshGoals();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  };

  const priorityBadge = {
    high: "bg-danger",
    medium: "bg-warning text-dark",
    low: "bg-info",
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="mb-1">
            <i className="fas fa-bullseye me-2 text-primary"></i>
            Savings Goals
          </h2>
          <p className="text-muted">Set and track your financial goals</p>
        </div>
      </div>

      {/* Summary */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-primary">
            <div className="card-body text-center">
              <h5 className="card-title text-primary">Active Goals</h5>
              <h4>{goals.length}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-success">
            <div className="card-body text-center">
              <h5 className="card-title text-success">Completed</h5>
              <h4>{completedGoals}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-warning">
            <div className="card-body text-center">
              <h5 className="card-title text-warning">Total Target</h5>
              <h4>{formatCurrency(totalTarget)}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-info">
            <div className="card-body text-center">
              <h5 className="card-title text-info">Saved So Far</h5>
              <h4>{formatCurrency(totalCurrent)}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h6 className="mb-2">Overall Progress</h6>
              <div className="progress" style={{ height: "20px" }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${overallProgress}%` }}
                  aria-valuenow={overallProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <strong>{overallProgress}%</strong>
                </div>
              </div>
              <small className="text-muted mt-1 d-block">
                {formatCurrency(totalCurrent)} of {formatCurrency(totalTarget)} saved
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">
                  <i className={`fas ${editingId ? "fa-edit" : "fa-plus-circle"} me-2`}></i>
                  {editingId ? "Edit Goal" : "Create New Goal"}
                </h6>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Goal Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Emergency Fund, Vacation"
                        required
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label">Description</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Optional description"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Target Amount *</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="form-control"
                          value={formData.targetAmount}
                          onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Current Amount</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="form-control"
                          value={formData.currentAmount}
                          onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Deadline</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Priority</label>
                      <select
                        className="form-select"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                          <i className="fas fa-save me-1"></i> {editingId ? "Update" : "Save Goal"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            setShowForm(false);
                            setEditingId(null);
                            setFormData({ title: "", description: "", targetAmount: "", currentAmount: "", deadline: "", category: "savings", priority: "medium" });
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

      {/* Goals Grid */}
      {!showForm && (
        <div className="mb-3">
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <i className="fas fa-plus me-2"></i>Create New Goal
          </button>
        </div>
      )}

      {goals.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="fas fa-bullseye fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">No goals yet</h5>
            <p className="text-muted">Create a savings goal to start tracking your progress.</p>
            <button className="btn btn-primary mt-2" onClick={() => setShowForm(true)}>
              <i className="fas fa-plus me-2"></i>Create Your First Goal
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {goals.map(goal => {
            const percent = Number(goal.targetAmount) > 0
              ? Math.min(100, Math.round((Number(goal.currentAmount) / Number(goal.targetAmount)) * 100))
              : 0;
            const isCompleted = percent >= 100;
            return (
              <div key={goal.id} className="col-md-6 col-lg-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h5 className="card-title mb-0">{goal.title}</h5>
                        <span className={`badge ${priorityBadge[goal.priority] || "bg-secondary"} mt-1`}>
                          {goal.priority} priority
                        </span>
                      </div>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-primary" onClick={() => handleEdit(goal)}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(goal.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>

                    {goal.description && (
                      <p className="text-muted small mb-2">{goal.description}</p>
                    )}

                    <div className="mb-2">
                      <div className="d-flex justify-content-between small">
                        <span>Progress</span>
                        <span>{formatCurrency(Number(goal.currentAmount))} / {formatCurrency(Number(goal.targetAmount))}</span>
                      </div>
                      <div className="progress" style={{ height: "10px" }}>
                        <div
                          className={`progress-bar ${isCompleted ? "bg-success" : "bg-primary"}`}
                          role="progressbar"
                          style={{ width: `${percent}%` }}
                        >
                          <strong>{percent}%</strong>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {goal.deadline ? `Due: ${new Date(goal.deadline).toLocaleDateString()}` : "No deadline"}
                      </small>
                      {isCompleted ? (
                        <span className="badge bg-success">Completed!</span>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => {
                            const amt = prompt("Update progress amount:", Number(goal.currentAmount));
                            if (amt !== null && !isNaN(Number(amt))) {
                              handleProgressUpdate(goal.id, Number(amt));
                            }
                          }}
                        >
                          <i className="fas fa-sync-alt me-1"></i>Update Progress
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
