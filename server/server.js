// 1. DNS FIX (Must be at the very top!)
// This bypasses local ISP blocks to prevent the "10000ms timeout" MongoDB Atlas bug.
const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1', '8.8.8.8']);

// 2. DEPENDENCIES
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 3. INITIALIZE APP
const app = express();

// 4. MIDDLEWARE
app.use(cors()); // Allows React frontend to communicate with this backend
app.use(express.json()); // Allows backend to read JSON form data

// 5. ROUTES
// Important: Make sure your React frontend is fetching from /api/auth/login and /api/auth/register
app.use('/api/auth', require('./routes/auth'));

// 6. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => console.error('❌ Database connection error:', err));

// 7. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});