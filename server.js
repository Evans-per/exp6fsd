const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const expenseRoutes = require('./routes/expenses');

const app = express();

const path = require('path');

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist')));

// Setting up MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/expense_tracker')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/expenses', expenseRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
