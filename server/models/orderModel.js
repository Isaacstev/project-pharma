const pool = require('../db');

const OrderModel = {
  createOrder: async (pharmacyId, wholesalerId, paymentMethod) => {
    const result = await pool.query(
      `INSERT INTO orders (pharmacy_id, wholesaler_id, payment_method)
       VALUES ($1, $2, $3) RETURNING *`,
      [pharmacyId, wholesalerId, paymentMethod]
    );
    return result.rows[0];
  },

  getOrdersByUser: async (userId, role) => {
    let query;
    if (role === 'Pharmacy') {
      query = `SELECT * FROM orders WHERE pharmacy_id = $1`;
    } else {
      query = `SELECT * FROM orders WHERE wholesaler_id = $1`;
    }

    const result = await pool.query(query, [userId]);
    return result.rows;
  },
};

module.exports = OrderModel;
