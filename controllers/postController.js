const Post = require("../models/Posts");
const Comment = require("../models/Comments")
const asyncHandler = require('express-async-handler');
const { default: mongoose } = require("mongoose")




// @desc get all posts
const getAllPosts = asyncHandler(async(req, res) => {
  
  const userId= req.user._id
       const allPosts = await Post.find().populate({
                path: 'userId',
                select: 'username email profileImg' 
            }).sort({createdAt:-1})
            .populate({
                path: 'likes'
            });
   res.render("users/posts",{title:"all post",allPosts,userId})
  
})


// @desc get add post
const getAddPost = (req, res) => {

   res.render("users/addPost",{title:"Add-post"})
}

// @desc get edit post
const getEditPost = asyncHandler(async (req, res) => {
     
      const postId = new mongoose.Types.ObjectId(req.params.id);
      const post = await Post.findOne({_id:postId})
      res.render("users/editPost",{post})
   
})


// @desc add post
const addPost = asyncHandler(async (req, res) => {
     const newPost = await Post.create({
        userId: req.user._id,
        file: req.file.filename,
        title:req.body.title
      })
     res.redirect("/api/posts")
  
})

// @desc add post
const editPost = asyncHandler(async(req, res) => {
  
   const postId = new mongoose.Types.ObjectId(req.params.id);
   await Post.updateOne({_id:postId},{$set:{title:req.body.title}},{runValidators:true})
   res.redirect("/api/posts")
 
})

const deletePost = asyncHandler(async(req, res) => {
      
      const postId = new mongoose.Types.ObjectId(req.params.id);
      const post = await Post.findOne({ _id: req.params.id })
      const filePath = path.join(__dirname, "../public/uploads/", post.file)
      
        if (fs.existsSync(filePath)) {
           console.log('File exists.');
           
           //Delete the file
           fs.unlinkSync(filePath);
           console.log(`File deleted successfully: ${filePath}`);
           await Post.deleteOne({ _id: postId })
           await Comment.deleteMany({postId})
            res.redirect("/api/user")
           
        } else {
           console.log('File does not exist.');
            await Post.deleteOne({ _id: postId })
            res.redirect("/api/user")
           
        }
    
  
})

// @desc add comments
const postComments = asyncHandler(async(req, res)=> {
  
      const postId = new mongoose.Types.ObjectId(req.params.id);
      const userId = req.user._id
      const comment = req.body.comment
  
      if(!comment) return res.status(400).json({message:"all fields required"})
      
      let saveComment = await Comment.create({
         userId,
         postId,
         comment
      })
    
      await Post.updateOne({_id:postId},{$push:{comments:saveComment._id}})

      res.redirect('/api/posts')

  
})

const getAllComments =  asyncHandler(async (req, res) => { 
 
   const postId = new mongoose.Types.ObjectId(req.params.id);
      
   const comments = await Comment.find({postId:postId}).populate({path:"userId",select:" username email profileImg"})
       
      res.status(200).json(comments)

})

module.exports = {
    getAddPost,
    getEditPost,
    addPost,
    editPost,
    deletePost,
    postComments,
    getAllComments,
    getAllPosts
}