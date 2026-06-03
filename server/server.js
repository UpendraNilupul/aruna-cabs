const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ─── MIDDLEWARE (Crucial for React connection) ───
app.use(cors()); // Allows your React app to talk to this backend
app.use(express.json()); // Allows the backend to read the form data

// ─── ROUTES ───
app.use('/api/auth', require('./routes/auth')); // Links to our new auth.js file

// ─── DATABASE CONNECTION ───
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('Database connection error:', err));

// ─── START SERVER ───
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));