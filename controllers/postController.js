const { check, validationResult } = require('express-validator');
const postModel = require('../models/postModel');
const authService = require('../auth/authService');
const likeModel = require('../models/likeModel');
const Post = {
    //POST
    CreatePost: [
        authService.authenticateToken,
        check('title').isLength({ min: 3 }).withMessage('Title must be at least 3 characters long!'),
        check('contentText').isLength({ min: 3 }).withMessage('Content Text cannot be empty!'),
        async function (req, res) {
            const userId = req.user.ID;
            console.log('Create Post Request:', req.body);
            req.body.userId = userId;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log('Validation Errors:', errors.array());
                return res.status(400).json({ errors: errors.array() });
            }
            try {
                console.log('Creating Post:', req.body);
                await postModel.createPost(req.body);
                console.log('Post created successfully!');
                return res.redirect('/post'); // Bu, GET isteği yapacak ve sayfa durumunu temizleyecektir.
            } catch (error) {
                console.error('Create Post Error:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    ],
    //GET
    getAllPostsController: async function (req, res) {
        try {
            const posts = await postModel.getAllPosts();
            // Tüm gönderiler için beğeni sayılarını al
            const likeCounts = await Promise.all(posts.map(post => likeModel.getLikeCount(post.ID)));
            // Beğeni sayılarını gönderilerle birleştir
            posts.forEach((post, index) => {
                post.likeCount = likeCounts[index];
            });
            console.log(posts);
            return res.render('post', { posts });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getPostsByIdController: async function (req, res) {
        try {
            const user = req.user;
            const userPost = await postModel.getPostById(req.user.ID);
            console.log('Posts:', userPost);
            return res.render('profile', {user, userPost});
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
 
 
}
module.exports = Post;