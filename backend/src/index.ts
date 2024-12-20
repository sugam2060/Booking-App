import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import userRoute from './routes/userRoutes';
import userAuth from './routes/auth';
import cookieParser from 'cookie-parser'
import path from 'path'


try {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=>{
        console.log("connected to database")
    })
} catch (error) {
    console.log(error)
}

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


app.listen(5000,()=>{
    console.log("server up")
})