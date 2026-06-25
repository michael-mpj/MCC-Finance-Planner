import React, { useState, useMemo } from "react";
import { useTransactionStore } from "../store/useTransactionStore";

const ITEMS_PER_PAGE = 10;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const TransactionsTable = () => {
  const { transactions, deleteTransaction, updateTransaction } = useTransactionStore();
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [periodFilter, setPeriodFilter] = useState('current_month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const currentYear = new Date().getFullYear();

  const categories = useMemo(() => {
    const cats = [...new Set(transactions.map(tx => tx.category))];
    return cats.sort();
  }, [transactions]);

  const availableYears = useMemo(() => {
    const years = [...new Set(transactions.map(tx => new Date(tx.date).getFullYear()))];
    return years.filter(y => y <= currentYear).sort((a, b) => b - a);
  }, [transactions, currentYear]);

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    if (selectedMonth !== null) {
      filtered = filtered.filter(tx => {
        const d = new Date(tx.date);
        return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
      });
    } else if (periodFilter === 'current_month') {
      filtered = filtered.filter(tx => {
        const d = new Date(tx.date);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      });
    } else if (periodFilter === 'previous_month') {
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      filtered = filtered.filter(tx => {
        const d = new Date(tx.date);
        return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
      });
    } else if (periodFilter === 'year') {
      filtered = filtered.filter(tx => new Date(tx.date).getFullYear() === selectedYear);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(tx => tx.type === filterType);
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(tx => tx.category === filterCategory);
    }
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(tx => 
        (tx.title || '').toLowerCase().includes(search) ||
        (tx.description || '').toLowerCase().includes(search) ||
        tx.category?.toLowerCase().includes(search) ||
        tx.amount?.toString().includes(search) ||
        (tx.note || '').toLowerCase().includes(search)
      );
    }

    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'amount') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else if (sortField === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [transactions, sortField, sortDirection, filterType, filterCategory, searchTerm, periodFilter, selectedYear]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTransactions = filteredTransactions.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    
    const expenses = filteredTransactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    
    return { income, expenses, net: income - expenses };
  }, [filteredTransactions]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      date: transaction.date,
      title: transaction.title || '',
      description: transaction.description || transaction.note || '',
      category: transaction.category,
      type: transaction.type,
      amount: transaction.amount,
      note: transaction.note || ''
    });
  };

  const handleSaveEdit = () => {
    updateTransaction(editingId, editForm);
    setEditingId(null);
    setEditForm({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return 'fas fa-sort text-muted';
    return sortDirection === 'asc' ? 'fas fa-sort-up text-primary' : 'fas fa-sort-down text-primary';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePeriodChange = (value) => {
    setPeriodFilter(value);
    setSelectedMonth(null);
    setCurrentPage(1);
  };

  const handleYearChange = (value) => {
    setSelectedYear(Number(value));
    setCurrentPage(1);
  };

  const handleMonthClick = (monthIndex) => {
    setSelectedMonth(monthIndex);
    setCurrentPage(1);
  };

  const handlePrevYear = () => {
    setSelectedYear(y => y - 1);
    setCurrentPage(1);
  };

  const handleNextYear = () => {
    setSelectedYear(y => Math.min(y + 1, currentYear));
    setCurrentPage(1);
  };

  return (
    <div className="transactions-table">
      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-success">
            <div className="card-body text-center">
              <h5 className="card-title text-success">
                <i className="fas fa-arrow-up me-2"></i>Income
              </h5>
              <h4 className="text-success">{formatCurrency(summary.income)}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-danger">
            <div className="card-body text-center">
              <h5 className="card-title text-danger">
                <i className="fas fa-arrow-down me-2"></i>Expenses
              </h5>
              <h4 className="text-danger">{formatCurrency(summary.expenses)}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className={`card border-${summary.net >= 0 ? 'success' : 'danger'}`}>
            <div className="card-body text-center">
              <h5 className={`card-title text-${summary.net >= 0 ? 'success' : 'danger'}`}>
                <i className="fas fa-balance-scale me-2"></i>Net
              </h5>
              <h4 className={`text-${summary.net >= 0 ? 'success' : 'danger'}`}>
                {formatCurrency(summary.net)}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-info">
            <div className="card-body text-center">
              <h5 className="card-title text-info">
                <i className="fas fa-list me-2"></i>Count
              </h5>
              <h4 className="text-info">{filteredTransactions.length}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Period</label>
              <select
                className="form-select"
                value={periodFilter}
                onChange={(e) => handlePeriodChange(e.target.value)}
              >
                <option value="current_month">Current Month</option>
                <option value="previous_month">Previous Month</option>
                <option value="year">Year Wise</option>
                <option value="all">All Time</option>
              </select>
            </div>
            {periodFilter === 'year' && (
              <div className="col-md-3">
                <label className="form-label">Year</label>
                <select
                  className="form-select"
                  value={selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                >
                  {availableYears.length > 0 ? (
                    availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))
                  ) : (
                    <option value={currentYear}>{currentYear}</option>
                  )}
                </select>
              </div>
            )}
            <div className="col-md-3">
              <label className="form-label">Search</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={filterType}
                onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setFilterCategory('all');
                  setPeriodFilter('current_month');
                  setCurrentPage(1);
                }}
              >
                <i className="fas fa-times me-2"></i>Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="fas fa-table me-2"></i>
            Transactions ({filteredTransactions.length})
          </h5>
          <small className="text-muted">
            Page {safePage} of {totalPages}
          </small>
        </div>
        <div className="card-body p-0">
          {paginatedTransactions.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No transactions found</h5>
              <p className="text-muted">
                {transactions.length === 0 
                  ? "Start by adding your first transaction or importing data from Excel."
                  : "Try adjusting your filters to see more results."}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th 
                      className="sortable-header"
                      onClick={() => handleSort('id')}
                      style={{ cursor: 'pointer' }}
                    >
                      ID <i className={getSortIcon('id')}></i>
                    </th>
                    <th 
                      className="sortable-header"
                      onClick={() => handleSort('date')}
                      style={{ cursor: 'pointer' }}
                    >
                      Date <i className={getSortIcon('date')}></i>
                    </th>
                    <th 
                      className="sortable-header"
                      onClick={() => handleSort('title')}
                      style={{ cursor: 'pointer' }}
                    >
                      Title <i className={getSortIcon('title')}></i>
                    </th>
                    <th>Description</th>
                    <th 
                      className="sortable-header"
                      onClick={() => handleSort('category')}
                      style={{ cursor: 'pointer' }}
                    >
                      Category <i className={getSortIcon('category')}></i>
                    </th>
                    <th 
                      className="sortable-header"
                      onClick={() => handleSort('type')}
                      style={{ cursor: 'pointer' }}
                    >
                      Type <i className={getSortIcon('type')}></i>
                    </th>
                    <th 
                      className="sortable-header text-end"
                      onClick={() => handleSort('amount')}
                      style={{ cursor: 'pointer' }}
                    >
                      Amount <i className={getSortIcon('amount')}></i>
                    </th>
                    <th width="120">Actions</th>
                  </tr>
                </thead>
                 <tbody>
                  {paginatedTransactions.map(transaction => (
                    <tr key={transaction.id}>
                      {editingId === transaction.id ? (
                        <>
                          <td>
                            <span className="text-muted small">{transaction.id.slice(0, 8)}...</span>
                          </td>
                          <td>
                            <input
                              type="date"
                              className="form-control form-control-sm"
                              value={editForm.date}
                              onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editForm.title}
                              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editForm.description}
                              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editForm.category}
                              onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                            />
                          </td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={editForm.type}
                              onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                            >
                              <option value="income">Income</option>
                              <option value="expense">Expense</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              className="form-control form-control-sm text-end"
                              value={editForm.amount}
                              onChange={(e) => setEditForm({...editForm, amount: parseFloat(e.target.value)})}
                            />
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-success"
                                onClick={handleSaveEdit}
                                title="Save"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button
                                className="btn btn-secondary"
                                onClick={handleCancelEdit}
                                title="Cancel"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            <span className="text-muted small" title={transaction.id}>
                              {transaction.id.slice(0, 8)}...
                            </span>
                          </td>
                          <td>{formatDate(transaction.date)}</td>
                          <td className="fw-medium">{transaction.title}</td>
                          <td>
                            <span className="text-muted" title={transaction.description || transaction.note}>
                              {(transaction.description || transaction.note || '').length > 30
                                ? (transaction.description || transaction.note || '').substring(0, 30) + '...'
                                : (transaction.description || transaction.note || '')}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {transaction.category}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                              <i className={`fas ${transaction.type === 'income' ? 'fa-arrow-up' : 'fa-arrow-down'} me-1`}></i>
                              {transaction.type}
                            </span>
                          </td>
                          <td className={`text-end fw-bold ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
                            {formatCurrency(transaction.amount)}
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleEdit(transaction)}
                                title="Edit"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(transaction.id)}
                                title="Delete"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Month/Year Footer */}
        <div className="card-footer d-flex flex-wrap justify-content-between align-items-center gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={handlePrevYear}
          >
            <i className="fas fa-chevron-left me-1"></i> {selectedYear - 1}
          </button>

          <div className="d-flex flex-wrap gap-1 justify-content-center">
            {MONTH_NAMES.map((name, index) => {
              const isActive = selectedMonth === index;
              return (
                <button
                  key={name}
                  className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleMonthClick(index)}
                >
                  {name.slice(0, 3)}
                </button>
              );
            })}
            <button
              className={`btn btn-sm ${selectedMonth === null ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => { setSelectedMonth(null); setCurrentPage(1); }}
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
  );
};

export default TransactionsTable;
