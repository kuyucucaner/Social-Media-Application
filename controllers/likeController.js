const Like = require('../models/likeModel');
const mssql = require('mssql');
const dbConfig = require('../dbConfig');
const authService = require('../auth/authService');
const PostModel = require('../models/postModel');

const likeController = {
  createLike: [
    authService.authenticateToken,
    async function (req, res) {
      try {
        const userId = req.user.ID;
        const { postId } = req.body;
        console.log('Request:', req.body);
        console.log('User ID:', userId);
        console.log('Post ID:', postId);

        // Beğeni durumunu kontrol et
        const checkLikeQuery = `
          SELECT COUNT(*) AS count
          FROM Likes
          WHERE PostID = @postId AND UserID = @userId;
        `;

        const pool = await mssql.connect(dbConfig);
        const checkLikeResult = await pool.request()
          .input('postId', mssql.Int, postId)
          .input('userId', mssql.Int, userId)
          .query(checkLikeQuery);

        const existingLikeCount = checkLikeResult.recordset[0].count;

        if (existingLikeCount > 0) {
          return res.json({ error: 'Post already liked by the user' });
        }

        // Yeni beğeni oluştur
        await Like.createLike({ postId, userId, timestamp: new Date() });
        res.json({ success: true });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  ],

  // Bir posttaki beğeni kaldırma
  // Bu kısmı ekleyebilirsiniz, eğer beğeni kaldırmayı destekliyorsanız
  // unlikePost: async (req, res) => {
  //   try {
  //     const { postId, userId } = req.body;

  //     // Beğeni var mı kontrol et
  //     const existingLike = await Like.findOne({ postID: postId, userID: userId });

  //     if (!existingLike) {
  //       return res.status(400).json({ error: 'Post not liked by the user' });
  //     }

  //     // Beğeniyi kaldır
  //     await existingLike.remove();

  //     res.json({ success: true });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // },
};

module.exports = likeController;


