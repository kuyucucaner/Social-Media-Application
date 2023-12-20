const dbConfig = require('../dbConfig');
const mssql = require('mssql');
const bcrypt = require('bcrypt');


const Register = {
    registerUser: async function (user) {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request()
                .input('firstName', mssql.NVarChar, user.firstName)
                .input('lastName', mssql.NVarChar, user.lastName)
                .input('userName', mssql.NVarChar, user.userName)
                .input('password', mssql.NVarChar, hashedPassword)
                .input('email', mssql.NVarChar, user.email)
                .query('INSERT INTO Users (FirstName, LastName, UserName, Password, Email) OUTPUT INSERTED.Id VALUES (@firstName, @lastName, @userName, @password, @email)');
            
            console.log('result:', result);
            // Eğer rowsAffected bilgisini kontrol etmek istiyorsanız:
            if (result.rowsAffected && result.rowsAffected[0] === 1) {
                console.log('Kullanıcı başarıyla eklenmiştir.');

                // Eğer burada başka bir işlem yapmak istiyorsanız, bu kısmı düzenleyebilirsiniz.

                return result; // Ekleme işlemi başarılıysa result nesnesini döndür
            } else {
                console.error('Kullanıcı ekleme sorgusu beklenen sonucu döndürmedi.');
                return { error: 'Kullanıcı ekleme sorgusu beklenen sonucu döndürmedi.' };
            }
        } catch (err) {
            console.error('Error : ', err);
            return { error: err.message }; // Hata durumunda bir nesne döndür
        }
    },
}

module.exports = Register;
