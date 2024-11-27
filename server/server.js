const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const wholesalerRoutes = require('./routes/wholesalerRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware for debugging purposes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);             // Authentication routes
app.use('/api/pharmacy', pharmacyRoutes);     // Pharmacy-specific routes
app.use('/api/wholesaler', wholesalerRoutes); // Wholesaler-specific routes
app.use('/api/inventory', inventoryRoutes);   // Inventory management routes
app.use('/api/orders', orderRoutes);          // Order management routes

// Fallback route for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
