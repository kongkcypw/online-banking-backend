const { db } = require("../config/mysql");

const get_all_bank = async () => {
    try {
        const query = `SELECT * FROM Bank`;
        const [result] = await db.execute(query);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    get_all_bank
}