const express = require("express")
const verifyAuth = require("../middlewares/verifyAuth")
const upload = require('../middlewares/multer')
const Post = require("../models/Posts")
const Comment = require("../models/Comments")
const fs = require("fs")
const path = require("path")
const { default: mongoose } = require("mongoose")
const User = require("../models/User")
const {verifyAdminAuth} = require("../middlewares/verifyAuth")
const router = express.Router()



router.get("/",verifyAdminAuth, (req, res) => {
   console.log(req.session);
   
   res.render("admin/dashboard",{layout:"layouts/adminLayout.ejs"})
})

router.get("/allusers",verifyAdminAuth, async(req, res) => {
   try {
       let users = await User.find()
       res.render("admin/allUsers", { layout: "layouts/adminLayout.ejs",users })
       
   } catch (error) {
    
   }
})

router.get("/delete/:id",verifyAdminAuth, async(req, res) => {
    try {
       const userId =  new mongoose.Types.ObjectId(req.params.id);
       await User.deleteOne({_id:userId})
       res.redirect("/api/admin")
       
   } catch (error) {
    
   }
})

router.get("/edit/:id",verifyAdminAuth, async(req, res) => {
    try {
       const userId =  new mongoose.Types.ObjectId(req.params.id);
       const user = await User.findOne({_id:userId})
       res.render("admin/editUser", { layout: "layouts/adminLayout.ejs",user })
       
   } catch (error) {
    
   }
})

router.post("/edit/:id",verifyAdminAuth, async(req, res) => {
    try {
        
        const {username, email} = req.body
       const userId =  new mongoose.Types.ObjectId(req.params.id);
        const user = await User.updateOne({ _id: userId }, { $set: { username, email } }, {runValidators: true })
        console.log(user);
        
       res.redirect("/api/admin")
       
   } catch (error) {
     console.log(error);
     
   }
})






module.exports = router