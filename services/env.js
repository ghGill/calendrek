function envVar(key) {
    try {
        key = key.toUpperCase();

        return process.env[key];
    }
    catch(e) {
        return null;
    }
}

module.exports = {
    envVar
}
