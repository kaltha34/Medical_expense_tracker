import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ExpenseList({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    status: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });

  const categories = [
    'Doctor Visit', 
    'Hospital', 
    'Pharmacy', 
    'Laboratory Tests', 
    'Dental', 
    'Vision', 
    'Mental Health',
    'Physical Therapy',
    'Medical Equipment',
    'Other'
  ];

  const statuses = [
    'All',
    'Not claimed',
    'Pending claim',
    'Reimbursed',
    'Denied'
  ];

  useEffect(() => {
    // In a real app, we would fetch data from an API
    // For MVP, we'll use localStorage
    const fetchExpenses = () => {
      try {
        const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        // Filter by user ID in a real app
        // const userExpenses = storedExpenses.filter(expense => expense.userId === user.id);
        setExpenses(storedExpenses);
        setFilteredExpenses(storedExpenses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [filters, expenses]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      category: '',
      status: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: ''
    });
  };

  const applyFilters = () => {
    let result = [...expenses];

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(expense => 
        expense.provider.toLowerCase().includes(searchLower) ||
        expense.description.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter(expense => expense.category === filters.category);
    }

    // Status filter
    if (filters.status && filters.status !== 'All') {
      result = result.filter(expense => expense.status === filters.status);
    }

    // Date range filter
    if (filters.startDate) {
      result = result.filter(expense => new Date(expense.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      result = result.filter(expense => new Date(expense.date) <= new Date(filters.endDate));
    }

    // Amount range filter
    if (filters.minAmount) {
      result = result.filter(expense => expense.amount >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      result = result.filter(expense => expense.amount <= parseFloat(filters.maxAmount));
    }

    setFilteredExpenses(result);
  };

  const getTotalAmount = () => {
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2);
  };

  const deleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const updatedExpenses = expenses.filter(expense => expense.id !== id);
        localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
        setExpenses(updatedExpenses);
        // Filter will be automatically applied due to the useEffect
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading expenses...</div>;
  }

  return (
    <div className="expense-list">
      <div className="list-header">
        <h2>Medical Expenses</h2>
        <Link to="/add-expense" className="btn-primary">Add New Expense</Link>
      </div>

      <div className="card filter-card">
        <h3>Filter Expenses</h3>
        <div className="filter-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="searchTerm" className="form-label">Search</label>
              <input
                type="text"
                id="searchTerm"
                name="searchTerm"
                className="form-control"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                placeholder="Search provider or description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                name="status"
                className="form-control"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate" className="form-label">From Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-control"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate" className="form-label">To Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="form-control"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="minAmount" className="form-label">Min Amount</label>
              <input
                type="number"
                id="minAmount"
                name="minAmount"
                className="form-control"
                value={filters.minAmount}
                onChange={handleFilterChange}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxAmount" className="form-label">Max Amount</label>
              <input
                type="number"
                id="maxAmount"
                name="maxAmount"
                className="form-control"
                value={filters.maxAmount}
                onChange={handleFilterChange}
                placeholder="1000"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={resetFilters} className="btn-secondary">Reset Filters</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="list-summary">
          <p><strong>Showing {filteredExpenses.length} expenses</strong></p>
          <p><strong>Total: LKR {getTotalAmount()}</strong></p>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="no-expenses">
            <p>No expenses found matching your filters.</p>
            <Link to="/add-expense" className="btn-primary">Add Your First Expense</Link>
          </div>
        ) : (
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Provider</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map(expense => (
                <tr key={expense.id}>
                  <td>{expense.date}</td>
                  <td>{expense.provider}</td>
                  <td>{expense.description}</td>
                  <td>{expense.category}</td>
                  <td>LKR {expense.amount.toFixed(2)}</td>
                  <td>
                    <span className={
                      expense.status === 'Reimbursed' ? 'status-success' :
                      expense.status === 'Pending claim' ? 'status-pending' :
                      expense.status === 'Denied' ? 'status-danger' :
                      'status-not-claimed'
                    }>
                      {expense.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <Link to={`/expenses/${expense.id}`} className="action-link">View</Link>
                    <button 
                      onClick={() => deleteExpense(expense.id)} 
                      className="action-link delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ExpenseList;
