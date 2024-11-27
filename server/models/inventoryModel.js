const pool = require('../db');

const InventoryModel = {
  getInventoryByUser: async (userId) => {
    const result = await pool.query(
      `SELECT * FROM inventory WHERE user_id = $1`,
      [userId]
    );
    return result.rows;
  },

  addInventory: async (userId, drugId, batchId, quantity, salePrice) => {
    const result = await pool.query(
      `INSERT INTO inventory (user_id, drug_id, batch_id, quantity, sale_price)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, drugId, batchId, quantity, salePrice]
    );
    return result.rows[0];
  },
};

module.exports = InventoryModel;
