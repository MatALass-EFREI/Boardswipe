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
    },
    async getGameById(id) {
        try {
            const sql = `
                SELECT id_game AS id, gameName AS name, gameDescription AS description,
                       gameYearPublished AS releaseDate, avgRating AS rating,
                       gameMinPlayers AS minPlayers, gameMaxPlayers AS maxPlayers,
                       gamePlayingTime AS playingTime, gameMinAge AS minAge,
                       gamePublisher AS publisher, gameUrl AS url
                FROM game
                WHERE id_game = ?
            `;
            const [rows] = await pool.execute(sql, [id]);
            console.log("SQL Query:", sql, "Parameters:", [id]);
            return rows[0] || null;
        } catch (err) {
            console.error("Error in getGameById:", err);
            throw err;
        }
    }
};