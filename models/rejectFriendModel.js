const dbConfig = require('../dbConfig');
const mssql = require('mssql');

const RejectFriendModel = {
   rejectFriendRequest: async function (requestId) {
        try {
            const pool = await mssql.connect(dbConfig);
            // Örnek: Veritabanına arkadaşlık isteği ekleyen sorgu
          
      const result = await pool.request()
      .input('id', mssql.Int, requestId)
      .query('DELETE FROM Friend_Requests WHERE ID = @id');
        
            // Eğer rowsAffected bilgisini kontrol etmek istiyorsanız:
            if (result.rowsAffected && result.rowsAffected[0] === 1) {
                console.log('Arkadaşlık isteği başarıyla red edilmiştir.');
                return result; // İşlem başarılıysa result nesnesini döndür
              } else {
                console.error('Arkadaşlık isteği red etme sorgusu beklenen sonucu döndürmedi.');
                return { error: 'Arkadaşlık isteği red etme sorgusu beklenen sonucu döndürmedi.' };
              }
        } catch (err) {
            console.error('Error : ', err);
            return { error: err.message }; // Hata durumunda bir nesne döndür
        }
    },
}

module.exports = RejectFriendModel;
