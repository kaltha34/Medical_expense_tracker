import React, { useState, useEffect } from 'react';

function ExpenseAnalytics({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [timeframe, setTimeframe] = useState('year'); // year, quarter, month, custom
  const [year, setYear] = useState(new Date().getFullYear());
  const [quarter, setQuarter] = useState(Math.floor(new Date().getMonth() / 3) + 1);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartType, setChartType] = useState('bar'); // bar, pie, line
  const [showTaxDeductible, setShowTaxDeductible] = useState(true);
  const [showInsuranceClaims, setShowInsuranceClaims] = useState(true);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadExpenses();
  }, []);
  
  const loadExpenses = () => {
    try {
      const storedExpenses = localStorage.getItem('expenses');
      if (storedExpenses) {
        const parsedExpenses = JSON.parse(storedExpenses);
        // Filter by user ID if we have a logged-in user
        const userExpenses = user?.id 
          ? parsedExpenses.filter(expense => expense.userId === user.id)
          : parsedExpenses;
        
        setExpenses(userExpenses);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading expenses:', error);
      setLoading(false);
    }
  };
  
  // Filter expenses based on selected timeframe
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const expenseYear = expenseDate.getFullYear();
    const expenseMonth = expenseDate.getMonth() + 1;
    const expenseQuarter = Math.floor((expenseDate.getMonth()) / 3) + 1;
    
    if (timeframe === 'year') {
      return expenseYear === year;
    } else if (timeframe === 'quarter') {
      return expenseYear === year && expenseQuarter === quarter;
    } else if (timeframe === 'month') {
      return expenseYear === year && expenseMonth === month;
    } else if (timeframe === 'custom' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return expenseDate >= start && expenseDate <= end;
    }
    return true;
  });
  
  // Calculate analytics data
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Group expenses by category
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    const category = expense.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {});
  
  // Group expenses by month (for yearly view)
  const expensesByMonth = filteredExpenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const month = date.getMonth();
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += expense.amount;
    return acc;
  }, {});
  
  // Calculate monthly averages
  const monthlyData = Object.entries(expensesByMonth).map(([month, amount]) => ({
    month: parseInt(month),
    amount
  }));
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Calculate tax deductible amount
  const taxDeductibleAmount = filteredExpenses
    .filter(expense => expense.taxDeductible)
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate insurance claim amount
  const insuranceClaimAmount = filteredExpenses
    .filter(expense => expense.insuranceClaim)
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate reimbursed amount
  const reimbursedAmount = filteredExpenses
    .filter(expense => expense.status === 'Reimbursed')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate out-of-pocket amount
  const outOfPocketAmount = totalExpenses - reimbursedAmount;
  
  // Generate years for dropdown (last 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  
  // Generate quarters for dropdown
  const quarters = [1, 2, 3, 4];
  
  // Handle timeframe change
  const handleTimeframeChange = (e) => {
    setTimeframe(e.target.value);
  };
  
  return (
    <div className="expense-analytics">
      <div className="analytics-header">
        <h2><i className="fas fa-chart-pie"></i> Expense Analytics</h2>
        <div className="analytics-actions">
          <button className="btn-export">
            <i className="fas fa-file-export"></i> Export Data
          </button>
          <button className="btn-refresh" onClick={loadExpenses}>
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>
      
      <div className="analytics-controls">
        <div className="control-group">
          <label>Chart Type:</label>
          <div className="chart-type-selector">
            <button 
              className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
              onClick={() => setChartType('bar')}
            >
              <i className="fas fa-chart-bar"></i> Bar
            </button>
            <button 
              className={`chart-type-btn ${chartType === 'pie' ? 'active' : ''}`}
              onClick={() => setChartType('pie')}
            >
              <i className="fas fa-chart-pie"></i> Pie
            </button>
            <button 
              className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
              onClick={() => setChartType('line')}
            >
              <i className="fas fa-chart-line"></i> Line
            </button>
          </div>
        </div>
        
        <div className="control-group">
          <label>Time Period:</label>
          <div className="timeframe-selector">
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className="form-select"
            >
              <option value="year">Year</option>
              <option value="quarter">Quarter</option>
              <option value="month">Month</option>
              <option value="custom">Custom Range</option>
            </select>
            
            {timeframe === 'year' && (
              <select 
                value={year} 
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="form-select"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            )}
            
            {timeframe === 'custom' && (
              <div className="date-range-inputs">
                <div className="date-input-group">
                  <label>From:</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    className="form-input"
                  />
                </div>
                <div className="date-input-group">
                  <label>To:</label>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    className="form-input"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <p>Analyze your medical expenses to better understand your spending patterns.</p>
      
      {loading ? (
        <div className="loading">Loading analytics data...</div>
      ) : (
        <>
          <div className="analytics-filters">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="timeframe">Time Period</label>
                <select 
                  id="timeframe" 
                  value={timeframe} 
                  onChange={handleTimeframeChange}
                  className="form-control"
                >
                  <option value="year">Yearly</option>
                  <option value="quarter">Quarterly</option>
                  <option value="month">Monthly</option>
                </select>
              </div>
              
              {timeframe === 'year' && (
                <div className="form-group">
                  <label htmlFor="year">Year</label>
                  <select 
                    id="year" 
                    value={year} 
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="form-control"
                  >
                    {years.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {timeframe === 'quarter' && (
                <>
                  <div className="form-group">
                    <label htmlFor="year">Year</label>
                    <select 
                      id="year" 
                      value={year} 
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      className="form-control"
                    >
                      {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="quarter">Quarter</label>
                    <select 
                      id="quarter" 
                      value={quarter} 
                      onChange={(e) => setQuarter(parseInt(e.target.value))}
                      className="form-control"
                    >
                      {quarters.map(q => (
                        <option key={q} value={q}>Q{q}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              
              {timeframe === 'month' && (
                <>
                  <div className="form-group">
                    <label htmlFor="year">Year</label>
                    <select 
                      id="year" 
                      value={year} 
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      className="form-control"
                    >
                      {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="month">Month</label>
                    <select 
                      id="month" 
                      value={month} 
                      onChange={(e) => setMonth(parseInt(e.target.value))}
                      className="form-control"
                    >
                      {monthNames.map((name, index) => (
                        <option key={index + 1} value={index + 1}>{name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="analytics-summary">
            <h3>
              {timeframe === 'year' && `${year} Summary`}
              {timeframe === 'quarter' && `Q${quarter} ${year} Summary`}
              {timeframe === 'month' && `${monthNames[month - 1]} ${year} Summary`}
            </h3>
            
            <div className="analytics-cards">
              <div className="analytics-card">
                <div className="analytics-card-body">
                  <div className="analytics-value">LKR {outOfPocketAmount.toFixed(2)}</div>
                  <div className="analytics-label">
                    {((outOfPocketAmount / totalExpenses) * 100).toFixed(1)}% of total
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {filteredExpenses.length > 0 ? (
            <>
              <div className="analytics-section">
                <h3>Expenses by Category</h3>
                <div className="category-breakdown">
                  <table className="analytics-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(expensesByCategory)
                        .sort((a, b) => b[1] - a[1]) // Sort by amount descending
                        .map(([category, amount]) => (
                          <tr key={category}>
                            <td>{category}</td>
                            <td>LKR {amount.toFixed(2)}</td>
                            <td>{((amount / totalExpenses) * 100).toFixed(1)}%</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {timeframe === 'year' && (
                <div className="analytics-section">
                  <h3>Monthly Breakdown</h3>
                  <div className="monthly-breakdown">
                    <table className="analytics-table">
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>Amount</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyData
                          .sort((a, b) => a.month - b.month) // Sort by month
                          .map(({ month, amount }) => (
                            <tr key={month}>
                              <td>{monthNames[month]}</td>
                              <td>LKR {amount.toFixed(2)}</td>
                              <td>{((amount / totalExpenses) * 100).toFixed(1)}%</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              <div className="analytics-section">
                <h3>Spending Insights</h3>
                <div className="insights-list">
                  {totalExpenses > 0 && (
                    <ul>
                      <li>
                        Your highest spending category is{' '}
                        <strong>
                          {Object.entries(expensesByCategory)
                            .sort((a, b) => b[1] - a[1])[0][0]}
                        </strong>{' '}
                        at ${Object.entries(expensesByCategory)
                          .sort((a, b) => b[1] - a[1])[0][1].toFixed(2)}
                      </li>
                      
                      {taxDeductibleAmount > 0 && (
                        <li>
                          You have ${taxDeductibleAmount.toFixed(2)} in tax deductible expenses,
                          which is {((taxDeductibleAmount / totalExpenses) * 100).toFixed(1)}% of your total expenses
                        </li>
                      )}
                      
                      {insuranceClaimAmount > 0 && (
                        <li>
                          You've claimed ${insuranceClaimAmount.toFixed(2)} through insurance,
                          which is {((insuranceClaimAmount / totalExpenses) * 100).toFixed(1)}% of your total expenses
                        </li>
                      )}
                      
                      {timeframe === 'year' && monthlyData.length > 0 && (
                        <li>
                          Your highest spending month was{' '}
                          <strong>
                            {monthNames[monthlyData.sort((a, b) => b.amount - a.amount)[0].month]}
                          </strong>{' '}
                          with ${monthlyData.sort((a, b) => b.amount - a.amount)[0].amount.toFixed(2)} in expenses
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="alert alert-info">
              No expense data available for the selected time period. Please adjust your filters or add expenses.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ExpenseAnalytics;
