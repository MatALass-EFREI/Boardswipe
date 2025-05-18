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
        const [existing] = await pool.query(
            'SELECT score, time FROM table WHERE id_user = ? AND id_quiz = ?',
            [id_user, id_quiz]
        );

        if (existing.length > 0) {
            const { score: existingScore, time: existingTime } = existing[0];

            // Update only if the new score is better or if the score is equal but the time is better
            if (score > existingScore || (score === existingScore && time < existingTime)) {
                await pool.query(
                    'UPDATE table SET score = ?, time = ? WHERE id_user = ? AND id_quiz = ?',
                    [score, time, id_user, id_quiz]
                );
            }
        } else {
            // Insert a new record if no existing record is found
            await pool.query(
                'INSERT INTO table (id_user, id_quiz, score, time) VALUES (?, ?, ?, ?)',
                [id_user, id_quiz, score, time]
            );
        }
    },
};
