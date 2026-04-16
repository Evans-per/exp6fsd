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

// Bulletproof Serverless MongoDB Connection
const connectDB = async () => {
    // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    if (mongoose.connections[0].readyState) {
        return;
    }
    if (!process.env.MONGO_URI) {
        throw new Error("🚨 FATAL VERCEL ERROR: MONGO_URI ENVIRONMENT VARIABLE IS COMPLETELY MISSING!");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected securely');
};

// Ensure DB connects before any API requests proceed
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        return res.status(500).json({ error: "Database setup failed", details: err.message });
    }
});

// Routes
app.use('/api/expenses', expenseRoutes);

// Run server locally only if not on Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

// Export for Vercel
module.exports = app;
