var express = require('express');
var router = express.Router();
const passport = require('passport');
const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');
const authenticateService = require('../auth/authService');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');
const friendRequestController = require('../controllers/friendRequestController');
const AcceptFriendController = require('../controllers/acceptFriendController');
const RejectFriendController = require('../controllers/rejectFriendController');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const likeController = require('../controllers/likeController');


router.get('/', function (req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Express' });
});

router.get('/oauth2/redirect/facebook',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      console.log('isAuthenticated (Facebook Giriş):', req.isAuthenticated());
      console.log('Facebook Giriş başarılı.');
      const user = req.user; // Kullanıcı bilgilerini doğru bir şekilde al
      console.log('UserX :', user);
      const accessToken = jwt.sign(
        {
          ID: user.userId,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          photo: user.photo
        },
        process.env.JWT_ACCESSECRETKEY,
        { expiresIn: '10m' }
      ); const refreshToken = jwt.sign(
        {
          ID: user.userId,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          photo: user.photo

        }, process.env.JWT_REFRESHSECRETKEY,
        { expiresIn: '15m' });
      res.cookie('token', accessToken, { httpOnly: true, secure: true });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
      res.cookie('id', user.userId, { httpOnly: false, secure: true });
      res.redirect('/home');
    } else {
      console.log('Facebook ile doğrulama başarısız.');
      res.redirect('/login');
    }
  }
);
router.get('/home', authenticateService.authenticateToken,
  friendRequestController.getAllUsersAndFriendRequestController,
  (req, res) => {
    res.render('home');
  });

router.get('/profile', authenticateService.authenticateToken,postController.getPostsByIdController, (req, res) => {
  res.render('profile' ,  { user: req.user });
});
router.get('/post',  authenticateService.authenticateToken,
postController.getAllPostsController, (req, res, next)  => {
  res.render('post', { posts: res.locals.posts }); // res.locals.posts kullanarak erişin
});
router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/getCommentsForPost/:postId',commentController.getCommentsForPostController);

router.post('/createComment' , commentController.postCreateComment);

router.get('/users', userController.getAllUsersController);

router.get('/users/:id', userController.getUserByIdController);

router.post('/post' ,postController.CreatePost);

router.post('/register', registerController.RegisterUserController);

router.post('/login', loginController.login);

router.post('/createLike' , likeController.createLike);

router.post('/sendFriendRequest', friendRequestController.sendFriendRequest);

router.post('/acceptFriendRequest/:requestId', AcceptFriendController.acceptFriendRequest);

router.post('/rejectFriendRequest/:requestId', RejectFriendController.rejectFriendRequest);

module.exports = router;
