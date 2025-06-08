import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="container">
          <h1>MediTrack</h1>
          <h2>Simplify Your Medical Expense Management</h2>
          <p className="hero-text">
            Track medical expenses, manage insurance claims, and maximize tax deductions - all in one place.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-secondary">Login</Link>
          </div>
        </div>
      </div>

      <div className="features-section container">
        <h2>Why Choose MediTrack?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Expense Tracking</h3>
            <p>Easily record and organize all your medical expenses in one secure place.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Receipt Management</h3>
            <p>Upload and store receipts digitally for easy access and organization.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏥</div>
            <h3>Insurance Claims</h3>
            <p>Track the status of your insurance claims and manage reimbursements.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Tax Preparation</h3>
            <p>Generate reports for tax-deductible medical expenses to maximize your returns.</p>
          </div>
        </div>
      </div>

      <div className="how-it-works container">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Record Your Expenses</h3>
            <p>Add your medical expenses and upload receipts as you receive them.</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Track Insurance Claims</h3>
            <p>Mark expenses for insurance claims and track their status.</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Generate Tax Reports</h3>
            <p>Create detailed reports for tax-deductible medical expenses.</p>
          </div>
        </div>
      </div>

      <div className="pricing-section container">
        <h2>Simple Pricing</h2>
        <div className="pricing-cards">
          <div className="pricing-card">
            <div className="pricing-header">
              <h3>Free</h3>
              <div className="price">$0</div>
              <p>Forever</p>
            </div>
            <div className="pricing-features">
              <ul>
                <li>Basic expense tracking</li>
                <li>Manual insurance claim tracking</li>
                <li>Simple tax reports</li>
                <li>Receipt storage (limited)</li>
              </ul>
            </div>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
          
          <div className="pricing-card premium">
            <div className="pricing-header">
              <h3>Premium</h3>
              <div className="price">$9.99</div>
              <p>per month</p>
            </div>
            <div className="pricing-features">
              <ul>
                <li>Advanced expense tracking</li>
                <li>Automated claim submission</li>
                <li>Comprehensive tax reports</li>
                <li>Unlimited receipt storage</li>
                <li>Data export options</li>
                <li>Priority support</li>
              </ul>
            </div>
            <button className="btn-premium" disabled>Coming Soon</button>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="container">
          <h2>Ready to simplify your medical expense management?</h2>
          <p>Join thousands of users who trust MediTrack for their healthcare financial needs.</p>
          <Link to="/register" className="btn-primary">Get Started Now</Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
