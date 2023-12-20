const dbConfig = require('../dbConfig');
const mssql = require('mssql');

const Post = {
    //POST
    createPost: async function (post) {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request()
                .input('userId', mssql.Int, post.userId)
                .input('title', mssql.NVarChar, post.title)
                .input('contentText', mssql.NVarChar, post.contentText)
                .input('timestamp', mssql.Date, post.timestamp || new Date())
                .query('INSERT INTO Posts (UserID , Title , ContentText, Timestamp) VALUES (@userId , @title,@contentText,@timestamp)');
            console.log('Post Information : ', result);
            mssql.close();
        }
        catch (err) {
            console.error('Error : ', err);
        }
    },
    //GET
    getAllPosts: async function () {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request().query(`
                SELECT Posts.*, Users.FirstName
                FROM Posts
                INNER JOIN Users ON Posts.UserID = Users.ID
            `);
            mssql.close();
            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getPostById: async function (userId) {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request()
                .input('userId', mssql.Int, userId)
                .query('SELECT * FROM Posts WHERE UserID = @userId');
            if (result.recordset.length > 0) {
                return result.recordset || []; // Eğer boşsa boş bir dizi döndür
            } else {
                return null;
            }
        } catch (err) {
            console.error('Error:', err);
            throw err;
        } finally {
            mssql.close();
        }
    },
}
module.exports = Post;