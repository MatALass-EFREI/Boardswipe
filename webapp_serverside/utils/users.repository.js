const pool = require('./db.include');

module.exports = {
    async findUserByUsername(username) {
        const [rows] = await pool.query('SELECT * FROM user_ WHERE userName = ?', [username]);
        return rows[0];
    },

    async createUser(username, email, hashedPassword) {
        try {
            await pool.query('CALL AddNewUser(?, ?, ?, ?)', [username, email, hashedPassword, 'user']);
        } catch (error) {
            console.error('Error in createUser:', error);
            throw error;
        }
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
        try {
            await pool.query('CALL UpdateUserDescription(?, ?)', [userId, description]);
        } catch (error) {
            console.error('Error in updateUserDescription:', error);
            throw error;
        }
    }

};