const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

// Routes related to order placement and management
router.post('/place', OrderController.placeOrder); // Place a new order
router.get('/', OrderController.getOrders); // Fetch orders for a specific user
router.get('/wholesalers', OrderController.getWholesalers); // Get all wholesalers
router.patch('/:orderId/confirm', OrderController.confirmOrder); // Confirm order
router.patch('/:orderId/deny', OrderController.denyOrder); // Deny order

module.exports = router;
