const mongoose = require('mongoose')
const Schema = mongoose.Schema

const videoSchema = new Schema({
    title:{
        type:String,
        required:["Video title required"]
    },
    youtube_url:{
        type: String,
        required: ["Video url required"]
    },
    description:{
        type: String
    },
    thumbnail:{
        type: String
    },
    slug:{
        type:String
    },
    channel_name:{
        type:String
    },
    published_date:{
        type: String
    },
    channel_thumbnail:{
        type:String
    }
},{
    timestamps:true
})


module.exports = mongoose.model("Video", videoSchema);