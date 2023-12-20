const FriendRequestModel = require('../models/friendRequestModel');
const userModel = require('../models/userModel');
const friendModel = require('../models/friendModel');

const friendRequestController = {
    sendFriendRequest: async (req, res) => {
        try {
            const senderUserId = req.body.senderUserId; // Bu değeri nasıl almanız gerektiğine dair uygun bir yöntemi kullanmalısınız
            const receiverUserId = req.body.receiverUserId; // Bu değeri nasıl almanız gerektiğine dair uygun bir yöntemi kullanmalısınız

            const result = await FriendRequestModel.sendFriendRequest(senderUserId, receiverUserId);

            if (result && result.rowsAffected && result.rowsAffected[0] === 1) {
                console.log('Arkadaşlık isteği gönderildi.');
                res.json({ message: 'Arkadaşlık isteği gönderildi.' });
            } else {
                console.error('Arkadaşlık isteği gönderilirken bir hata oluştu.');
                res.status(500).json({ error: 'Arkadaşlık isteği gönderilirken bir hata oluştu.' });
            }
        } catch (err) {
            console.error('Error sending friend request:', err.message);
            res.status(500).json({ error: 'Arkadaşlık isteği gönderilirken bir hata oluştu.' });
        }
    },
    getAllUsersAndFriendRequestController: async function (req, res) {
        try {
            const acceptedFriendRequests = await FriendRequestModel.getAllAcceptedFriend();
            const user = req.user.ID;
            const receivedFriendRequests = await FriendRequestModel.getAllReceivedFriend(user);
            const notfriends = await friendModel.getNotMyFriends(user);
            const friends = await friendModel.getAllFriends(user);
            console.log('Önerilen Arkadaşlar:', notfriends);
            console.log('Gelen Arkadaşlık İstekleri:', receivedFriendRequests);
            console.log('Kabul Edilen Arkadaşlık İstekleri:', acceptedFriendRequests);
            console.log('Arkadaşlarım : ' , friends);
            return res.render('home', { notfriends, receivedFriendRequests , acceptedFriendRequests , friends});

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    

}

module.exports = friendRequestController;
