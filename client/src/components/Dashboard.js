import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard({ user }) {
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState({
    totalExpenses: 0,
    pendingClaims: 0,
    reimbursed: 0,
    taxDeductible: 0,
    thisMonth: 0,
    lastMonth: 0
  });
  
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load real data from localStorage
    loadExpenseData();
  }, []);
  
  const loadExpenseData = () => {
    try {
      // Get expenses from localStorage
      const storedExpenses = localStorage.getItem('expenses');
      let expenses = [];
      
      if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
        // Filter by user ID if we have a logged-in user
        if (user?.id) {
          expenses = expenses.filter(expense => expense.userId === user.id);
        }
      }
      
      // Calculate summary data
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const pendingClaims = expenses
        .filter(expense => expense.insuranceClaim && expense.status !== 'Reimbursed')
        .reduce((sum, expense) => sum + expense.amount, 0);
      const reimbursed = expenses
        .filter(expense => expense.status === 'Reimbursed')
        .reduce((sum, expense) => sum + expense.amount, 0);
      const taxDeductible = expenses
        .filter(expense => expense.taxDeductible)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      // Calculate this month's expenses
      const thisMonthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      });
      
      const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      // Calculate last month's expenses
      const lastMonthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
      });
      
      const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      setSummaryData({
        totalExpenses,
        pendingClaims,
        reimbursed,
        taxDeductible,
        thisMonth: thisMonthTotal,
        lastMonth: lastMonthTotal
      });
      
      // Sort expenses by date (newest first) and get the 5 most recent
      const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentExpenses(sortedExpenses.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error loading expense data:', error);
      setLoading(false);
    }
  };

  const handleQuickAdd = () => {
    navigate('/add-expense');
  };
  
  const handleViewReports = () => {
    navigate('/reports');
  };
  
  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2><i className="fas fa-tachometer-alt"></i> Dashboard</h2>
        <div className="date-display">
          <i className="far fa-calendar-alt"></i> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          <button onClick={handleQuickAdd} className="btn-primary">
            <i className="fas fa-plus-circle"></i> Quick Add Expense
          </button>
        </div>
      </div>
      
      <div className="dashboard-summary">
        <div className="summary-card total-expenses">
          <div className="summary-card-icon">
            <i className="fas fa-wallet"></i>
          </div>
          <div className="card-content">
            <h3>Total Expenses</h3>
            <div className="amount">LKR {summaryData.totalExpenses.toFixed(2)}</div>
            <p>All time</p>
          </div>
        </div>
        
        <div className="summary-card this-month">
          <div className="summary-card-icon">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="card-content">
            <h3>This Month</h3>
            <div className="amount">LKR {summaryData.thisMonth.toFixed(2)}</div>
            <p>{new Date().toLocaleString('default', { month: 'long' })}</p>
          </div>
        </div>
        
        <div className="summary-card pending-claims">
          <div className="summary-card-icon">
            <i className="fas fa-hourglass-half"></i>
          </div>
          <div className="card-content">
            <h3>Pending Claims</h3>
            <div className="amount">LKR {summaryData.pendingClaims.toFixed(2)}</div>
            <p>Awaiting reimbursement</p>
          </div>
        </div>
        
        <div className="summary-card tax-deductible">
          <div className="summary-card-icon">
            <i className="fas fa-file-invoice-dollar"></i>
          </div>
          <div className="card-content">
            <h3>Tax Deductible</h3>
            <div className="amount">LKR {summaryData.taxDeductible.toFixed(2)}</div>
            <p>Potential tax savings</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-insights">
        <div className="insight-card">
          <h3><i className="fas fa-chart-line"></i> Monthly Comparison</h3>
          <div className="insight-content">
            <div className="comparison-data">
              <div className="comparison-item">
                <span className="label">This Month</span>
                <span className="value">LKR {summaryData.thisMonth.toFixed(2)}</span>
              </div>
              <div className="comparison-item">
                <span className="label">Last Month</span>
                <span className="value">LKR {summaryData.lastMonth.toFixed(2)}</span>
              </div>
              <div className="comparison-item">
                <span className="label">Difference</span>
                <span className="value difference ${summaryData.thisMonth > summaryData.lastMonth ? 'increase' : 'decrease'}">
                  {summaryData.thisMonth > summaryData.lastMonth ? '+' : ''}
                  LKR {(summaryData.thisMonth - summaryData.lastMonth).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="insight-actions">
              <button onClick={handleViewAnalytics} className="btn-secondary">
                <i className="fas fa-chart-pie"></i> View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-columns">
        <div className="dashboard-column">
          <div className="card">
            <div className="card-header">
              <h3><i className="fas fa-history"></i> Recent Expenses</h3>
              <Link to="/expenses" className="btn-secondary">View All</Link>
            </div>
            
            {recentExpenses.length > 0 ? (
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Provider</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentExpenses.map(expense => (
                    <tr key={expense.id}>
                      <td>{new Date(expense.date).toLocaleDateString()}</td>
                      <td>{expense.provider}</td>
                      <td>LKR {expense.amount.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge status-${expense.status.toLowerCase().replace(' ', '-')}`}>
                          {expense.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/expenses/${expense.id}`} className="action-link">
                          <i className="fas fa-eye"></i> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <i className="fas fa-receipt empty-icon"></i>
                <p>No expenses recorded yet</p>
                <Link to="/add-expense" className="btn-primary">Add Your First Expense</Link>
              </div>
            )}
          </div>
          
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <Link to="/add-expense" className="action-button">
                <i className="fas fa-plus-circle"></i>
                <span>Add Expense</span>
              </Link>
              <Link to="/reports" className="action-button">
                <i className="fas fa-file-pdf"></i>
                <span>Generate Report</span>
              </Link>
              <Link to="/tax-documents" className="action-button">
                <i className="fas fa-file-invoice-dollar"></i>
                <span>Tax Documents</span>
              </Link>
              <Link to="/analytics" className="action-button">
                <i className="fas fa-chart-pie"></i>
                <span>View Analytics</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="dashboard-column">
          <div className="card">
            <div className="card-header">
              <h3><i className="fas fa-tasks"></i> Personal Reminders</h3>
            </div>
            
            <div className="reminders-list">
              {summaryData.pendingClaims > 0 && (
                <div className="reminder-item">
                  <div className="reminder-icon pending">
                    <i className="fas fa-file-medical"></i>
                  </div>
                  <div className="reminder-content">
                    <h4>Insurance Claims Pending</h4>
                    <p>You have ${summaryData.pendingClaims.toFixed(2)} in pending insurance claims</p>
                    <Link to="/insurance-claims" className="reminder-action">Review Claims</Link>
                  </div>
                </div>
              )}
              
              {new Date().getMonth() >= 9 && (
                <div className="reminder-item">
                  <div className="reminder-icon tax">
                    <i className="fas fa-file-invoice-dollar"></i>
                  </div>
                  <div className="reminder-content">
                    <h4>Tax Year Ending Soon</h4>
                    <p>Prepare your medical expense tax documents before year end</p>
                    <Link to="/tax-documents" className="reminder-action">Generate Tax Documents</Link>
                  </div>
                </div>
              )}
              
              <div className="reminder-item">
                <div className="reminder-icon report">
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="reminder-content">
                  <h4>Monthly Report</h4>
                  <p>Download your expense report for {new Date().toLocaleString('default', { month: 'long' })}</p>
                  <button onClick={handleViewReports} className="reminder-action">Generate Report</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <Link to="/add-expense" className="btn-primary">Add New Expense</Link>
        <Link to="/insurance-claims" className="btn-secondary">Manage Claims</Link>
        <Link to="/tax-reports" className="btn-secondary">Tax Reports</Link>
      </div>
    </div>
  );
}

export default Dashboard;
