import express , {Request,Response} from 'express'
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

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=>{
    console.log('connected')
}).catch((err)=>{
    console.log(err)
})



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


// since we have bundled the frondend and backend so if the frontend url/routes are call than the express get confuse whether
// it is a api request or routing. so this endpoint will catch all the request which are not api request and send the request to
//frontend dist.index.html file
app.get('*',(req:Request,res:Response)=>{
    res.sendFile(path.join(__dirname,'../../frontend/dist/index.html'))
})




app.listen(5000,()=>{
    console.log("server up")
})