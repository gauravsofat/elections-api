// Deps
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

// Database config
const db = require('./config/database');

// Routes imports
const candidate = require('./routes/candidate');
const committee = require('./routes/committee');
const login = require('./routes/login');
const result = require('./routes/result');
const vote = require('./routes/vote');
const verifyToken = require('./routes/verifyToken');

// DotENV initialisation
require('dotenv').config();

db.on('error', console.log.bind(console, 'MongoDB Error:'));
db.on('connected', () => {
  console.log('Connected To DB!');
});

// Initialize express
const app = express();

// Sanitize Data
app.use(helmet());

// Custom Request Logging
app.use(morgan('tiny'));

// JSON Payload Parser
app.use(express.json());

// CORS
app.use(cors());

// Routes
app.use('/candidate', candidate);
app.use('/committee', committee);
app.use('/login', login);
app.use('/result', result);
app.use('/vote', vote);
app.use('/verifyToken', verifyToken);

// Error handling
app.use((err, req, res) => {
  return res
    .status(500)
    .json({ message: 'Uncaught Internal Server Error, Something Broke.' });
});

module.exports = app;
