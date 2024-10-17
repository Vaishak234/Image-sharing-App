const Post = require("../models/Posts")
const { default: mongoose } = require("mongoose")
const User = require("../models/User")
const asyncHandler = require("express-async-handler")
const path = require('path')
const fs = require('fs')

const getProfile = asyncHandler(async(req, res) => {

         const posts = await Post.find({userId:req.session.user_id}).populate({
                path: 'userId',
                select: 'username email' 
          }).sort({ updatedAt: -1 })
      
     const user = await User.findOne({_id:req.session.user_id})
  
      res.render("users/profile",{title:"profile",posts,user})
 
})

const likePost =asyncHandler(async (req, res) => {
  
      const postId = new mongoose.Types.ObjectId(req.params.id);
      const userId = req.user._id
      
      const isLiked = await Post.findOne({ _id: postId, likes: { $in: [userId] } })
      console.log("likei",isLiked);
      
      if (!isLiked) {
         let updateLikes = await Post.updateOne({ _id: postId }, { $addToSet: { likes: userId } })
         console.log("like added");
         return res.json({message:"added" ,status:true})
      } else {
         updateLikes = await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
         console.log("like removed");
           return res.json({message:"removed" ,status:false})
      }

 
})

const getSearch = async(req, res)=> {
    
      res.render('users/search')
}

const searchUser = asyncHandler(async(req, res)=> {

    const { q } = req.query; // Get search query from request
   console.log(req.qurey);
   
    if (!q) {
            return res.status(200).json([]); // Return an empty array if 'q' is undefined
    }
       
      const results = await User.aggregate([
    {
        $match: {
            username: { $regex: q, $options: 'i' } // Match usernames containing the string
        } 
    },
    {
        $addFields: {
            matchPosition: {
                $cond: {
                    if: { $regexMatch: { input: "$username", regex: `^${q}`, options: 'i' } }, // Matches at the start
                    then: 0,
                    else: {
                        $cond: {
                            if: { $regexMatch: { input: "$username", regex: `${q}`, options: 'i' } }, // Matches anywhere else
                            then: 1,
                            else: 2 // Doesn't match
                        }
                    }
                }
            }
        }
    }
]);
       
  
       res.status(200).json(results)
  

})

const uploadProfile = asyncHandler(async(req, res)=> {
  
    const userId = new mongoose.Types.ObjectId(req.session.user_id);
    
    const user = await User.findOne({ _id: userId })
      const filePath = path.join(__dirname, "../public/profile-uploads/", user.profileImg)
      
        if (fs.existsSync(filePath)) {
           console.log('File exists.');
           
           //Delete the file
           fs.unlinkSync(filePath);
           console.log(`File deleted successfully: ${filePath}`);

        }
    const uploadPic = await User.updateOne({ _id: userId }, { $set: { profileImg: req.file.filename } })
    res.status(200).json("profile uploaded")
  

} )



module.exports = {
    uploadProfile,
    searchUser,
    getSearch,
    likePost,
    getProfile,
}