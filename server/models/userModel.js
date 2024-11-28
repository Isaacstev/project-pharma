const pool = require('../db');

const UserModel = {
  findUserByEmail: async (email) => {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
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

  findUserById: async (userId) => {
    const result = await pool.query(
      `SELECT u.user_id, u.name, u.email, u.phone, u.address, r.role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.role_id 
       WHERE u.user_id = $1`,
      [userId]
    );
    return result.rows[0];
  },
};

module.exports = UserModel;
