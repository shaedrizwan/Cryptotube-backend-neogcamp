const express = require('express');
const router = express.Router();
const User = require("../models/user.model")
const {checkUser, verifyAuth} = require("../middlewares/auth.middleware")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

router.use('/login',checkUser)
router.route("/login")
    .post((req,res)=>{
        const user = req.user;
        const token = jwt.sign({userId:user._id},process.env.TOKEN_SECRET,{expiresIn:'24h'})
        res.json({success:true,user:user.username,token})
    })


router.route('/signup')
    .post( async (req,res)=>{
        try{
            const user = req.body;
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(user.password,salt)
            user.password = hashedPassword
            const newUser = new User(user)
            const updatedUser = await newUser.save()
            res.json({sucess:true,message:"Sign up successful",username:updatedUser.username})
        }catch(err){
            res.status(500).json({success:false,error:err.message,message:"Failed to add new User"})
        }
    })




router.use(verifyAuth)


router.route('/addToWatchlater')
    .post(async (req,res)=>{
        try{
            const userId = req.user;
            const {videoId} = req.body;
            updatedUser = await User.findByIdAndUpdate({_id:userId},{
                $addToSet:{
                    watchlater:videoId
                }
            })
            res.json({success:true,updatedUser:updatedUser.watchlater})
        }catch(err){
            res.json({success:false,message:err.message})
        }
    })


router.route('/watchlater')
    .get(async (req,res)=>{
        try{
            userId = req.user
            fullUser = await User.findOne({_id:userId}).populate('watchlater')
            res.json({success:true,watchlater:fullUser.watchlater})
        }catch(err){
            res.json({success:false,message:err.message})
        }
    })


router.route('/removeFromWatchLater')
    .post(async(req,res)=>{
        try{
            const userId = req.user;
            const {videoId} = req.body;
            updatedUser = await User.findByIdAndUpdate({_id:userId},{
                $pull:{
                    watchlater:videoId
                }
            })
            res.json({success:true,message:'Video successfully removed from Watchlater'})
        }catch(err){
            res.json({success:false,message:'Failed to remove the video',error:err.message})
        }
    })


router.route('/likedvideos')
    .get(async (req,res)=>{
        try{
            userId = req.user
            fullUser = await User.findOne({_id:userId}).populate('likedvideos')
            res.json({success:true,likedvideos:fullUser.likedvideos})
        }catch(err){
            res.json({success:false,message:err.message})
        }
    })


router.route('/addToLikedVideos')
    .post(async (req,res)=>{
        try{
            const userId = req.user;
            const {videoId} = req.body;
            updatedUser = await User.findByIdAndUpdate({_id:userId},{
                $addToSet:{
                    likedvideos:videoId
                }
            })
            res.json({success:true,updatedUser:updatedUser.likedvideos})
        }catch(err){
            res.json({success:false,message:err.message})
        }
    })


router.route('/removeFromLikedVideos')
    .post(async(req,res)=>{
        try{
            const userId = req.user;
            const {videoId} = req.body;
            updatedUser = await User.findByIdAndUpdate({_id:userId},{
                $pull:{
                likedvideos:videoId
                }
            })
            res.json({success:true,likedvideos:updatedUser.likedvideos,message:"Removed from liked videos successfully!"})
        }catch(err){
            res.json({success:false,message:"Failed to remove the video",error:err.message})
        }
    })


router.route('/createPlaylist')
    .post(async (req,res)=>{
        try{
            const userId = req.user;
            const {playlistName} = req.body;
            let pushObj = {
                playlistName: playlistName
            }
            updatedUser = await User.findByIdAndUpdate({_id:userId},{
                $addToSet:{
                    playlist: pushObj
                }
            })
            res.json({success:true,updatedPlaylist:updatedUser.playlist})
        }catch(err){
            res.json({success:false,message:err.message})
        }
    })


router.route('/removePlaylist')
    .post(async(req,res)=>{
        try{
            const userId = req.user
            const {playlistName} = req.body
            const user = await User.findById(userId)
            const index = user.playlist.findIndex(a => a.playlistName === playlistName)
            user.playlist.splice(index,1)
            const updatedPlaylist = await user.save()
            res.json({success:true,message:"Playlist removed successfully"})
        }catch(err){
            res.json({success:false,message:err.message})
        }
    })


router.route('/addToPlaylist')
    .post(async(req,res)=>{
        try{
            const userId = req.user;
            const {playlist,videoId} = req.body
            user = await User.findOne({_id:userId})
            const selectedPlaylist = user.playlist.find(item=>item.playlistName === playlist)
            const isPresent = selectedPlaylist.videos.find(id => String(id) === videoId)
            if(!isPresent){
                upUser = user.playlist.find(item=>item.playlistName === playlist).videos.push(videoId)
            }
            updatedUser = await user.save()
            res.json({success:true,message:"Video added to playlist"})
        }catch(err){
            res.json({success:false,message:"Something went wrong",error:err.message})
        }
    })


router.route('/removeFromPlaylist')
    .post(async(req,res)=>{
        try{
            const userId = req.user
            const {playlistName,videoId} = req.body
            const user = await User.findById(userId)
            const index = user.playlist.findIndex(a => a.playlistName === playlistName)
            const update = user.playlist[index].videos.pull(videoId)
            const updatedPlaylist = await user.save()
            res.json({success:true,message:"Video successfully removed from the playlist"})
        }catch(err){
            res.json({success:false,message:err.message})
        }
    })


router.route('/playlist')
    .get(async(req,res)=>{
        try{
            userId = req.user;
            user = await User.findOne({_id:userId}).populate('playlist.videos')
            res.json({success:true,playlist:user.playlist})
        }catch(err){
            res.json({success:false,message:"Something went wrong",error:err.message})
        }
    })




module.exports = router