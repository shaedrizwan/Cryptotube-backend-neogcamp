const express = require('express');
const router = express.Router();
const Video = require('../models/videos.model')
const {extend} = require('lodash')
const checkVideo = require('../middlewares/video.middleware')

router.route('/')
  .get(async (req,res)=>{
      try{
          const data = await Video.find({})
          res.json({route:"video",success:true,videos:data})
      }
      catch(err){
          res.status(500).json({success:false,message:err.message})
      }
  })

  .post(async (req,res)=>{
      try{
      const data = req.body
      const newVideo = new Video(data)
      const savedProduct = await newVideo.save()
      res.json({success:true,savedProduct})
      }catch(err){
        res.json({success:false,message:err.message})
      }
    })

  router.use('/:videoId',checkVideo)

  router.route('/:videoId')
  .get((req,res)=>{
      video = req.video
      res.json({success:true,video})
  })

  .post(async (req,res)=>{
    videoIn = req.video
    const dataToUpdate = req.body;
    videoIn = extend(videoIn,dataToUpdate)
    videoIn = await videoIn.save()
    res.json({success:true,video:videoIn})
  })

module.exports = router