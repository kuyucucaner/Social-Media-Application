const dbConfig = require('../dbConfig');
const mssql = require('mssql');

const FriendRequestModel = {
    sendFriendRequest: async function (senderUserId, receiverUserId) {
        try {
            const pool = await mssql.connect(dbConfig);
            // Örnek: Veritabanına arkadaşlık isteği ekleyen sorgu
            const result = await pool.request()
            .input('senderUserId', mssql.Int, senderUserId)
            .input('receiverUserId', mssql.Int, receiverUserId)
            .input('status', mssql.Bit, 0) // Burada varsayılan olarak 0 (false) atanmıştır, isteğe bağlı olarak duruma göre değiştirebilirsiniz.
            .input('createdAt', mssql.DateTime, new Date()) // Oluşturulma tarihini eklemek için uygun bir değeri kullanmalısınız.
            .query(`INSERT INTO Friend_Requests (SenderUserId, ReceiverUserId, Status, CreatedAt) 
            OUTPUT INSERTED.Id VALUES
             (@senderUserId, @receiverUserId, @status, @createdAt)`);
        
            // Eğer rowsAffected bilgisini kontrol etmek istiyorsanız:
            if (result.rowsAffected && result.rowsAffected[0] === 1) {
                console.log('Arkadaşlık isteği başarıyla gönderildi.');
                return result; // Ekleme işlemi başarılıysa result nesnesini döndür
            } else {
                console.error('Arkadaşlık isteği gönderme sorgusu beklenen sonucu döndürmedi.');
                return { error: 'Arkadaşlık isteği gönderme sorgusu beklenen sonucu döndürmedi.' };
            }
        } catch (err) {
            console.error('Error : ', err);
            return { error: err.message }; // Hata durumunda bir nesne döndür
        }
    },
    getAllReceivedFriend: async function (userId) {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request()
            .input('receiverUserId', mssql.Int , userId)
            .query(`
            SELECT Friend_Requests.* , Users.FirstName 
            FROM Friend_Requests
            INNER JOIN Users ON Friend_Requests.SenderUserId = Users.ID
            WHERE Friend_Requests.Status = 0 AND  Friend_Requests.ReceiverUserId = @receiverUserId
            `);
            mssql.close();
            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getAllAcceptedFriend: async function () {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request().query('SELECT * FROM Friend_Requests WHERE Status = 1');
            mssql.close();
            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
}

module.exports = FriendRequestModel;
