const mongoose = require("mongoose")
const Video = require("./videos.model");
const bcrypt = require("bcryptjs")

const Schema = mongoose.Schema

const playlistSchema = new Schema({
    playlistName:String,
    videos:[{ type: Schema.Types.ObjectId, ref: Video }]
})

const userSchema = new Schema({
    firstName:{
        type: String,
        required:["First name required"]
    },
    lastName:{
        type: String,
    },
    email:{
        type: String,
        required:["Please enter your email id"]
    },
    username:{
        type:String,
        required:["Username required"],
        unique:["Username must be unique"]
    },
    password:{
        type:String,
        required:["Password required"]
    },
    watchlater:[{ type: Schema.Types.ObjectId, ref: Video }],
    likedvideos:[{ type: Schema.Types.ObjectId, ref: Video }],
    playlist:[playlistSchema]
})

module.exports = mongoose.model("User",userSchema)