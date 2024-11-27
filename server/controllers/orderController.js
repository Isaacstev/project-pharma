const pool = require('../db');

const OrderController = {
  placeOrder: async (req, res) => {
    const { pharmacyId, wholesalerId, drugName, quantity, paymentMethod } = req.body;

    try {
      const client = await pool.connect();
      await client.query('BEGIN');

      // Check if the drug exists in the database
      let drugResult = await client.query(
        `SELECT drug_id FROM drugs WHERE name = $1`,
        [drugName]
      );
      let drugId;

      if (drugResult.rows.length > 0) {
        drugId = drugResult.rows[0].drug_id;
      } else {
        // Insert the drug into the database if it doesn't exist
        const insertDrugResult = await client.query(
          `INSERT INTO drugs (name) VALUES ($1) RETURNING drug_id`,
          [drugName]
        );
        drugId = insertDrugResult.rows[0].drug_id;
      }

      // Fetch the batch_id and unit_price for the drug from inventory
      const batchResult = await client.query(
        `SELECT batch_id, sale_price AS unit_price 
         FROM inventory 
         WHERE user_id = $1 AND drug_id = $2 LIMIT 1`,
        [wholesalerId, drugId]
      );

      if (batchResult.rows.length === 0) {
        throw new Error('No batch available for the selected drug and wholesaler.');
      }

      const { batch_id, unit_price } = batchResult.rows[0];

      // Calculate the subtotal
      const subtotal = unit_price * quantity;

      // Insert the order into the orders table
      const orderResult = await client.query(
        `INSERT INTO orders (pharmacy_id, wholesaler_id, status, payment_method)
         VALUES ($1, $2, 'Pending', $3) RETURNING order_id`,
        [pharmacyId, wholesalerId, paymentMethod]
      );
      const orderId = orderResult.rows[0].order_id;

      // Insert the order item into the order_items table with the calculated subtotal
      await client.query(
        `INSERT INTO order_items (order_id, drug_id, batch_id, quantity, unit_price, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, drugId, batch_id, quantity, unit_price, subtotal]
      );

      await client.query('COMMIT');
      client.release();

      res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (err) {
      console.error('Error placing order:', err.message);
      res.status(500).json({ error: err.message || 'Server error' });
    }
  },

  getWholesalers: async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT user_id, name FROM users WHERE role_id = 2`
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching wholesalers:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
},


getOrders: async (req, res) => {
  const { userId, role } = req.query;

  try {
      let query;
      if (role === 'Pharmacy') {
          query = `SELECT o.order_id, d.name AS drug_name, oi.quantity, o.status, o.payment_method
                   FROM orders o
                   JOIN order_items oi ON o.order_id = oi.order_id
                   JOIN drugs d ON oi.drug_id = d.drug_id
                   WHERE o.pharmacy_id = $1`;
      } else if (role === 'Wholesaler') {
          query = `SELECT o.order_id, d.name AS drug_name, oi.quantity, o.status, o.payment_method, o.pharmacy_id
                   FROM orders o
                   JOIN order_items oi ON o.order_id = oi.order_id
                   JOIN drugs d ON oi.drug_id = d.drug_id
                   WHERE o.wholesaler_id = $1`;
      } else {
          return res.status(400).json({ error: 'Invalid role' });
      }

      const result = await pool.query(query, [userId]);
      res.status(200).json(result.rows);
  } catch (err) {
      console.error('Error fetching orders:', err.message);
      res.status(500).json({ error: 'Server error' });
  }
},


  confirmOrder: async (req, res) => {
    const { orderId } = req.params;

    try {
      const client = await pool.connect();
      await client.query('BEGIN');

      // Update the order status to 'Confirmed'
      await client.query(
        `UPDATE orders SET status = 'Confirmed' WHERE order_id = $1`,
        [orderId]
      );

      await client.query('COMMIT');
      client.release();

      res.status(200).json({ message: 'Order confirmed successfully' });
    } catch (err) {
      console.error('Error confirming order:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },

  denyOrder: async (req, res) => {
    const { orderId } = req.params;

    try {
      const client = await pool.connect();
      await client.query('BEGIN');

      // Update the order status to 'Denied'
      await client.query(
        `UPDATE orders SET status = 'Denied' WHERE order_id = $1`,
        [orderId]
      );

      await client.query('COMMIT');
      client.release();

      res.status(200).json({ message: 'Order denied successfully' });
    } catch (err) {
      console.error('Error denying order:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }, 
};

module.exports = OrderController;
