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
          <div className="container">
            <h1>MediTrack</h1>
            <p>Your Medical Expense Tracker</p>
            {isAuthenticated ? (
              <nav className="main-nav">
                <ul>
                  <li><Link to="/"><i className="fas fa-home"></i> Dashboard</Link></li>
                  <li><Link to="/expenses"><i className="fas fa-list"></i> Expenses</Link></li>
                  <li><Link to="/add-expense"><i className="fas fa-plus-circle"></i> Add Expense</Link></li>
                  <li><Link to="/analytics"><i className="fas fa-chart-pie"></i> Analytics</Link></li>
                  <li><Link to="/reports"><i className="fas fa-file-alt"></i> Reports</Link></li>
                  <li><Link to="/tax-documents"><i className="fas fa-file-invoice-dollar"></i> Tax Documents</Link></li>
                  <li><Link to="/insurance-claims"><i className="fas fa-file-medical"></i> Insurance Claims</Link></li>
                  <li><button onClick={handleLogout} className="btn-logout"><i className="fas fa-sign-out-alt"></i> Logout</button></li>
                </ul>
              </nav>
            ) : (
              <div className="auth-nav">
                <Link to="/login" className="btn-primary">Login</Link>
                <Link to="/register" className="btn-secondary">Register</Link>
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
