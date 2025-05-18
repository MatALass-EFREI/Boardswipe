const pool = require('./db.include');

module.exports = {

    getAllQuizzes: async () => {
        const [rows] = await pool.query('SELECT * FROM quiz');
        return rows;
    },

    getQuizById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM quiz WHERE id_quiz = ?', [id]);
        return rows[0] || null;
    },

    addQuiz: async (quiz) => {
        const { id_quiz, quiz_title, questions } = quiz;
        const [result] = await pool.query(
            'INSERT INTO quiz (id_quiz, quiz_title, questions) VALUES (?, ?, ?)',
            [id_quiz, quiz_title, JSON.stringify(questions)]
        );
        return result.insertId;
    },

    deleteQuizById: async (id) => {
        const [result] = await pool.query('DELETE FROM quiz WHERE id_quiz = ?', [id]);
        return result.affectedRows > 0;
    },
    updateUserQuizResult: async (id_user, id_quiz, score, time) => {
        try {
            console.log('Received data:', { id_user, id_quiz, score, time });

            // Insert or update the userleaderboard table
            const [insertResult] = await pool.query(
                `INSERT INTO userleaderboard (id_user, id_quiz, score, time)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             score = VALUES(score),
             time = VALUES(time)`,
                [id_user, id_quiz, score, time]
            );

            console.log('Insert/Update Result:', insertResult);

            // Call the updateRanks method
            await module.exports.updateRanks();
        } catch (error) {
            console.error('Error in updateUserQuizResult:', error);
            throw error;
        }
    },
    updateRanks: async () => {
        await pool.query('CALL update_ranks()');
    },

    getLeaderboardByQuizId: async (quizId) => {
        const [rows] = await pool.query(
            `SELECT ul.rank_, u.username AS user_name, ul.score, ul.time
         FROM userleaderboard ul
         JOIN user_ u ON ul.id_user = u.id_user
         WHERE ul.id_quiz = ?
         ORDER BY ul.rank_ ASC`,
            [quizId]
        );
        return rows;
    },
    async getQuizLeaderboard() {
        try {
            const [rows] = await pool.query('SELECT * FROM QuizLeaderboard');
            return rows;
        } catch (error) {
            console.error('Error in getQuizLeaderboard:', error);
            throw error;
        }
    },
};
