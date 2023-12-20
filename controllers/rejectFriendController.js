const rejectFriendModel = require('../models/rejectFriendModel');


const RejectFriendController = {
    rejectFriendRequest: async (req, res) => {
        try {
            const requestId = req.params.requestId;
            const result = await rejectFriendModel.rejectFriendRequest(requestId);
            if (!result.error) {
              res.status(200).json({ message: 'Arkadaşlık isteği başarıyla red edilmiştir.' });
            } else {
              res.status(500).json({ error: 'Arkadaşlık isteği red edilirken bir hata oluştu.' });
            }
          } catch (error) {
            console.error('Error accepting friend request:', error);
            res.status(500).json({ error: 'Arkadaşlık isteği red edilirken bir hata oluştu.' });
          }
    }
}

module.exports = RejectFriendController;
