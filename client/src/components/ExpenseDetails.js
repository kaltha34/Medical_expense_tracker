import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function ExpenseDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [claimStatus, setClaimStatus] = useState('');
  
  useEffect(() => {
    // In a real app, we would fetch data from an API
    // For MVP, we'll use localStorage
    const fetchExpense = () => {
      try {
        const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        const foundExpense = storedExpenses.find(exp => exp.id === parseInt(id));
        
        if (foundExpense) {
          setExpense(foundExpense);
          setClaimStatus(foundExpense.status);
        } else {
          setError('Expense not found');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching expense details:', error);
        setError('Error loading expense details');
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  const handleStatusChange = (e) => {
    setClaimStatus(e.target.value);
  };

  const updateExpenseStatus = () => {
    try {
      const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
      const updatedExpenses = storedExpenses.map(exp => {
        if (exp.id === parseInt(id)) {
          return { ...exp, status: claimStatus };
        }
        return exp;
      });
      
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      setExpense({ ...expense, status: claimStatus });
      setSuccess('Expense status updated successfully');
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error updating expense status:', error);
      setError('Error updating expense status');
    }
  };

  const deleteExpense = () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        const updatedExpenses = storedExpenses.filter(exp => exp.id !== parseInt(id));
        
        localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
        setSuccess('Expense deleted successfully');
        
        setTimeout(() => {
          navigate('/expenses');
        }, 2000);
      } catch (error) {
        console.error('Error deleting expense:', error);
        setError('Error deleting expense');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading expense details...</div>;
  }

  if (error && !expense) {
    return (
      <div className="expense-details card">
        <div className="alert alert-danger">{error}</div>
        <Link to="/expenses" className="btn-primary">Back to Expenses</Link>
      </div>
    );
  }

  return (
    <div className="expense-details">
      <div className="details-header">
        <h2>Expense Details</h2>
        <div className="details-actions">
          <button onClick={() => navigate('/expenses')} className="btn-secondary">Back to List</button>
          <button onClick={deleteExpense} className="btn-danger">Delete Expense</button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="expense-details-content">
        <div className="card expense-info-card">
          <div className="expense-info">
            <div className="expense-info-item">
              <label>Date</label>
              <p>{expense.date}</p>
            </div>
            
            <div className="expense-info-item">
              <label>Amount</label>
              <p>LKR {expense.amount.toFixed(2)}</p>
            </div>
            
            <div className="expense-info-item">
              <label>Provider</label>
              <p>{expense.provider}</p>
            </div>
            
            <div className="expense-info-item">
              <label>Description</label>
              <p>{expense.description}</p>
            </div>
            
            <div className="expense-info-item">
              <label>Category</label>
              <p>{expense.category}</p>
            </div>
            
            <div className="expense-info-item">
              <label>Payment Method</label>
              <p>{expense.paymentMethod}</p>
            </div>
            
            <div className="expense-info-item">
              <label>Insurance Claim</label>
              <p>{expense.insuranceClaim ? 'Yes' : 'No'}</p>
            </div>
            
            <div className="expense-info-item">
              <label>Tax Deductible</label>
              <p>{expense.taxDeductible ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        <div className="card claim-status-card">
          <h3>Claim Status</h3>
          <div className="status-selector">
            <label htmlFor="claimStatus" className="form-label">Current Status:</label>
            <select
              id="claimStatus"
              className="form-control"
              value={claimStatus}
              onChange={handleStatusChange}
            >
              <option value="Not claimed">Not claimed</option>
              <option value="Pending claim">Pending claim</option>
              <option value="Reimbursed">Reimbursed</option>
              <option value="Denied">Denied</option>
            </select>
            <button onClick={updateExpenseStatus} className="btn-primary">Update Status</button>
          </div>
          
          {expense.status === 'Reimbursed' && (
            <div className="reimbursement-details">
              <h4>Reimbursement Details</h4>
              <p>In a full version, you would be able to add reimbursement details here, such as:</p>
              <ul>
                <li>Date received</li>
                <li>Amount reimbursed</li>
                <li>Insurance reference number</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="card receipt-card">
        <h3>Receipt</h3>
        {expense.receipt ? (
          <div className="receipt-image">
            <img src={expense.receipt} alt="Medical receipt" />
          </div>
        ) : (
          <div className="no-receipt">
            <p>No receipt uploaded for this expense.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpenseDetails;
