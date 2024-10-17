const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true,"username required"],
    },
    email: {
        type: String,
        required: [true, "email required"],
        unique:[true,"This email is already exist"]
    },
    password:{
        type: String,
        required: [true, "password requred"],
    },
    profileImg:{
        type: String,
        default:null
    },
    role: {
        type: String,
        required: [true, "role is requred"],
        enum:["user"]
    }
}, { timestamps: true })


userSchema.index({ username: 'text' });


module.exports = mongoose.model("User",userSchema)