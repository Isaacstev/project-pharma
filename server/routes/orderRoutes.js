const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

// Place an order
router.post('/place', OrderController.placeOrder);

// Get all orders for a user based on role (Pharmacy/Wholesaler)
router.get('/', OrderController.getOrders);

// Get a list of all wholesalers
router.get('/wholesalers', OrderController.getWholesalers);

// Confirm an order
router.patch('/:orderId/confirm', OrderController.confirmOrder);

// Deny an order
router.patch('/:orderId/deny', OrderController.denyOrder);

// Get sales report for Wholesalers or order report for Pharmacies
router.get('/sales-report', OrderController.getSalesReport);

module.exports = router;
