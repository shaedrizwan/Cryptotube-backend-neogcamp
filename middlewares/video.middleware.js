const Video = require('../models/videos.model')

const checkVideo = async (req,res,next)=> {
    try{
        const {videoId} = req.params;
        const video = await Video.findById(videoId)
        req.video = video
        next();
    }
    catch{
        res.status(500).json({success:false,message:"Video not found"})
    }
}

module.exports = checkVideo