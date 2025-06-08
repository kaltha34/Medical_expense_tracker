import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Component imports
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseDetails from './components/ExpenseDetails';
import InsuranceClaimTracker from './components/InsuranceClaimTracker';
import TaxReport from './components/TaxReport';
import Login from './components/Login';
import Register from './components/Register';
import LandingPage from './components/LandingPage';
import ReportGenerator from './components/ReportGenerator';
import ExpenseAnalytics from './components/ExpenseAnalytics';
import TaxDocumentGenerator from './components/TaxDocumentGenerator';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // For MVP, we'll use local storage to simulate authentication
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="header-container">
            <div className="brand">
              <Link to={isAuthenticated ? "/" : "/"}>
                <span className="brand-logo">
                  <i className="fas fa-heartbeat"></i>
                </span>
                <span className="brand-name">MediTrack</span>
              </Link>
            </div>
            
            {isAuthenticated ? (
              <>
                <nav className="main-nav">
                  <Link to="/" className="nav-item" title="Dashboard">
                    <i className="fas fa-home"></i>
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/expenses" className="nav-item" title="Expenses">
                    <i className="fas fa-list"></i>
                    <span>Expenses</span>
                  </Link>
                  <Link to="/add-expense" className="nav-item" title="Add Expense">
                    <i className="fas fa-plus-circle"></i>
                    <span>Add</span>
                  </Link>
                  <Link to="/analytics" className="nav-item" title="Analytics">
                    <i className="fas fa-chart-pie"></i>
                    <span>Analytics</span>
                  </Link>
                  <Link to="/reports" className="nav-item" title="Reports">
                    <i className="fas fa-file-alt"></i>
                    <span>Reports</span>
                  </Link>
                </nav>
                
                <div className="nav-actions">
                  <div className="dropdown">
                    <button className="dropdown-toggle">
                      <i className="fas fa-ellipsis-h"></i>
                    </button>
                    <div className="dropdown-menu">
                      <Link to="/tax-documents" className="dropdown-item">
                        <i className="fas fa-file-invoice-dollar"></i>
                        <span>Tax Documents</span>
                      </Link>
                      <Link to="/insurance-claims" className="dropdown-item">
                        <i className="fas fa-file-medical"></i>
                        <span>Insurance Claims</span>
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-item">
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="user-profile">
                    <div className="avatar">
                      <i className="fas fa-user"></i>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="auth-nav">
                <Link to="/login" className="btn-login">
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Login</span>
                </Link>
                <Link to="/register" className="btn-register">
                  <i className="fas fa-user-plus"></i>
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </header>

        <main className="container">
          <Routes>
            {isAuthenticated ? (
              <>
                <Route path="/" element={<Dashboard user={user} />} />
                <Route path="/expenses" element={<ExpenseList user={user} />} />
                <Route path="/add-expense" element={<ExpenseForm user={user} />} />
                <Route path="/expenses/:id" element={<ExpenseDetails user={user} />} />
                <Route path="/analytics" element={<ExpenseAnalytics user={user} />} />
                <Route path="/reports" element={<ReportGenerator user={user} />} />
                <Route path="/tax-documents" element={<TaxDocumentGenerator user={user} />} />
                <Route path="/insurance-claims" element={<InsuranceClaimTracker user={user} />} />
                <Route path="/tax-reports" element={<TaxReport user={user} />} />
              </>
            ) : (
              <>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register onRegister={handleLogin} />} />
              </>
            )}
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} MediTrack - Medical Expense Tracker</p>
            <p>
              <small>MVP Version</small>
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
