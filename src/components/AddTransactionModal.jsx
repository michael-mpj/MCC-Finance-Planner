import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTransactionStore } from "../store/useTransactionStore";

AddTransactionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

const AddTransactionModal = ({ show, onHide }) => {
  const { addTransaction, categories } = useTransactionStore();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    category: '',
    type: 'expense',
    amount: '',
    note: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const transaction = {
        ...formData,
        amount: parseFloat(formData.amount),
        category: formData.category.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        note: formData.description.trim()
      };
      
      addTransaction(transaction);
      
      setFormData({
        date: new Date().toISOString().split('T')[0],
        title: '',
        description: '',
        category: '',
        type: 'expense',
        amount: '',
        note: ''
      });
      setErrors({});
      
      onHide();
    } catch {
      setErrors({ submit: 'Failed to add transaction. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-plus-circle me-2"></i>
              Add New Transaction
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onHide}
              disabled={isSubmitting}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {errors.submit && (
                <div className="alert alert-danger">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {errors.submit}
                </div>
              )}
              
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    disabled={isSubmitting}
                  />
                  {errors.date && (
                    <div className="invalid-feedback">{errors.date}</div>
                  )}
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Type *</label>
                  <div className="btn-group w-100" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="type"
                      id="type-expense"
                      value="expense"
                      checked={formData.type === 'expense'}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      disabled={isSubmitting}
                    />
                    <label className="btn btn-outline-danger" htmlFor="type-expense">
                      <i className="fas fa-arrow-down me-2"></i>Expense
                    </label>
                    
                    <input
                      type="radio"
                      className="btn-check"
                      name="type"
                      id="type-income"
                      value="income"
                      checked={formData.type === 'income'}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      disabled={isSubmitting}
                    />
                    <label className="btn btn-outline-success" htmlFor="type-income">
                      <i className="fas fa-arrow-up me-2"></i>Income
                    </label>
                  </div>
                </div>
                
                <div className="col-12">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Weekly Groceries, Rent Payment"
                    disabled={isSubmitting}
                  />
                  {errors.title && (
                    <div className="invalid-feedback d-block">{errors.title}</div>
                  )}
                </div>
                
                <div className="col-12">
                  <label className="form-label">Description (Optional)</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Add more details about this transaction..."
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Category *</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                      list="categories"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      placeholder="Enter or select category"
                      disabled={isSubmitting}
                    />
                    <datalist id="categories">
                      {categories.map(category => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                    <span className="input-group-text">
                      <i className="fas fa-tag"></i>
                    </span>
                  </div>
                  {errors.category && (
                    <div className="invalid-feedback d-block">{errors.category}</div>
                  )}
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Amount *</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      placeholder="0.00"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.amount && (
                    <div className="invalid-feedback d-block">{errors.amount}</div>
                  )}
                </div>
              </div>
              
              {/* Quick Amount Buttons */}
              <div className="mt-4">
                <label className="form-label">Quick Amounts</label>
                <div className="d-flex gap-2 flex-wrap">
                  {[5, 10, 20, 50, 100, 500].map(amount => (
                    <button
                      key={amount}
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleInputChange('amount', amount.toString())}
                      disabled={isSubmitting}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onHide}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={`btn btn-${formData.type === 'income' ? 'success' : 'danger'}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className={`fas ${formData.type === 'income' ? 'fa-plus' : 'fa-minus'} me-2`}></i>
                    Add {formData.type === 'income' ? 'Income' : 'Expense'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;
