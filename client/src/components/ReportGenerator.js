import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function ReportGenerator({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [reportFormat, setReportFormat] = useState('pdf'); // pdf, csv, excel
  const [reportLayout, setReportLayout] = useState('detailed'); // detailed, summary, compact
  const [includeCharts, setIncludeCharts] = useState(true);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Jan 1 of current year
    endDate: new Date().toISOString().split('T')[0], // Today
    category: '',
    minAmount: '',
    maxAmount: '',
    taxDeductibleOnly: false,
    insuranceClaimOnly: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Categories for filtering
  const categories = [
    'All Categories',
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

  useEffect(() => {
    // Load expenses from localStorage
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
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const filteredExpenses = expenses.filter(expense => {
    // Date range filter
    const expenseDate = new Date(expense.date);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;
    
    if (startDate && expenseDate < startDate) return false;
    if (endDate && expenseDate > endDate) return false;
    
    // Category filter
    if (filters.category && filters.category !== 'All Categories' && expense.category !== filters.category) return false;
    
    // Amount range filter
    if (filters.minAmount && expense.amount < parseFloat(filters.minAmount)) return false;
    if (filters.maxAmount && expense.amount > parseFloat(filters.maxAmount)) return false;
    
    // Tax deductible filter
    if (filters.taxDeductibleOnly && !expense.taxDeductible) return false;
    
    // Insurance claim filter
    if (filters.insuranceClaimOnly && !expense.insuranceClaim) return false;
    
    return true;
  });

  // Calculate summary statistics
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const taxDeductibleAmount = filteredExpenses
    .filter(expense => expense.taxDeductible)
    .reduce((sum, expense) => sum + expense.amount, 0);
  const claimedAmount = filteredExpenses
    .filter(expense => expense.insuranceClaim)
    .reduce((sum, expense) => sum + expense.amount, 0);
  const reimbursedAmount = filteredExpenses
    .filter(expense => expense.status === 'Reimbursed')
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Group expenses by category for the report
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    const category = expense.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = {
        count: 0,
        total: 0
      };
    }
    acc[category].count += 1;
    acc[category].total += expense.amount;
    return acc;
  }, {});

  // Generate PDF report
  const generatePDF = () => {
    setLoading(true);
    setMessage('');
    
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('Medical Expense Report', 14, 22);
      
      // Add report metadata
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Date Range: ${filters.startDate} to ${filters.endDate}`, 14, 35);
      doc.text(`User: ${user?.name || 'Demo User'}`, 14, 40);
      
      // Add summary section
      doc.setFontSize(14);
      doc.text('Summary', 14, 50);
      
      doc.setFontSize(10);
      doc.text(`Total Expenses: $${totalAmount.toFixed(2)}`, 14, 58);
      doc.text(`Tax Deductible: $${taxDeductibleAmount.toFixed(2)}`, 14, 63);
      doc.text(`Insurance Claims: $${claimedAmount.toFixed(2)}`, 14, 68);
      doc.text(`Reimbursed: $${reimbursedAmount.toFixed(2)}`, 14, 73);
      doc.text(`Out of Pocket: $${(totalAmount - reimbursedAmount).toFixed(2)}`, 14, 78);
      
      // Add category breakdown
      doc.setFontSize(14);
      doc.text('Expenses by Category', 14, 90);
      
      const categoryTableData = Object.entries(expensesByCategory).map(([category, data]) => [
        category,
        data.count,
        `$${data.total.toFixed(2)}`
      ]);
      
      doc.autoTable({
        startY: 95,
        head: [['Category', 'Count', 'Total Amount']],
        body: categoryTableData,
        theme: 'striped',
        headStyles: { fillColor: [67, 97, 238] }
      });
      
      // Add detailed expense list
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Detailed Expense List', 14, 22);
      
      const expenseTableData = filteredExpenses.map(expense => [
        new Date(expense.date).toLocaleDateString(),
        expense.provider,
        expense.description,
        `$${expense.amount.toFixed(2)}`,
        expense.status,
        expense.taxDeductible ? 'Yes' : 'No'
      ]);
      
      doc.autoTable({
        startY: 30,
        head: [['Date', 'Provider', 'Description', 'Amount', 'Status', 'Tax Deductible']],
        body: expenseTableData,
        theme: 'striped',
        headStyles: { fillColor: [67, 97, 238] },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 35 },
          2: { cellWidth: 50 },
          3: { cellWidth: 25 },
          4: { cellWidth: 30 },
          5: { cellWidth: 25 }
        },
        styles: { overflow: 'linebreak' }
      });
      
      // Save the PDF
      const fileName = `medical-expenses-${filters.startDate}-to-${filters.endDate}.pdf`;
      doc.save(fileName);
      
      setMessage(`Report "${fileName}" has been downloaded.`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setMessage('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate CSV export
  const generateCSV = () => {
    setLoading(true);
    setMessage('');
    
    try {
      // Create CSV header row
      const headers = [
        'Date', 
        'Provider', 
        'Description', 
        'Amount', 
        'Category', 
        'Payment Method', 
        'Insurance Claim', 
        'Status', 
        'Tax Deductible'
      ];
      
      // Create CSV data rows
      const dataRows = filteredExpenses.map(expense => [
        expense.date,
        expense.provider,
        expense.description,
        expense.amount,
        expense.category,
        expense.paymentMethod,
        expense.insuranceClaim ? 'Yes' : 'No',
        expense.status,
        expense.taxDeductible ? 'Yes' : 'No'
      ]);
      
      // Combine headers and data
      const csvContent = [
        headers.join(','),
        ...dataRows.map(row => row.join(','))
      ].join('\n');
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `medical-expenses-${filters.startDate}-to-${filters.endDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setMessage(`CSV file has been downloaded.`);
    } catch (error) {
      console.error('Error generating CSV:', error);
      setMessage('Failed to generate CSV. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-generator">
      <h2>Generate Expense Reports</h2>
      <p>Use the filters below to customize your report, then generate a PDF or CSV file.</p>
      
      {message && <div className="alert alert-info">{message}</div>}
      
      <div className="filter-section">
        <h3>Report Filters</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="form-control"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="form-control"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="minAmount">Min Amount ($)</label>
            <input
              type="number"
              id="minAmount"
              name="minAmount"
              value={filters.minAmount}
              onChange={handleFilterChange}
              className="form-control"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="maxAmount">Max Amount ($)</label>
            <input
              type="number"
              id="maxAmount"
              name="maxAmount"
              value={filters.maxAmount}
              onChange={handleFilterChange}
              className="form-control"
              min="0"
              step="0.01"
              placeholder="Any"
            />
          </div>
        </div>
        
        <div className="form-row checkbox-row">
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="taxDeductibleOnly"
              name="taxDeductibleOnly"
              checked={filters.taxDeductibleOnly}
              onChange={handleFilterChange}
            />
            <label htmlFor="taxDeductibleOnly">Tax Deductible Only</label>
          </div>
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="insuranceClaimOnly"
              name="insuranceClaimOnly"
              checked={filters.insuranceClaimOnly}
              onChange={handleFilterChange}
            />
            <label htmlFor="insuranceClaimOnly">Insurance Claims Only</label>
          </div>
        </div>
      </div>
      
      <div className="report-summary">
        <h3>Report Summary</h3>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Total Expenses:</span>
            <span className="stat-value">${totalAmount.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Number of Expenses:</span>
            <span className="stat-value">{filteredExpenses.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Tax Deductible:</span>
            <span className="stat-value">${taxDeductibleAmount.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Insurance Claims:</span>
            <span className="stat-value">${claimedAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="report-actions">
        <button 
          className="btn-primary" 
          onClick={generatePDF} 
          disabled={loading || filteredExpenses.length === 0}
        >
          <i className="fas fa-file-pdf"></i> Generate PDF Report
        </button>
        <button 
          className="btn-secondary" 
          onClick={generateCSV} 
          disabled={loading || filteredExpenses.length === 0}
        >
          <i className="fas fa-file-csv"></i> Export as CSV
        </button>
      </div>
      
      {filteredExpenses.length === 0 && (
        <div className="alert alert-warning">
          No expenses match your selected filters. Please adjust your criteria.
        </div>
      )}
    </div>
  );
}

export default ReportGenerator;
