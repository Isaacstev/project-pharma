const pool = require('../db');

const PharmacyController = {
  viewInventory: async (req, res) => {
    const { pharmacyId } = req.params;

    try {
      const result = await pool.query(
        `SELECT i.inventory_id, d.name AS drug_name, b.batch_number, i.quantity, i.sale_price 
         FROM inventory i
         JOIN drugs d ON i.drug_id = d.drug_id
         JOIN batches b ON i.batch_id = b.batch_id
         WHERE i.user_id = $1`,
        [pharmacyId]
      );

      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error fetching inventory:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },

  viewLowStock: async (req, res) => {
    const { pharmacyId } = req.params;

    try {
      const result = await pool.query(
        `SELECT i.inventory_id, d.name AS drug_name, i.quantity 
         FROM inventory i
         JOIN drugs d ON i.drug_id = d.drug_id
         WHERE i.user_id = $1 AND i.quantity < 10`,
        [pharmacyId]
      );

      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error fetching low stock drugs:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },

  viewAlmostExpiredDrugs: async (req, res) => {
    const { pharmacyId } = req.params;

    try {
      const result = await pool.query(
        `SELECT i.inventory_id, d.name AS drug_name, b.expiry_date 
         FROM inventory i
         JOIN drugs d ON i.drug_id = d.drug_id
         JOIN batches b ON i.batch_id = b.batch_id
         WHERE i.user_id = $1 AND b.expiry_date < NOW() + INTERVAL '30 days'`,
        [pharmacyId]
      );

      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error fetching almost expired drugs:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },
};

module.exports = PharmacyController;
