const express = require('express');
const router = express.Router();
const PharmacyController = require('../controllers/pharmacyController');

router.get('/:pharmacyId/inventory', PharmacyController.viewInventory);
router.get('/:pharmacyId/low-stock', PharmacyController.viewLowStock);
router.get('/:pharmacyId/almost-expired', PharmacyController.viewAlmostExpiredDrugs);

module.exports = router;
