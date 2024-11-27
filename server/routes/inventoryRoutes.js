const express = require('express');
const router = express.Router();
const InventoryController = require('../controllers/inventoryController'); 

router.get('/:userId', InventoryController.getInventory);
router.post('/:userId/add', InventoryController.addInventory);
router.post('/:userId/sell', InventoryController.sellDrug);
router.get('/:userId/almost-expired', InventoryController.viewAlmostExpired);
router.delete('/:userId/remove/:drugId', InventoryController.removeDrug);
router.get('/:userId/low-stock', InventoryController.getLowStock);
router.get('/price-history/:drugId', InventoryController.getPriceHistory);
router.get('/wholesalers/:drugId', InventoryController.getWholesalersForDrug); 

module.exports = router;
