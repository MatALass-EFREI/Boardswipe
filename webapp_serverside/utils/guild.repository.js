const db = require('../utils/db.include');

const GuildRepository = {
    async getAllGuilds() {
        const query = 'SELECT * FROM Guild';
        const [rows] = await db.query(query);
        return rows;
    },

    async getGuildByUserId(userId) {
        const query = `
            SELECT g.id_guild, g.guildName, ub.role
            FROM Guild g
            JOIN UserBelongsToGuild ub ON g.id_guild = ub.id_guild
            WHERE ub.id_user = ?`;
        const [rows] = await db.query(query, [userId]);
        return rows[0];
    },

    async createGuild(name, userId, isPublic) {
        const query1 = 'INSERT INTO Guild (guildName, isPublic) VALUES (?, ?)';
        const [result] = await db.query(query1, [name, isPublic]);
        const guildId = result.insertId;

        const query2 = `
        INSERT INTO UserBelongsToGuild (id_user, id_guild, role)
        VALUES (?, ?, 'president')`;
        await db.query(query2, [userId, guildId]);

        return { id_guild: guildId, guildName: name, isPublic };
    },

    async getGuildMembers(guildId) {
        const query = `
            SELECT u.id_user, u.userName, ub.role
            FROM User_ u
            JOIN UserBelongsToGuild ub ON u.id_user = ub.id_user
            WHERE ub.id_guild = ?`;
        const [rows] = await db.query(query, [guildId]);
        return rows;
    },

    async addMemberToGuild(userId, guildId, role = 'member') {
        const query = `
            INSERT INTO UserBelongsToGuild (id_user, id_guild, role)
            VALUES (?, ?, ?)`;
        await db.query(query, [userId, guildId, role]);
    },

    async removeMemberFromGuild(userId, guildId) {
        const query = `
            DELETE FROM UserBelongsToGuild
            WHERE id_user = ? AND id_guild = ?`;
        await db.query(query, [userId, guildId]);
    },

    async updateRole(userId, guildId, newRole) {
        const query = `
            UPDATE UserBelongsToGuild
            SET role = ?
            WHERE id_user = ? AND id_guild = ?`;
        await db.query(query, [newRole, userId, guildId]);
    },

    async getJoinRequests(guildId) {
        const query = `
            SELECT u.id_user, u.userName
            FROM User_ u
            JOIN UserBelongsToGuild ub ON u.id_user = ub.id_user
            WHERE ub.id_guild = ? AND ub.role = 'demandeur'`;
        const [rows] = await db.query(query, [guildId]);
        return rows;
    },
    async getGuildById(guildId) {
        const query = 'SELECT * FROM Guild WHERE id_guild = ?';
        const [rows] = await db.query(query, [guildId]);
        return rows[0];
    }
};

module.exports = GuildRepository;