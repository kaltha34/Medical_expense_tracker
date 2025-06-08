import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    
    // For MVP, we'll simulate authentication
    // In a real app, this would make an API call to authenticate
    
    // Check if user exists in localStorage (for demo purposes)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === formData.email);
    
    if (user && user.password === formData.password) {
      // Successful login
      onLogin({
        id: user.id,
        name: user.name,
        email: user.email
      });
    } else {
      // For demo purposes, allow login with any credentials
      // This would be removed in a real application
      const demoUser = {
        id: 'demo-user',
        name: 'Demo User',
        email: formData.email
      };
      
      onLogin(demoUser);
      
      // In a real app, you would show an error instead:
      // setError('Invalid email or password');
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-form card">
        <h2>Login to MediTrack</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="btn-primary">Login</button>
        </form>
        
        <div className="form-footer">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
          <p><small>Note: For this MVP, any credentials will work.</small></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
