const dbConfig = require('../dbConfig');
const mssql = require('mssql');

const Like = {
    //POST
    createLike: async function (like) {
        try {
            const pool = await mssql.connect(dbConfig);
            const result = await pool.request()
                .input('postId', mssql.Int, like.postId)
                .input('userId', mssql.Int, like.userId)
                .input('timestamp', mssql.Date, like.timestamp || new Date())
                .query('INSERT INTO Likes (PostID , UserID  , Timestamp) VALUES (@postId ,@userId,@timestamp)');
            console.log('Like Information : ', result);
            mssql.close();
        }
        catch (err) {
            console.error('Error : ', err);
        }
    },
    getLikeCount: async function (postId) {
        try {
          const pool = await mssql.connect(dbConfig);
          const result = await pool.request()
            .input('postId', mssql.Int, postId)
            .query('SELECT COUNT(*) AS likeCount FROM Likes WHERE PostID = @postId');
          return result.recordset[0].likeCount;
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
      },
    };

module.exports = Like;