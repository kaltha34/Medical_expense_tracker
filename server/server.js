const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory data store (for MVP only)
// In a production app, this would be replaced with a database
const data = {
  users: [],
  expenses: [],
};

// API Routes
// User routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if user already exists
  const existingUser = data.users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password, // In a real app, this would be hashed
  };
  
  data.users.push(newUser);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = data.users.find(user => user.email === email);
  
  // Check if user exists and password matches
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Expense routes
app.get('/api/expenses', (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  
  const userExpenses = data.expenses.filter(expense => expense.userId === userId);
  res.json(userExpenses);
});

app.post('/api/expenses', (req, res) => {
  const expense = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  
  data.expenses.push(expense);
  res.status(201).json(expense);
});

app.get('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  const expense = data.expenses.find(expense => expense.id === id);
  
  if (!expense) {
    return res.status(404).json({ message: 'Expense not found' });
  }
  
  res.json(expense);
});

app.put('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  const expenseIndex = data.expenses.findIndex(expense => expense.id === id);
  
  if (expenseIndex === -1) {
    return res.status(404).json({ message: 'Expense not found' });
  }
  
  data.expenses[expenseIndex] = {
    ...data.expenses[expenseIndex],
    ...req.body,
    id, // Ensure ID doesn't change
  };
  
  res.json(data.expenses[expenseIndex]);
});

app.delete('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  const expenseIndex = data.expenses.findIndex(expense => expense.id === id);
  
  if (expenseIndex === -1) {
    return res.status(404).json({ message: 'Expense not found' });
  }
  
  data.expenses.splice(expenseIndex, 1);
  res.json({ message: 'Expense deleted successfully' });
});

// For production, serve static files from the React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
