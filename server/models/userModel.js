const pool = require('../db');

const UserModel = {
  findUserByEmail: async (email) => {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  },

  createUser: async (name, email, password, phone, address, roleId) => {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone, address, role_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, email, password, phone, address, roleId]
    );
    return result.rows[0];
  },
};

module.exports = UserModel;
