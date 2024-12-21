import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import userRoute from './routes/userRoutes';
import userAuth from './routes/auth';
import cookieParser from 'cookie-parser'
import path from 'path'
import {v2 as cloudinary} from 'cloudinary'
import hotelRoute from './routes/myHotel';

//test
import gridRouter from './Database/gridfs/gridFs'

try {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=>{
        console.log("connected to database")
    })
} catch (error) {
    console.log(error)
}

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const app = express();
app.use(express.json())

app.use(cookieParser())

app.use(express.urlencoded({extended:true}))

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))

app.use(express.static(path.join(__dirname,'../../frontend/dist')))

app.use('/api/users',userRoute)

app.use('/api/auth',userAuth)

app.use('/api/my-hotels',hotelRoute)

//test

//app.use('/api/test-gridfs',gridRouter)


app.listen(5000,()=>{
    console.log("server up")
})