const dbConfig = require('../dbConfig');
const mssql = require('mssql');


const User = {
    getAllUsers: async function () {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request().query('SELECT * FROM Users');
            mssql.close();
            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getUserById: async function (userId) {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request()
                .input('id', mssql.Int, userId)
                .query('SELECT * FROM Users WHERE ID = @id');
    
            if (result.recordset.length > 0) {
                const user = result.recordset[0];
                return user;
            } else {
                return null;
            }
        } catch (err) {
            console.error('Error:', err);
            throw err;
        } finally {
            mssql.close(); // Finally bloğunda bağlantıyı kapat
        }
    },
    
}

module.exports = User;