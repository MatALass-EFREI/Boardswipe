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
    },
    async getUserSwipeData(userId) {
        const [rows] = await pool.query(`
        SELECT s.id_game, s.result, g.gameName
        FROM swipe s
        JOIN game g ON s.id_game = g.id_game
        WHERE s.id_user = ?
    `, [userId]);
        console.log("🔍 User swipe data with game names retrieved:", rows);
        return rows; // Return all rows as an array
    },
    async updateUserDescription(userId, description) {
        await pool.query('UPDATE user_ SET userDescription = ? WHERE id_user = ?', [description, userId]);
    },
};