import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function InsuranceClaimTracker({ user }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClaims: 0,
    pendingClaims: 0,
    reimbursedAmount: 0,
    deniedClaims: 0
  });

  useEffect(() => {
    // In a real app, we would fetch data from an API
    // For MVP, we'll use localStorage
    const fetchClaims = () => {
      try {
        const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        // Filter expenses that are marked for insurance claims
        const insuranceClaims = storedExpenses.filter(expense => expense.insuranceClaim);
        
        setClaims(insuranceClaims);
        
        // Calculate stats
        const pendingClaims = insuranceClaims.filter(claim => claim.status === 'Pending claim');
        const reimbursedClaims = insuranceClaims.filter(claim => claim.status === 'Reimbursed');
        const deniedClaims = insuranceClaims.filter(claim => claim.status === 'Denied');
        
        setStats({
          totalClaims: insuranceClaims.length,
          pendingClaims: pendingClaims.length,
          reimbursedAmount: reimbursedClaims.reduce((total, claim) => total + claim.amount, 0),
          deniedClaims: deniedClaims.length
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching insurance claims:', error);
        setLoading(false);
      }
    };

    fetchClaims();
  }, [user]);

  if (loading) {
    return <div className="loading">Loading insurance claims...</div>;
  }

  return (
    <div className="insurance-claims">
      <h2>Insurance Claims Tracker</h2>
      
      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Total Claims</h3>
          <div className="amount">{stats.totalClaims}</div>
          <p>All insurance claims</p>
        </div>
        
        <div className="summary-card">
          <h3>Pending Claims</h3>
          <div className="amount">{stats.pendingClaims}</div>
          <p>Awaiting response</p>
        </div>
        
        <div className="summary-card">
          <h3>Reimbursed Amount</h3>
          <div className="amount">LKR {stats.reimbursedAmount.toFixed(2)}</div>
          <p>Total received</p>
        </div>
        
        <div className="summary-card">
          <h3>Denied Claims</h3>
          <div className="amount">{stats.deniedClaims}</div>
          <p>Rejected by insurance</p>
        </div>
      </div>
      
      <div className="card">
        <h3>Insurance Claims</h3>
        
        {claims.length === 0 ? (
          <div className="no-claims">
            <p>You don't have any insurance claims yet.</p>
            <p>Add a new medical expense and mark it for insurance claim.</p>
            <Link to="/add-expense" className="btn-primary">Add Medical Expense</Link>
          </div>
        ) : (
          <>
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Provider</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.map(claim => (
                  <tr key={claim.id}>
                    <td>{claim.date}</td>
                    <td>{claim.provider}</td>
                    <td>{claim.description}</td>
                    <td>LKR {claim.amount.toFixed(2)}</td>
                    <td>
                      <span className={
                        claim.status === 'Reimbursed' ? 'status-success' :
                        claim.status === 'Pending claim' ? 'status-pending' :
                        claim.status === 'Denied' ? 'status-danger' :
                        'status-not-claimed'
                      }>
                        {claim.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/expenses/${claim.id}`}>Manage</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="premium-feature-callout">
              <h4>Premium Features</h4>
              <p>Upgrade to premium for these additional features:</p>
              <ul>
                <li>Automated claim submission to insurance providers</li>
                <li>Claim status notifications</li>
                <li>Insurance policy coverage analysis</li>
                <li>Claim denial assistance</li>
              </ul>
              <button className="btn-primary" disabled>Upgrade to Premium</button>
            </div>
          </>
        )}
      </div>
      
      <div className="card insurance-tips">
        <h3>Tips for Successful Claims</h3>
        <ul>
          <li>Submit claims promptly after receiving medical services</li>
          <li>Always keep original receipts and documentation</li>
          <li>Verify your insurance coverage before procedures when possible</li>
          <li>Follow up with your insurance provider if a claim is pending for more than 30 days</li>
          <li>Appeal denied claims if you believe they should be covered</li>
        </ul>
      </div>
    </div>
  );
}

export default InsuranceClaimTracker;
