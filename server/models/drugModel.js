const pool = require('../db');

const DrugModel = {
  getAllDrugs: async () => {
    const result = await pool.query(`SELECT * FROM drugs`);
    return result.rows;
  },

  addDrug: async (name, description) => {
    const result = await pool.query(
      `INSERT INTO drugs (name, description) VALUES ($1, $2) RETURNING *`,
      [name, description]
    );
    return result.rows[0];
  },
};

module.exports = DrugModel;
