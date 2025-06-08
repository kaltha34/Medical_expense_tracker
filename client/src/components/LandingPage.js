import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
    
    // Add scroll event listener for animations
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('visible');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="landing-page">
      <div className={`hero-section ${isVisible ? 'fade-in' : ''}`}>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Medi<span className="text-highlight">Track</span></h1>
            <h2 className="hero-subtitle">Simplify Your Medical Expense Management</h2>
            <p className="hero-text">
              Track medical expenses, manage insurance claims, and maximize tax deductions - all in one place.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">User Satisfaction</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">30%</span>
                <span className="stat-label">Average Tax Savings</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5min</span>
                <span className="stat-label">Setup Time</span>
              </div>
            </div>
            <div className="hero-buttons">
              <Link to="/register" className="btn-primary">
                <span>Get Started</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
              <Link to="/login" className="btn-secondary">
                <i className="fas fa-user"></i>
                <span>Login</span>
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="dashboard-preview-container">
              <div className="dashboard-preview-mockup">
                <div className="mockup-header">
                  <div className="mockup-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="mockup-title">MediTrack Dashboard</div>
                </div>
                <div className="mockup-content">
                  <div className="mockup-card"></div>
                  <div className="mockup-card"></div>
                  <div className="mockup-stats">
                    <div className="mockup-stat-bar"></div>
                    <div className="mockup-stat-bar"></div>
                    <div className="mockup-stat-bar"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="floating-element receipt-icon">
              <i className="fas fa-receipt"></i>
            </div>
            <div className="floating-element chart-icon">
              <i className="fas fa-chart-pie"></i>
            </div>
            <div className="floating-element tax-icon">
              <i className="fas fa-file-invoice-dollar"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section container">
        <div className="section-header animate-on-scroll">
          <span className="section-tag">Features</span>
          <h2>Why Choose <span className="text-highlight">MediTrack</span>?</h2>
          <p className="section-description">Our comprehensive platform is designed to simplify every aspect of your medical expense management</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card animate-on-scroll">
            <div className="feature-icon expense-icon">
              <i className="fas fa-file-invoice-dollar"></i>
            </div>
            <h3>Expense Tracking</h3>
            <p>Easily record and organize all your medical expenses in one secure place with customizable categories.</p>
            <div className="feature-hover">
              <span className="learn-more">Learn more <i className="fas fa-arrow-right"></i></span>
            </div>
          </div>
          
          <div className="feature-card animate-on-scroll">
            <div className="feature-icon receipt-icon">
              <i className="fas fa-receipt"></i>
            </div>
            <h3>Receipt Management</h3>
            <p>Upload and store receipts digitally with OCR technology to automatically extract key information.</p>
            <div className="feature-hover">
              <span className="learn-more">Learn more <i className="fas fa-arrow-right"></i></span>
            </div>
          </div>
          
          <div className="feature-card animate-on-scroll">
            <div className="feature-icon insurance-icon">
              <i className="fas fa-hospital-user"></i>
            </div>
            <h3>Insurance Claims</h3>
            <p>Track the status of your insurance claims, set reminders for follow-ups, and manage reimbursements.</p>
            <div className="feature-hover">
              <span className="learn-more">Learn more <i className="fas fa-arrow-right"></i></span>
            </div>
          </div>
          
          <div className="feature-card animate-on-scroll">
            <div className="feature-icon tax-icon">
              <i className="fas fa-chart-pie"></i>
            </div>
            <h3>Tax Preparation</h3>
            <p>Generate comprehensive reports for tax-deductible medical expenses with year-over-year analysis.</p>
            <div className="feature-hover">
              <span className="learn-more">Learn more <i className="fas fa-arrow-right"></i></span>
            </div>
          </div>
        </div>
      </div>

      <div className="how-it-works container">
        <div className="section-header animate-on-scroll">
          <span className="section-tag">Process</span>
          <h2>How It <span className="text-highlight">Works</span></h2>
          <p className="section-description">Get started in minutes with our simple three-step process</p>
        </div>
        
        <div className="steps-container">
          <div className="steps-timeline"></div>
          
          <div className="steps">
            <div className="step animate-on-scroll">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Record Your Expenses</h3>
                <p>Add your medical expenses and upload receipts as you receive them.</p>
                <div className="step-icon">
                  <i className="fas fa-file-medical"></i>
                </div>
                <ul className="step-features">
                  <li><i className="fas fa-check"></i> Quick expense entry</li>
                  <li><i className="fas fa-check"></i> Receipt scanning</li>
                  <li><i className="fas fa-check"></i> Auto-categorization</li>
                </ul>
              </div>
            </div>
            
            <div className="step animate-on-scroll">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Track Insurance Claims</h3>
                <p>Mark expenses for insurance claims and track their status.</p>
                <div className="step-icon">
                  <i className="fas fa-clipboard-check"></i>
                </div>
                <ul className="step-features">
                  <li><i className="fas fa-check"></i> Status tracking</li>
                  <li><i className="fas fa-check"></i> Reimbursement alerts</li>
                  <li><i className="fas fa-check"></i> Follow-up reminders</li>
                </ul>
              </div>
            </div>
            
            <div className="step animate-on-scroll">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Generate Tax Reports</h3>
                <p>Create detailed reports for tax-deductible medical expenses.</p>
                <div className="step-icon">
                  <i className="fas fa-file-invoice"></i>
                </div>
                <ul className="step-features">
                  <li><i className="fas fa-check"></i> IRS-ready formats</li>
                  <li><i className="fas fa-check"></i> Year-end summaries</li>
                  <li><i className="fas fa-check"></i> Multiple export options</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pricing-section container">
        <div className="section-header animate-on-scroll">
          <span className="section-tag">Pricing</span>
          <h2>Simple <span className="text-highlight">Pricing</span></h2>
          <p className="section-description">Choose the plan that works best for your needs</p>
        </div>
        
        <div className="pricing-toggle animate-on-scroll">
          <span className="toggle-option active">Monthly</span>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
          <span className="toggle-option">Annual <span className="save-badge">Save 20%</span></span>
        </div>
        
        <div className="pricing-cards">
          <div className="pricing-card animate-on-scroll">
            <div className="pricing-badge">Popular</div>
            <div className="pricing-header">
              <h3>Free</h3>
              <div className="price">LKR 0</div>
              <p>Forever</p>
            </div>
            <div className="pricing-features">
              <ul>
                <li><i className="fas fa-check"></i> Basic expense tracking</li>
                <li><i className="fas fa-check"></i> Manual insurance claim tracking</li>
                <li><i className="fas fa-check"></i> Simple tax reports</li>
                <li><i className="fas fa-check"></i> Receipt storage (limited)</li>
                <li className="feature-disabled"><i className="fas fa-times"></i> Advanced analytics</li>
                <li className="feature-disabled"><i className="fas fa-times"></i> Priority support</li>
              </ul>
            </div>
            <Link to="/register" className="btn-primary btn-full">
              <span>Get Started</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          
          <div className="pricing-card premium animate-on-scroll">
            <div className="pricing-badge">Premium</div>
            <div className="pricing-header">
              <h3>Premium</h3>
              <div className="price">LKR 1,999</div>
              <p>per month</p>
            </div>
            <div className="pricing-features">
              <ul>
                <li><i className="fas fa-check"></i> Advanced expense tracking</li>
                <li><i className="fas fa-check"></i> Automated claim submission</li>
                <li><i className="fas fa-check"></i> Comprehensive tax reports</li>
                <li><i className="fas fa-check"></i> Unlimited receipt storage</li>
                <li><i className="fas fa-check"></i> Data export options</li>
                <li><i className="fas fa-check"></i> Priority support</li>
              </ul>
            </div>
            <button className="btn-premium btn-full" disabled>
              <span>Coming Soon</span>
              <i className="fas fa-rocket"></i>
            </button>
            <div className="pricing-note">Early access coming Q3 2025</div>
          </div>
        </div>
        
        <div className="pricing-guarantee animate-on-scroll">
          <i className="fas fa-shield-alt"></i>
          <p>30-day money-back guarantee. No questions asked.</p>
        </div>
      </div>

      <div className="cta-section">
        <div className="container">
          <div className="cta-content animate-on-scroll">
            <h2>Ready to simplify your medical expense management?</h2>
            <p>Join thousands of users who trust MediTrack for their healthcare financial needs.</p>
            
            <div className="cta-stats">
              <div className="cta-stat">
                <span className="stat-value">10,000+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="cta-stat">
                <span className="stat-value">LKR 500M+</span>
                <span className="stat-label">Tax Savings</span>
              </div>
              <div className="cta-stat">
                <span className="stat-value">4.9/5</span>
                <span className="stat-label">User Rating</span>
              </div>
            </div>
            
            <div className="cta-actions">
              <Link to="/register" className="btn-primary btn-large">
                <span>Get Started Now</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
              <a href="#demo" className="btn-secondary btn-large">
                <i className="fas fa-play-circle"></i>
                <span>Watch Demo</span>
              </a>
            </div>
            
            <div className="cta-testimonial">
              <div className="testimonial-avatar">
                <div className="avatar-placeholder"><i className="fas fa-user-circle"></i></div>
              </div>
              <div className="testimonial-content">
                <p>"MediTrack has saved me hours of time and hundreds of dollars in tax deductions I would have missed."</p>
                <div className="testimonial-author">Sarah J. - Healthcare Professional</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
