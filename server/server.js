// server/server.js

const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL connection pool setup
const pool = new Pool({
  user: process.env.PG_USER, // Replace with your PostgreSQL user
  host: process.env.PG_HOST, // Replace with your PostgreSQL host
  database: process.env.PG_DATABASE, // Replace with your PostgreSQL database
  password: process.env.PG_PASSWORD, // Replace with your PostgreSQL password
  port: process.env.PG_PORT, // Replace with your PostgreSQL port, e.g., 5432
});

// Test PostgreSQL connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('PostgreSQL Connected:', result.rows);
  });
});

// Middleware
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('Welcome to Pharma Procurement Automation System!');
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
