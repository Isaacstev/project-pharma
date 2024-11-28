const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

// Routes related to order placement and management
router.post('/place', OrderController.placeOrder); 
router.get('/', OrderController.getOrders);
router.get('/wholesalers', OrderController.getWholesalers); 
router.patch('/:orderId/confirm', OrderController.confirmOrder); 
router.patch('/:orderId/deny', OrderController.denyOrder); 
module.exports = router;
