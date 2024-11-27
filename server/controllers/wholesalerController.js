const pool = require('../db');

const WholesalerController = {
  viewInventory: async (req, res) => {
    try {
      const { wholesalerId } = req.params;
      const result = await pool.query(
        `SELECT i.inventory_id, d.name AS drug_name, i.quantity, i.sale_price
         FROM inventory i
         JOIN drugs d ON i.drug_id = d.drug_id
         WHERE i.user_id = $1`,
        [wholesalerId]
      );
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error fetching inventory:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },

  viewLowStock: async (req, res) => {
    try {
      const { wholesalerId } = req.params;
      const lowStockThreshold = 10;
      const result = await pool.query(
        `SELECT i.inventory_id, d.name AS drug_name, i.quantity
         FROM inventory i
         JOIN drugs d ON i.drug_id = d.drug_id
         WHERE i.user_id = $1 AND i.quantity < $2`,
        [wholesalerId, lowStockThreshold]
      );
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error fetching low stock:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },

  viewAlmostExpired: async (req, res) => {
    try {
      const { wholesalerId } = req.params;
      const result = await pool.query(
        `SELECT i.inventory_id, d.name AS drug_name, b.batch_number, b.expiry_date
         FROM inventory i
         JOIN drugs d ON i.drug_id = d.drug_id
         JOIN batches b ON i.batch_id = b.batch_id
         WHERE i.user_id = $1 AND b.expiry_date < NOW() + INTERVAL '30 days'`,
        [wholesalerId]
      );
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error fetching almost expired drugs:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },

  addStock: async (req, res) => {
    try {
      const { wholesalerId } = req.params;
      const { drugId, batchId, quantity, salePrice } = req.body;
      const result = await pool.query(
        `INSERT INTO inventory (user_id, drug_id, batch_id, quantity, sale_price)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [wholesalerId, drugId, batchId, quantity, salePrice]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error adding stock:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },

  getSalesReport: async (req, res) => {
    try {
      const { wholesalerId } = req.params;
      const { startDate, endDate } = req.query;
      const result = await pool.query(
        `SELECT * FROM sales
         WHERE wholesaler_id = $1 AND sale_date BETWEEN $2 AND $3`,
        [wholesalerId, startDate, endDate]
      );
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error fetching sales report:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },


  confirmOrder: async (req, res) => {
    try {
      const { orderId } = req.params;
      const client = await pool.connect();

      try {
        await client.query('BEGIN');
        const orderResult = await client.query(
          `UPDATE orders SET status = 'Completed' WHERE order_id = $1 RETURNING *`,
          [orderId]
        );

        const order = orderResult.rows[0];
        if (!order) {
          throw new Error('Order not found');
        }

        const itemsResult = await client.query(
          `SELECT * FROM order_items WHERE order_id = $1`,
          [orderId]
        );

        for (const item of itemsResult.rows) {
          await client.query(
            `UPDATE inventory SET quantity = quantity - $1
             WHERE user_id = $2 AND drug_id = $3 AND batch_id = $4`,
            [item.quantity, order.wholesaler_id, item.drug_id, item.batch_id]
          );
        }

        await client.query('COMMIT');
        res.status(200).json({ message: 'Order confirmed successfully' });
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('Error confirming order:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },
};

module.exports = WholesalerController;
