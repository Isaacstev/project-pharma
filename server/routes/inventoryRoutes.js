const express = require('express');
const router = express.Router();
const InventoryController = require('../controllers/inventoryController');

// Get inventory for a specific user
router.get('/:userId', InventoryController.getInventory);

// Add new inventory for a user
router.post('/:userId/add', InventoryController.addInventory);

// Sell a drug from the inventory
router.post('/:userId/sell', InventoryController.sellDrug);

// edit inventory
router.patch('/update/:inventoryId', InventoryController.updateInventory);

// View drugs that are about to expire
router.get('/:userId/almost-expired', InventoryController.viewAlmostExpired);

// Remove a drug from inventory
router.delete('/:userId/remove/:drugId', InventoryController.removeDrug);

// Get low stock inventory for a specific user
router.get('/:userId/low-stock', InventoryController.getLowStock);

// Get price history for a specific drug
router.get('/price-history/:drugId', InventoryController.getPriceHistory);

// Get wholesalers who have a specific drug in stock
router.get('/wholesalers/:drugId', InventoryController.getWholesalersForDrug);

module.exports = router;
