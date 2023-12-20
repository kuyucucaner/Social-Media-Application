const dbConfig = require('../dbConfig');
const mssql = require('mssql');

const Comment  = {
    //POST
    createComment : async function (comment) {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request()
            .input('postId' , mssql.Int , comment.postId)
            .input('userId' , mssql.Int , comment.userId)
            .input('contentText' , mssql.NVarChar, comment.contentText)
            .input('timestamp', mssql.Date, comment.timestamp || new Date()) 
            .query('INSERT INTO Comments (PostID , UserID , ContentText, Timestamp) VALUES (@postId, @userId,@contentText,@timestamp)');
            console.log("Comment Information : " , result );
            await pool.close();
        }
        catch(err){
            console.error('Error : ', err);
        }   
    },
    //GET
    getAllComments: async function () {
        try {
          const pool = await mssql.connect(dbConfig);
          const result = await pool.request().query('SELECT * FROM Comments');
          mssql.close();
          return result.recordset;
        } catch (err) {
          console.error(err);
          throw err;
        }
      },
      getCommentById: async function (commentId) {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool
                .request()
                .input('id', mssql.Int, commentId)
                .query('SELECT * FROM Comments WHERE ID = @id')
            if (result.recordset.length > 0) {
                return result.recordset[0];
            }
            return null; // Eğer yorum bulunamazsa null döndürülebilir veya isteğinize uygun bir değer.
        } catch (err) {
            console.error('Error getting comment by ID:', err);
            throw err;
        }
        finally {
          mssql.close(); // Finally bloğunda bağlantıyı kapat
      }
    },
    getCommentsForPost: async function (postId) {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool
                .request()
                .input('postId', mssql.Int, postId)
                .query('SELECT * FROM Comments WHERE PostID = @postId');
            return result.recordset;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
}
module.exports = Comment;