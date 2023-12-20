const dbConfig = require('../dbConfig');
const mssql = require('mssql');

const AcceptFriendModel = {
   acceptFriendRequest: async function (requestId) {
        try {
            const pool = await mssql.connect(dbConfig);
            // Örnek: Veritabanına arkadaşlık isteği ekleyen sorgu
          
      const result = await pool.request()
      .input('id', mssql.Int, requestId)
      .query('UPDATE Friend_Requests SET Status = 1 WHERE ID = @id');
        
            // Eğer rowsAffected bilgisini kontrol etmek istiyorsanız:
            if (result.rowsAffected && result.rowsAffected[0] === 1) {
                console.log('Arkadaşlık isteği başarıyla kabul edilmiştir.');
                return result; // İşlem başarılıysa result nesnesini döndür
              } else {
                console.error('Arkadaşlık isteği kabul etme sorgusu beklenen sonucu döndürmedi.');
                return { error: 'Arkadaşlık isteği kabul etme sorgusu beklenen sonucu döndürmedi.' };
              }
        } catch (err) {
            console.error('Error : ', err);
            return { error: err.message }; // Hata durumunda bir nesne döndür
        }
    },
}

module.exports = AcceptFriendModel;
