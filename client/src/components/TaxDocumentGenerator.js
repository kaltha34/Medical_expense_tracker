import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function TaxDocumentGenerator({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [taxYear, setTaxYear] = useState(new Date().getFullYear() - 1); // Default to previous year for tax purposes
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Generate list of available tax years (current year and 7 years back)
  const currentYear = new Date().getFullYear();
  const availableTaxYears = Array.from({ length: 8 }, (_, i) => currentYear - i);
  
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
  
  // Filter expenses for the selected tax year and tax deductible only
  const taxDeductibleExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const expenseYear = expenseDate.getFullYear();
    return expenseYear === taxYear && expense.taxDeductible;
  });
  
  // Calculate total tax deductible amount
  const totalDeductibleAmount = taxDeductibleExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Group expenses by category for the tax document
  const expensesByCategory = taxDeductibleExpenses.reduce((acc, expense) => {
    const category = expense.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = {
        count: 0,
        total: 0,
        expenses: []
      };
    }
    acc[category].count += 1;
    acc[category].total += expense.amount;
    acc[category].expenses.push(expense);
    return acc;
  }, {});
  
  // Generate PDF tax document
  const generateTaxDocument = () => {
    setLoading(true);
    setMessage('');
    
    try {
      const doc = new jsPDF();
      
      // Add title and header
      doc.setFontSize(18);
      doc.text(`Medical Expenses Tax Summary - ${taxYear}`, 14, 22);
      
      // Add taxpayer information
      doc.setFontSize(12);
      doc.text('Taxpayer Information:', 14, 35);
      doc.setFontSize(10);
      doc.text(`Name: ${user?.name || 'Demo User'}`, 20, 42);
      doc.text(`Tax Year: ${taxYear}`, 20, 48);
      doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 20, 54);
      
      // Add summary section
      doc.setFontSize(12);
      doc.text('Summary of Deductible Medical Expenses', 14, 65);
      
      doc.setFontSize(10);
      doc.text(`Total Deductible Medical Expenses: $${totalDeductibleAmount.toFixed(2)}`, 20, 72);
      doc.text(`Number of Deductible Expenses: ${taxDeductibleExpenses.length}`, 20, 78);
      
      // Add note about tax deduction rules
      doc.setFontSize(9);
      doc.text('Note: Medical expenses are generally deductible to the extent they exceed 7.5% of your adjusted gross income.', 14, 88);
      doc.text('Please consult with a tax professional for specific advice regarding your tax situation.', 14, 93);
      
      // Add category breakdown
      doc.setFontSize(12);
      doc.text('Expenses by Category', 14, 105);
      
      const categoryTableData = Object.entries(expensesByCategory).map(([category, data]) => [
        category,
        data.count,
        `$${data.total.toFixed(2)}`
      ]);
      
      doc.autoTable({
        startY: 110,
        head: [['Category', 'Count', 'Total Amount']],
        body: categoryTableData,
        theme: 'striped',
        headStyles: { fillColor: [67, 97, 238] }
      });
      
      // Add detailed expense list
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Detailed List of Deductible Medical Expenses', 14, 22);
      
      // Create table data for all expenses
      const expenseTableData = taxDeductibleExpenses.map(expense => [
        new Date(expense.date).toLocaleDateString(),
        expense.provider,
        expense.description,
        `$${expense.amount.toFixed(2)}`,
        expense.category
      ]);
      
      doc.autoTable({
        startY: 30,
        head: [['Date', 'Provider', 'Description', 'Amount', 'Category']],
        body: expenseTableData,
        theme: 'striped',
        headStyles: { fillColor: [67, 97, 238] },
        styles: { overflow: 'linebreak' }
      });
      
      // Add tax form information page
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Tax Form Information', 14, 22);
      
      doc.setFontSize(10);
      doc.text('The following information may be helpful when completing your tax return:', 14, 30);
      
      doc.text('For Form 1040, Schedule A (Itemized Deductions):', 14, 40);
      doc.text('• Medical and dental expenses are reported on Schedule A, lines 1-4.', 20, 47);
      doc.text('• Enter the total amount of your medical expenses on line 1.', 20, 53);
      doc.text('• Enter your adjusted gross income (from Form 1040) on line 2.', 20, 59);
      doc.text('• Multiply line 2 by 7.5% (0.075) and enter the result on line 3.', 20, 65);
      doc.text('• Subtract line 3 from line 1 to calculate your deductible amount on line 4.', 20, 71);
      
      doc.text('Common Deductible Medical Expenses:', 14, 81);
      doc.text('• Payments to doctors, dentists, surgeons, and other medical professionals', 20, 87);
      doc.text('• Hospital and nursing home care', 20, 93);
      doc.text('• Prescription medications and insulin', 20, 99);
      doc.text('• Medical insurance premiums (not paid through pre-tax employer plans)', 20, 105);
      doc.text('• Medical equipment, supplies, and diagnostic devices', 20, 111);
      doc.text('• Transportation costs for medical care (mileage, parking, tolls)', 20, 117);
      
      doc.text('Important: This document is for informational purposes only and does not constitute tax advice.', 14, 130);
      doc.text('Please consult with a qualified tax professional for guidance specific to your situation.', 14, 136);
      
      // Save the PDF
      const fileName = `medical-expenses-tax-document-${taxYear}.pdf`;
      doc.save(fileName);
      
      setMessage(`Tax document "${fileName}" has been downloaded.`);
    } catch (error) {
      console.error('Error generating tax document:', error);
      setMessage('Failed to generate tax document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tax-document-generator">
      <h2>Tax Document Generator</h2>
      <p>Generate a summary of your tax-deductible medical expenses for your tax return.</p>
      
      {message && <div className="alert alert-info">{message}</div>}
      
      <div className="tax-year-selector">
        <div className="form-group">
          <label htmlFor="taxYear">Select Tax Year</label>
          <select
            id="taxYear"
            value={taxYear}
            onChange={(e) => setTaxYear(parseInt(e.target.value))}
            className="form-control"
          >
            {availableTaxYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="tax-summary">
        <h3>Tax Deduction Summary for {taxYear}</h3>
        
        {taxDeductibleExpenses.length > 0 ? (
          <div className="tax-stats">
            <div className="stat-item">
              <span className="stat-label">Total Deductible Expenses:</span>
              <span className="stat-value">${totalDeductibleAmount.toFixed(2)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Number of Deductible Expenses:</span>
              <span className="stat-value">{taxDeductibleExpenses.length}</span>
            </div>
          </div>
        ) : (
          <div className="alert alert-warning">
            No tax-deductible medical expenses found for {taxYear}. 
            Please make sure you've marked eligible expenses as "Tax Deductible" when adding them.
          </div>
        )}
      </div>
      
      {taxDeductibleExpenses.length > 0 && (
        <div className="category-breakdown">
          <h3>Expenses by Category</h3>
          <table className="expense-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Count</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(expensesByCategory)
                .sort((a, b) => b[1].total - a[1].total) // Sort by total amount descending
                .map(([category, data]) => (
                  <tr key={category}>
                    <td>{category}</td>
                    <td>{data.count}</td>
                    <td>${data.total.toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="tax-document-actions">
        <button 
          className="btn-primary" 
          onClick={generateTaxDocument} 
          disabled={loading || taxDeductibleExpenses.length === 0}
        >
          <i className="fas fa-file-pdf"></i> Generate Tax Document
        </button>
      </div>
      
      <div className="tax-info-box">
        <h4><i className="fas fa-info-circle"></i> Tax Information</h4>
        <p>
          For most taxpayers, medical expenses are deductible only to the extent they exceed 7.5% of your 
          adjusted gross income (AGI) and only if you itemize deductions on Schedule A.
        </p>
        <p>
          This tool helps you organize your medical expenses for tax purposes, but does not provide tax advice. 
          Please consult with a qualified tax professional for guidance specific to your situation.
        </p>
      </div>
    </div>
  );
}

export default TaxDocumentGenerator;
