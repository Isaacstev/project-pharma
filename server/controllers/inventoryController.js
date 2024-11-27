const pool = require('../db');

const InventoryController = {
    getInventory: async (req, res) => {
        const { userId } = req.params;
        try {
            const result = await pool.query(
                `SELECT i.inventory_id, d.name AS drug_name, b.batch_number, i.quantity, i.sale_price 
                 FROM inventory i
                 JOIN drugs d ON i.drug_id = d.drug_id
                 JOIN batches b ON i.batch_id = b.batch_id
                 WHERE i.user_id = $1`,
                [userId]
            );
            res.status(200).json(result.rows);
        } catch (err) {
            console.error('Error fetching inventory:', err.message);
            res.status(500).json({ error: 'Server error' });
        }
    },

    addInventory: async (req, res) => {
        const { userId } = req.params;
        const {
            drugName,
            description,
            batchId,
            quantity,
            salePrice,
            manufactureDate,
            expiryDate,
        } = req.body;
    
        if (!drugName || !batchId || !quantity || !salePrice || !manufactureDate || !expiryDate) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
    
        try {
            const client = await pool.connect();
            await client.query('BEGIN');
    
            
            let drugResult = await client.query(
                `SELECT drug_id FROM drugs WHERE name = $1`,
                [drugName]
            );
    
            let drugId;
            if (drugResult.rows.length > 0) {
                drugId = drugResult.rows[0].drug_id;
            } else {
                const newDrug = await client.query(
                    `INSERT INTO drugs (name, description) VALUES ($1, $2) RETURNING drug_id`,
                    [drugName, description]
                );
                drugId = newDrug.rows[0].drug_id;
            }
    
            // Check if the batch exists or insert a new batch
            let batchResult = await client.query(
                `SELECT batch_id FROM batches WHERE batch_number = $1 AND drug_id = $2`,
                [batchId, drugId]
            );
    
            let finalBatchId;
            if (batchResult.rows.length > 0) {
                finalBatchId = batchResult.rows[0].batch_id;
            } else {
                const newBatch = await client.query(
                    `INSERT INTO batches (batch_number, drug_id, manufacture_date, expiry_date)
                     VALUES ($1, $2, $3, $4) RETURNING batch_id`,
                    [batchId, drugId, manufactureDate, expiryDate]
                );
                finalBatchId = newBatch.rows[0].batch_id;
            }
    
            // Insert inventory
            const inventoryResult = await client.query(
                `INSERT INTO inventory (user_id, drug_id, batch_id, quantity, sale_price)
                 VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [userId, drugId, finalBatchId, quantity, salePrice]
            );
    
            await client.query('COMMIT');
            client.release();
    
            res.status(201).json(inventoryResult.rows[0]);
        } catch (err) {
            console.error('Error adding inventory:', err.message);
            res.status(500).json({ error: 'Server error' });
        }
    },
    

    getLowStock: async (req, res) => {
        const { userId } = req.params;
        try {
            const result = await pool.query(
                `SELECT i.inventory_id, d.name AS drug_name, i.quantity 
                 FROM inventory i
                 JOIN drugs d ON i.drug_id = d.drug_id
                 WHERE i.user_id = $1 AND i.quantity < 10`,
                [userId]
            );
            res.status(200).json(result.rows);
        } catch (err) {
            console.error('Error fetching low stock inventory:', err.message);
            res.status(500).json({ error: 'Server error' });
        }
    },

    getPriceHistory: async (req, res) => {
        const { drugId } = req.params;
        try {
            const result = await pool.query(
                `SELECT * FROM price_history 
                 WHERE drug_id = $1 
                 ORDER BY change_date DESC`,
                [drugId]
            );
            res.status(200).json(result.rows);
        } catch (err) {
            console.error('Error fetching price history:', err.message);
            res.status(500).json({ error: 'Server error' });
        }
    },
    getWholesalersForDrug: async (req, res) => {
      const { drugId } = req.params;
      try {
          const result = await pool.query(
              `SELECT u.name, i.sale_price, i.user_id 
               FROM inventory i
               JOIN users u ON i.user_id = u.user_id
               WHERE i.drug_id = $1`,
              [drugId]
          );
          res.status(200).json(result.rows);
      } catch (err) {
          console.error('Error fetching wholesalers:', err.message);
          res.status(500).json({ error: 'Server error' });
      }
  },

  removeDrug: async (req, res) => {
    const { userId, inventoryId } = req.params;

    if (!inventoryId) {
        return res.status(400).json({ error: 'Inventory ID is required' });
    }

    try {
        const result = await pool.query(
            `DELETE FROM inventory WHERE inventory_id = $1 AND user_id = $2 RETURNING *`,
            [inventoryId, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Drug not found or unauthorized' });
        }

        res.status(200).json({ message: 'Drug removed successfully' });
    } catch (err) {
        console.error('Error removing drug:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
},

sellDrug: async (req, res) => {
    const { userId } = req.params;
    const { drugId, quantity } = req.body;

    try {
        const result = await pool.query(
            `UPDATE inventory 
             SET quantity = quantity - $1 
             WHERE user_id = $2 AND drug_id = $3 AND quantity >= $1
             RETURNING *`,
            [quantity, userId, drugId]
        );

        if (result.rowCount === 0) {
            return res.status(400).json({ error: 'Insufficient stock or drug not found' });
        }

        res.status(200).json({ message: 'Drug sold successfully', inventory: result.rows[0] });
    } catch (err) {
        console.error('Error selling drug:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
},

viewAlmostExpired: async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query(
            `SELECT i.inventory_id, d.name AS drug_name, b.batch_number, b.expiry_date 
             FROM inventory i
             JOIN drugs d ON i.drug_id = d.drug_id
             JOIN batches b ON i.batch_id = b.batch_id
             WHERE i.user_id = $1 AND b.expiry_date < NOW() + INTERVAL '30 days'
             ORDER BY b.expiry_date ASC`,
            [userId]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching almost expired drugs:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
},

};

module.exports = InventoryController;
