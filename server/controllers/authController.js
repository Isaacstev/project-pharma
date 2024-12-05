const bcrypt = require('bcrypt');
const pool = require('../db');

const AuthController = {
    login: async (req, res) => {
        const { email, password } = req.body;
    
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
    
        try {
            const result = await pool.query(
                `SELECT u.user_id, u.password, r.role_name 
                 FROM users u 
                 JOIN roles r ON u.role_id = r.role_id 
                 WHERE u.email = $1`,
                [email]
            );
    
            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
    
            const user = result.rows[0];
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
    
            res.status(200).json({
                message: 'Login successful',
                role: user.role_name,
                userId: user.user_id,
            });
        } catch (err) {
            console.error('Login error:', err.message);
            res.status(500).json({ error: 'Server error' });
        }
    },    

    signUp: async (req, res) => {
        const { name, email, password, phone, address, role } = req.body;

        if (!name || !email || !password || !phone || !address || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Fetch role_id based on role name
            const roleResult = await pool.query(`SELECT role_id FROM roles WHERE role_name = $1`, [
                role,
            ]);
            if (roleResult.rows.length === 0) {
                return res.status(400).json({ error: 'Invalid role' });
            }

            const roleId = roleResult.rows[0].role_id;

            // Insert user into the database
            const result = await pool.query(
                `INSERT INTO users (name, email, password, phone, address, role_id) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [name, email, hashedPassword, phone, address, roleId]
            );

            res.status(201).json({
                message: 'User registered successfully',
                user: result.rows[0],
            });
        } catch (err) {
            console.error('Sign-up error:', err.message);
            res.status(500).json({ error: 'Server error' });
        }
    },
};

module.exports = AuthController;
