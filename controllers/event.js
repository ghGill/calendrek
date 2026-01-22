const { db } = require('../services/db');

class eventController {
    constructor() {
    }

    async getAllEvents(req, res) {
        try {
            const user_id = req.body.user_id;
            const g_day = req.body.g_day;
            const g_month = req.body.g_month;
            const h_day = req.body.h_day;
            const h_month = req.body.h_query_months;

            let conditions = [];
            
            let g_conditions = [];
            if (g_day > -1)
                g_conditions.push(`(g_day = ${g_day})`)
            if (g_month > -1)
                g_conditions.push(`(g_month = ${g_month})`)
            if (g_conditions.length)
                conditions.push(`SELECT *, 1 as type FROM events WHERE (${g_conditions.join(' AND ')})`)

            let h_conditions = [];
            if (h_day > -1)
                h_conditions.push(`(h_day = ${h_day})`)
            if (h_month != -1)
                h_conditions.push(`(h_month IN (${h_month.join(',')}))`)
            if (h_conditions.length)
                conditions.push(`SELECT *, 2 as type FROM events WHERE (${h_conditions.join(' AND ')})`)

            const condition_query = conditions.join(' UNION ');
            const sql_query = `
                SELECT e.*, BIT_OR(ut.type) event_type
                FROM (
                    SELECT id, type  
                    FROM ( 
                        ${condition_query} 
                    ) t
                    WHERE user_id IN (0, ${user_id})
                ) ut
                LEFT JOIN events e ON e.id = ut.id 
                GROUP BY id
            `;
            
            const [rows] = await db.connection.execute(sql_query);

            res.status(200).json({ success: true, data: rows })
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message })
        }
    }

    async getMonthEvents(req, res) {
        try {
            const user_id = req.body.user_id;
            const h_query = req.body.heb_query;
            const g_query = req.body.greg_query;

            let conditions = [];

            g_query.forEach(q => {
                conditions.push(`(g_day = ${q[0]} AND g_month = ${q[1]})`);
            });
            
            h_query.forEach(q => {
                conditions.push(`(h_day = ${q[0]} AND h_month IN (${q[1].join(',')}))`);
            });
            
            const month_query = conditions.join(' OR ');
            const sql_query = `
                SELECT *
                FROM events
                WHERE user_id IN (0, ${user_id}) AND
                (${month_query})
                GROUP BY id
            `;
            
            const [rows] = await db.connection.execute(sql_query);

            res.status(200).json({ success: true, data: rows })
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message })
        }
    }

    async getYearlyEvents(req, res) {
        try {
            const type = req.body.type;
            const user_id = req.body.user_id;

            let sql_query = `
                SELECT id, user_id, description,
                ${(type == 'greg') ? 'g_day as d,g_month as m' : 'h_day as d,h_month as m'}
                FROM events
                WHERE
                ${(type == 'greg') ? ' (g_day>-1) AND (g_month>-1) ' : ' (h_day>-1) AND (h_month>-1) '}
                AND user_id IN (0, ${user_id})
                AND printable = 1
                ORDER BY 
                ${(type == 'greg') ? 'g_month,g_day' : 'h_month,h_day'}
            `;

            const [rows] = await db.connection.execute(sql_query);

            res.status(200).json({ success: true, data: rows })
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message })
        }
    }

    async addEvent(req, res) {
        try {
            const user_id = req.body.user_id;
            const g_day = req.body.g_day;
            const g_month = req.body.g_month;
            const h_day = req.body.h_day;
            const h_month = req.body.h_month;
            const description = req.body.description;

            let data = [user_id];
            data.push((g_day > -1) ? `${g_day}` : '-1');
            data.push((g_month > -1) ? `${g_month}` : '-1');
            data.push((h_day > -1) ? `${h_day}` : '-1');
            data.push((h_month > -1) ? `${h_month}` : '-1');
            data.push(description ? `${description}` : 'NULL');
            const data_query = data.join(',');

            const sql = `
                    INSERT INTO events 
                    (user_id, g_day, g_month, h_day, h_month, description)
                    VALUES (?, ?, ?, ?, ?, ?);
                `;

            const [result] = await db.connection.execute(sql, data);

            res.status(200).json({ success: true, id:result.insertId })
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message })
        }
    }

    async updateEvent(req, res) {
        try {
            const record_id = req.body.id;

            let data = [
                req.body.user_id,
                req.body.g_day,
                req.body.g_month,
                req.body.h_day,
                req.body.h_month,
                req.body.description
            ];

            const sql = `
                    UPDATE events
                    SET 
                    user_id = ? ,
                    g_day = ? ,
                    g_month = ? ,
                    h_day = ? ,
                    h_month = ? ,
                    description = ?
                    WHERE id = ${record_id}
                `;

            const [result] = await db.connection.execute(sql, data);

            res.status(200).json({ success: true, id:result.insertId })
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message })
        }
    }

    async deleteEvent(req, res) {
        try {
            const { id } = req.body;

            await db.connection.execute(`DELETE FROM events WHERE id = '${id}'`);

            res.status(200).json({ success: true })
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message })
        }
    }
}

module.exports = new eventController();
