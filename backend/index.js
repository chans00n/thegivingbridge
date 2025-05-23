// require('dotenv').config(); // TEMP COMMENT OUT

const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();
const port = process.env.PORT || 3001; // Use environment variable for port

const { getClassyAppAccessToken } = require('./classyService'); // Import the Classy service
const https = require('https');

// --- Database Placeholder ---
// const { Pool } = require('pg');
// const pool = new Pool({
//   user: process.env.DB_USER,       // From .env
//   host: process.env.DB_HOST,       // From .env
//   database: process.env.DB_NAME,     // From .env
//   password: process.env.DB_PASSWORD, // From .env
//   port: process.env.DB_PORT,       // From .env or default 5432
// });
// --- End Database Placeholder ---

// Middleware
// app.use(cors()); // TEMP COMMENT OUT
// app.use(express.json()); // TEMP COMMENT OUT
// app.use(express.urlencoded({ extended: true })); // TEMP COMMENT OUT

// Import classyService methods
// const classyService = require('./classyService'); // TEMP COMMENT OUT

app.get('/', (req, res) => {
  res.send('Minimal Hello World from Express Backend!');
});

// TEMP COMMENT OUT ALL OTHER ROUTES

app.listen(port, () => {
  console.log(`Minimal Backend server listening on port ${port}`);
}); 