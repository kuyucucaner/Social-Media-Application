const { check, validationResult } = require('express-validator');
const commentModel = require('../models/commentModel');
const authService = require('../auth/authService');

const Comment = {
    //POST
    postCreateComment:[
        authService.authenticateToken,
        check('contentText').isLength({ min: 3 }).withMessage('Content Text cannot be empty!'),
        async function (req,res){
            const userId = req.user.ID;
            const { postId, contentText } = req.body;
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                console.log('Validation Errors :', errors.array());
                return res.status(400).json({errors : errors.array()});
            }
            try {
                console.log('Creating Post', req.body);
                await commentModel.createComment({ userId, postId, contentText , timestamp: new Date()});
                console.log('Comment created succesfully!');
                return res.status(201).json({message : 'Comment created succesfully!'});
            } catch (error) {
                console.error('Create Post Error:' ,error);
                return res.status(500).json({message : 'Internal Server Error'});
            }
        }
    ],
    //GET
    getAllCommentsController: async function (req, res) {
        try {
          const comments = await commentModel.getAllComments();
          console.log(comments); 
          return res.json({ comments });

        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      },
      getCommentByIdController: async function (req, res) {
        try {
            const commentId = req.params.id; // URL'den userId'yi al
            const comment = await commentModel.getCommentById(commentId);
            console.log('user ıd : ' , commentId);
            if (comment) {
                return res.json({ comment });
            } else {
                return res.status(404).json({ message: 'Kullanıcı bulunamadı' , comment });
            }
        } catch (error) {
            console.error('getUserByIdController Error:', error);
    
                return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getCommentsForPostController: async function (req, res) {
        try {
            const postId = req.params.postId;
            console.log('postId : ', postId); // Bu satırı ekleyin
            const comments = await commentModel.getCommentsForPost(postId);
            return res.json({ comments });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
}
module.exports = Comment;