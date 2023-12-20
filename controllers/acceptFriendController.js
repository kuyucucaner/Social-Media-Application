const acceptFriendModel = require('../models/acceptFriendModel');


const AcceptFriendController = {
    acceptFriendRequest: async (req, res) => {
        try {
            const requestId = req.params.requestId;
            const result = await acceptFriendModel.acceptFriendRequest(requestId);
            if (!result.error) {
              res.status(200).json({ message: 'Arkadaşlık isteği başarıyla kabul edilmiştir.' });
            } else {
              res.status(500).json({ error: 'Arkadaşlık isteği kabul edilirken bir hata oluştu.' });
            }
          } catch (error) {
            console.error('Error accepting friend request:', error);
            res.status(500).json({ error: 'Arkadaşlık isteği kabul edilirken bir hata oluştu.' });
          }
    }
}

module.exports = AcceptFriendController;
