const dbConfig = require('../dbConfig');
const mssql = require('mssql');

const FriendRequestModel = {
    getAllFriends: async function (userId) {
        try {
            const pool = await mssql.connect(dbConfig);
                const result = await pool.request()
                    .input('userId', mssql.Int, userId)
                    .query(`
                    SELECT Users.ID, Users.FirstName, Users.LastName, Users.UserName, Users.Email
                    FROM Users
                    INNER JOIN (
                        SELECT SenderUserId AS FriendUserId
                        FROM Friend_Requests
                        WHERE Status = 1 AND ReceiverUserId = @userId
                        UNION
                        SELECT ReceiverUserId AS FriendUserId
                        FROM Friend_Requests
                        WHERE Status = 1 AND SenderUserId = @userId
                    ) AS FriendList ON Users.ID = FriendList.FriendUserId
                `);
            mssql.close();
            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getNotMyFriends: async function (userId) {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request()
                .input('senderUserId', mssql.Int, userId)
                .query(`
            SELECT Users.ID, Users.FirstName, Users.LastName, Users.UserName, Users.Email
            FROM Users
            WHERE Users.ID <> @senderUserId
            AND Users.ID NOT IN (
                SELECT ReceiverUserId
                FROM Friend_Requests
                WHERE SenderUserId = @senderUserId
            )
            AND Users.ID NOT IN (
                SELECT SenderUserId
                FROM Friend_Requests
                WHERE ReceiverUserId = @senderUserId
            )`);
            mssql.close();
            return result.recordset;
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    },
}

module.exports = FriendRequestModel;
