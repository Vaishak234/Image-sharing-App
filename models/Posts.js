const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    userId: {
        type:  mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true,
    },
    file: {
        type:  String,
        required: true,
    },
    title: {
        type: String,
        required:true
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId , ref: 'Comment'}],
    
}, { timestamps: true })




module.exports = mongoose.model("Post",postSchema)