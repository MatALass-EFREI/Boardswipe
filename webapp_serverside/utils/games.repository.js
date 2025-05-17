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
            SELECT 
                g.id_game AS id, 
                g.gameName AS name, 
                g.gameDescription AS description,
                g.gameYearPublished AS releaseDate, 
                g.avgRating AS rating,
                g.gameMinPlayers AS minPlayers, 
                g.gameMaxPlayers AS maxPlayers,
                g.gamePlayingTime AS playingTime, 
                g.gameMinAge AS minAge,
                g.gameUrl AS url,
                GROUP_CONCAT(DISTINCT gp.PublisherName) AS publishers,
                GROUP_CONCAT(DISTINCT gc.CategoryName) AS categories
            FROM game g
            LEFT JOIN Publisher p ON g.id_game = p.id_game
            LEFT JOIN GamePublisher gp ON p.IdPublisher = gp.IdPublisher
            LEFT JOIN Category c ON g.id_game = c.id_game
            LEFT JOIN GameCategory gc ON c.IdCategory = gc.IdCategory
            WHERE g.id_game = ?
            GROUP BY g.id_game
        `;
            const [rows] = await pool.execute(sql, [id]);
            console.log("Game details:", rows);
            console.log("SQL Query:", sql, "Parameters:", [id]);

            return rows[0] || null;

        } catch (err) {
            console.error("Error in getGameById:", err);
            throw err;
        }
    }
};