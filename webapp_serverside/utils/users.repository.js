const pool = require('./db.include');

module.exports = {
    async findUserByUsername(username) {
        const [rows] = await pool.query('SELECT * FROM user_ WHERE userName = ?', [username]);
        return rows[0];
    },

    async createUser(username, email, hashedPassword) {
        await pool.query(
            'INSERT INTO user_ (userName, userEmail, userPassword) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
    },
    async getUserData(userId) {
        const [rows] = await pool.query('SELECT * FROM user_ WHERE id_user = ?', [userId]);
        console.log("🔍 User data retrieved:", rows);
        return rows[0];
    }
};