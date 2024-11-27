const express = require('express');
const router = express.Router();
const WholesalerController = require('../controllers/wholesalerController');

// Routes related to wholesaler inventory and management
router.get('/:wholesalerId/inventory', WholesalerController.viewInventory);
router.get('/:wholesalerId/low-stock', WholesalerController.viewLowStock);
router.get('/:wholesalerId/almost-expired', WholesalerController.viewAlmostExpired);
router.post('/:wholesalerId/add-stock', WholesalerController.addStock);
router.get('/:wholesalerId/sales-report', WholesalerController.getSalesReport);

module.exports = router;
