import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ExpenseForm({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    provider: '',
    description: '',
    amount: '',
    category: '',
    paymentMethod: '',
    insuranceClaim: false,
    taxDeductible: false
  });
  
  const [receipt, setReceipt] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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
  
  const paymentMethods = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'Insurance',
    'HSA/FSA',
    'Other'
  ];
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleReceiptChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceipt(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.provider || !formData.description || !formData.amount || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }
    
    // In a real app, we would send this data to an API
    // For MVP, we'll simulate saving by storing in localStorage
    
    try {
      // Get existing expenses or initialize empty array
      const existingExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
      
      // Create new expense object
      const newExpense = {
        id: Date.now(), // Use timestamp as ID
        userId: user?.id || 'demo-user',
        ...formData,
        amount: parseFloat(formData.amount),
        receipt: previewUrl, // In a real app, we would upload this to a server
        createdAt: new Date().toISOString(),
        status: formData.insuranceClaim ? 'Pending claim' : 'Not claimed'
      };
      
      // Add to expenses array
      existingExpenses.push(newExpense);
      
      // Save back to localStorage
      localStorage.setItem('expenses', JSON.stringify(existingExpenses));
      
      // Show success message
      setSuccess('Expense saved successfully!');
      
      // Reset form after successful save
      setTimeout(() => {
        navigate('/expenses');
      }, 2000);
      
    } catch (err) {
      setError('Error saving expense. Please try again.');
      console.error('Error saving expense:', err);
    }
  };
  
  return (
    <div className="expense-form card">
      <h2>Add New Medical Expense</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date" className="form-label">Date*</label>
            <input
              type="date"
              id="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="amount" className="form-label">Amount (LKR)*</label>
            <input
              type="number"
              id="amount"
              name="amount"
              className="form-control"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="provider" className="form-label">Healthcare Provider*</label>
          <input
            type="text"
            id="provider"
            name="provider"
            className="form-control"
            value={formData.provider}
            onChange={handleChange}
            placeholder="Hospital, doctor's office, pharmacy, etc."
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description*</label>
          <input
            type="text"
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the medical expense"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category" className="form-label">Category*</label>
            <select
              id="category"
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="paymentMethod" className="form-label">Payment Method*</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              className="form-control"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="">Select payment method</option>
              {paymentMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-row checkbox-row">
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="insuranceClaim"
              name="insuranceClaim"
              checked={formData.insuranceClaim}
              onChange={handleChange}
            />
            <label htmlFor="insuranceClaim">Submit for insurance claim</label>
          </div>
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="taxDeductible"
              name="taxDeductible"
              checked={formData.taxDeductible}
              onChange={handleChange}
            />
            <label htmlFor="taxDeductible">Tax deductible expense</label>
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Receipt Upload</label>
          <div 
            className="receipt-upload"
            onClick={() => document.getElementById('receipt').click()}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Receipt preview" className="receipt-preview" />
            ) : (
              <div className="upload-placeholder">
                <i className="fas fa-file-medical"></i>
                <p>Click to upload receipt image</p>
                <p><small><i className="fas fa-info-circle"></i> JPG, PNG or PDF up to 5MB</small></p>
              </div>
            )}
            <input
              type="file"
              id="receipt"
              name="receipt"
              accept="image/jpeg,image/png,application/pdf"
              onChange={handleReceiptChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-primary">Save Expense</button>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate('/expenses')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;
