const pool = require('./db.include');

module.exports = {
    async getGamesSortedBy(column, order = 'ASC') {
        try {
            const validColumns = ['gameName', 'gameYearPublished', 'avgRating'];
            if (!validColumns.includes(column)) {
                throw new Error(`Invalid column for sorting: ${column}`);
            }

            const validOrders = ['ASC', 'DESC'];
            if (!validOrders.includes(order.toUpperCase())) {
                throw new Error(`Invalid order: ${order}`);
            }

            const sql = `
                SELECT id_game AS id, gameName AS name, gameYearPublished AS releaseDate, avgRating AS rating
                FROM game
                ORDER BY ${column} ${order.toUpperCase()}
            `;
            const [rows] = await pool.execute(sql);
            console.log("SQL Query:", sql);
            return rows;
        } catch (err) {
            console.error("Error in getGamesSortedBy:", err);
            throw err;
        }
    }
};