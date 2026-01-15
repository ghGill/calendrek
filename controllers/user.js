const { db } = require('../services/db');

class userController {
    constructor() {
    }

    async getAllUsers(req, res) {
        try {
            const sql_query = `
                SELECT *
                FROM users
                ORDER BY first DESC
            `;

            const [rows] = await db.connection.execute(sql_query);

            res.status(200).json({ success: true, data: rows })
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message })
        }
    }

    async setDefaultUser(req, res) {
        const user_id = req.body.user_id;
        
        try {
            const sql_query = `
                UPDATE users
                SET first = CASE
                    WHEN id = ${user_id} THEN 1
                    ELSE 0
                END
            `;

            const [rows] = await db.connection.execute(sql_query);

            res.status(200).json({ success: true, data: rows })
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message })
        }
    }
}

module.exports = new userController();
