const handleConnection = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

async function loginUser(email, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM profiles WHERE email = ?';
        handleConnection.query(sql, [email], async (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject({ status: 404, message: 'User not found' });

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return reject({ status: 401, message: 'Invalid credentials' });

            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '10h' });
            resolve({ user, token });
        });
    });
}

module.exports = { loginUser };
