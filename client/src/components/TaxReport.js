import React, { useState, useEffect } from 'react';

function TaxReport({ user }) {
  const [taxDeductibleExpenses, setTaxDeductibleExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState({
    totalDeductible: 0,
    byCategory: {}
  });

  useEffect(() => {
    // In a real app, we would fetch data from an API
    // For MVP, we'll use localStorage
    const fetchTaxDeductibleExpenses = () => {
      try {
        const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        
        // Filter expenses that are marked as tax deductible and from the selected year
        const deductibleExpenses = storedExpenses.filter(expense => 
          expense.taxDeductible && 
          new Date(expense.date).getFullYear() === year
        );
        
        setTaxDeductibleExpenses(deductibleExpenses);
        
        // Calculate stats
        const totalDeductible = deductibleExpenses.reduce((total, expense) => total + expense.amount, 0);
        
        // Group by category
        const byCategory = deductibleExpenses.reduce((acc, expense) => {
          const category = expense.category;
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += expense.amount;
          return acc;
        }, {});
        
        setStats({
          totalDeductible,
          byCategory
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tax deductible expenses:', error);
        setLoading(false);
      }
    };

    fetchTaxDeductibleExpenses();
  }, [user, year]);

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i);
    }
    return years;
  };

  const downloadTaxReport = () => {
    // In a real app, this would generate a PDF or CSV file
    // For MVP, we'll just show an alert
    alert('Tax report download feature will be available in the premium version.');
  };

  if (loading) {
    return <div className="loading">Loading tax report...</div>;
  }

  return (
    <div className="tax-report">
      <h2>Tax Report</h2>
      
      <div className="report-controls">
        <div className="form-group">
          <label htmlFor="taxYear" className="form-label">Tax Year</label>
          <select
            id="taxYear"
            className="form-control"
            value={year}
            onChange={handleYearChange}
          >
            {generateYearOptions().map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        
        <button onClick={downloadTaxReport} className="btn-primary">
          Download Tax Report
        </button>
      </div>
      
      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Total Tax Deductible</h3>
          <div className="amount">${stats.totalDeductible.toFixed(2)}</div>
          <p>For {year} tax year</p>
        </div>
      </div>
      
      <div className="card">
        <h3>Tax Deductible Expenses by Category</h3>
        
        {Object.keys(stats.byCategory).length === 0 ? (
          <div className="no-data">
            <p>No tax deductible expenses found for {year}.</p>
          </div>
        ) : (
          <div className="category-breakdown">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.byCategory).map(([category, amount]) => (
                  <tr key={category}>
                    <td>{category}</td>
                    <td>${amount.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td><strong>Total</strong></td>
                  <td><strong>${stats.totalDeductible.toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="card">
        <h3>Tax Deductible Expenses</h3>
        
        {taxDeductibleExpenses.length === 0 ? (
          <div className="no-data">
            <p>No tax deductible expenses found for {year}.</p>
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
              </tr>
            </thead>
            <tbody>
              {taxDeductibleExpenses.map(expense => (
                <tr key={expense.id}>
                  <td>{expense.date}</td>
                  <td>{expense.provider}</td>
                  <td>{expense.description}</td>
                  <td>{expense.category}</td>
                  <td>${expense.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="card tax-info">
        <h3>Tax Information</h3>
        <div className="tax-disclaimer">
          <p><strong>Disclaimer:</strong> This report is for informational purposes only and should not be considered as tax advice. Please consult with a tax professional for advice specific to your situation.</p>
        </div>
        
        <div className="tax-tips">
          <h4>Medical Expense Tax Deduction Tips</h4>
          <ul>
            <li>In the United States, you can deduct medical expenses that exceed 7.5% of your adjusted gross income (AGI).</li>
            <li>Keep all receipts and documentation for medical expenses.</li>
            <li>Eligible expenses include payments for diagnosis, treatment, prevention, and prescription medications.</li>
            <li>Some insurance premiums may be tax-deductible.</li>
            <li>Travel expenses for medical care may be deductible.</li>
          </ul>
        </div>
        
        <div className="premium-feature-callout">
          <h4>Premium Features</h4>
          <p>Upgrade to premium for these additional tax features:</p>
          <ul>
            <li>Automated tax form generation (Schedule A)</li>
            <li>Tax deduction optimization recommendations</li>
            <li>Integration with tax preparation software</li>
            <li>Year-over-year tax deduction analysis</li>
          </ul>
          <button className="btn-primary" disabled>Upgrade to Premium</button>
        </div>
      </div>
    </div>
  );
}

export default TaxReport;
