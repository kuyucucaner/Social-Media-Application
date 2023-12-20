const userModel = require('../models/userModel');

const userController = { 
    getAllUsersController: async function (req, res) {
        try {
          const users = await userModel.getAllUsers();
          console.log(users); 
          return res.render('home', { users }); // Kullanıcıları home.ejs sayfasına gönderiyoruz

        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      },
      getUserByIdController: async function (req, res) {
        try {
            const userId = req.params.id; // URL'den userId'yi al
            const user = await userModel.getUserById(userId);
            console.log('user ıd : ' , userId);
            if (user) {
                return res.json({ user });
            } else {
                return res.status(404).json({ message: 'Kullanıcı bulunamadı' , user });
            }
        } catch (error) {
            console.error('getUserByIdController Error:', error);
    
                return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = userController;