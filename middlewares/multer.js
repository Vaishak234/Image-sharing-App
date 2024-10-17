const multer = require("multer")

const postStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+".jpg"
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const profilePicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/profile-uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+".jpg"
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const uploadPost = multer({ storage: postStorage })
const uploadProfilePic = multer({ storage: profilePicStorage })

module.exports = {
  uploadPost,
  uploadProfilePic
}