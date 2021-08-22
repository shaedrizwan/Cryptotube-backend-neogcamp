const express = require('express');
const app = express();
const cors = require('cors')
const {initializeDB} = require('./database/db.connect')

require('dotenv').config();
initializeDB()
app.use(express.json())

app.use(cors())

const videoRoute = require('./routes/video.route')
const userRoute = require("./routes/user.route")


app.use('/video',videoRoute)
app.use('/user',userRoute)

app.get('/',(req,res)=>{
  res.json("Welcome to the CryptoTube Video Library Server. This project is developed by Shahid Rizwan")
})


// Error Handler
app.use((err,req,res,next)=>{
  res.json({success:false,error: err,message:err.message })
})


// 404 route handler
app.use((req,res)=>{
  res.status(404).json({success:false,message:`Not found`})
})


app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});