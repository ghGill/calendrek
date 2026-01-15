const mysql = require('mysql2/promise');
const { envVar } = require('../services/env');

class MYSQL_DB {
    constructor() {
        this.connection = null;
    }

    async connect() {
        try {
            let dbConnectionKey = envVar("DB_CONNECTION_STRING");
            dbConnectionKey = dbConnectionKey.replaceAll('{~}', '');
            
            await this.enginConnect(dbConnectionKey);

            return ({ success: true })
        }
        catch (e) {
            return ({ success: false, message: e.message });
        }
    }

    async enginConnect(dbUri) {
        this.connection = await mysql.createConnection(dbUri);
    }
}

module.exports = MYSQL_DB
