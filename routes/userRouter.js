const express = require("express")
const {uploadProfilePic} = require('../middlewares/multer')
const Post = require("../models/Posts")
const Comment = require("../models/Comments")
const fs = require("fs")
const path = require("path")
const { default: mongoose } = require("mongoose")
const User = require("../models/User")
const { getProfile, likePost, getSearch, searchUser, uploadProfile } = require("../controllers/userController")

const router = express.Router()

const {verifyAuth} = require('../middlewares/verifyAuth')

router.use(verifyAuth)


router.get("/profile", getProfile)

router.get("/post/like/:id",likePost)


// router.get("/post/delete-comment/:id",verifyAuth,async(req, res)=> {
//    try {
//       const commentId = new mongoose.Types.ObjectId(req.params.id);
//       const userId = req.user._id
      
//       const comment = await Comment.findOne({ _id: commentId });
//        if (!comment) {
//             return res.status(404).send('Comment not found.');
//         }
     
//       let deleteComment = await Comment.deleteOne({_id:commentId})
    
//        await Post.updateOne({_id:comment.postId},{$pull:{comments:comment._id}})
   

//       res.redirect('/api/posts')

//    } catch (error) {
//       console.log(error);
      
//    }
// })



// router.get("/messages",verifyAuth,async(req, res)=> {
//    try {
//       const users = await User.find({_id: {$ne: req.session.user_id}});
     
//       console.log(users);
      
//       res.render('users/messages',{users,userId:req.session.user_id})
       

//    } catch (error) {
//       console.log(error);
      
//    }
// })

// router.get("/messages/:id",verifyAuth,async(req, res)=> {
//    try {
//       const userId =  new mongoose.Types.ObjectId(req.params.id);
//       const user = await User.findOne({_id:userId})
     
//       console.log(user);
      
//       res.render('users/userMessages',{user})
       

//    } catch (error) {
//       console.log(error);
      
//    }
// })


router.get("/search",getSearch)

router.get("/search/name",searchUser)

router.post("/upload", uploadProfilePic.single('profilePic'),uploadProfile )


module.exports = router