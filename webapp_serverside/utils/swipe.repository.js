const pool = require('./db.include');


module.exports = {
    async getFirstGame() {
        const query = `
        SELECT g.id_game, g.gameName
        FROM game g
        LEFT JOIN swipe s ON g.id_game = s.id_game AND s.id_user = 1
        WHERE g.id_game = 1
        LIMIT 1;
    `;
        const [game] = await pool.query(query);
        console.log(game);
        return game;
    },
    async getRandomGame() {
        const query = `
            SELECT g.id_game, g.gameName
            FROM game g
            LEFT JOIN swipe s ON g.id_game = s.id_game AND s.id_user = 1
            WHERE s.result IS NULL OR s.result = 0
            ORDER BY RAND()
            LIMIT 1;
            `;
        const [game] = await pool.query(query);
        console.log(game);
        return game;
    },


    async getSwipeById(id) {
        const query = `
            SELECT *
            FROM swipe
            WHERE id = $1
            LIMIT 1;
        `;
        const values = [id];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    async createSwipe(data) {
        const query = `
            INSERT INTO swipe (column1, column2, result)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [data.column1, data.column2, data.result];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    async saveSwipe(id_game, id_user, result) {
        try {
            const query = `
            INSERT INTO swipe (id_game, id_user, result)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE result = VALUES(result);
        `;
            await pool.query(query, [id_game, id_user, result]);
        } catch (error) {
            console.error('Error in saveSwipe:', error);
            throw error; // Re-throw the error to be handled by the controller
        }
    },

    async deleteSwipe(id) {
        const query = `
            DELETE FROM swipe
            WHERE id = $1
            RETURNING *;
        `;
        const values = [id];
        const result = await db.query(query, values);
        return result.rows[0];
    }
}