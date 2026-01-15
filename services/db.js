const db_engin_class = require('./db_engin_mysql');
const db = new db_engin_class();

let dbAvailable = null;

function getDbAvailable() {
    return dbAvailable;
}

async function initDB() {
    return new Promise(async (resolve, reject) => {
        try {
            dbAvailable = await db.connect();

            const msg = dbAvailable.success ? "DB connection is available." : `DB connection failed. {${dbAvailable.message}}`;
            console.log(msg);
            resolve({ success: true, message: msg});
        }
        catch (e) {
            reject({ success: false, message: e.message })
        }
    })
}

function fixText(txt=null) {
    if (txt)
        return txt.replace(/'/g, "''");

    return '';
}

module.exports = {
    db: db,
    getDbAvailable,
    initDB,
    fixText
};
