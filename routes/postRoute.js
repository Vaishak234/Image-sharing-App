const express = require("express")
const router = express.Router()
const {uploadPost } = require('../middlewares/multer')
const Post = require("../models/Posts")
const Comment = require("../models/Comments")
const fs = require("fs")
const path = require("path")
const {getAllPosts, getAddPost, getEditPost, deletePost, editPost, addPost, postComments,getAllComments } =  require("../controllers/postController")
const { default: mongoose } = require("mongoose")
const {verifyAuth} = require('../middlewares/verifyAuth')

router.use(verifyAuth)

// get all posts
router.get("/", getAllPosts)


// add post page 
router.get("/add-post", getAddPost)

// edit post page 
router.get("/edit-post/:id", getEditPost)

//add a post 
router.post("/add-post",uploadPost.single("image"),addPost )

// edit post
router.post("/edit-post/:id",editPost)

// delete post 
router.get("/delete-post/:id", deletePost)


router.get("/:id/comments",getAllComments)


router.post("/comment/:id",postComments)



module.exports = router