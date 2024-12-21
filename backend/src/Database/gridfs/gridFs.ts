import { Router,Request,Response } from 'express'
import multer from 'multer'
import { GridFSBucket,MongoClient,ObjectId } from 'mongodb'
import { Stream } from 'stream'
import { time } from 'console'
import mongoose from 'mongoose'
import hotelModel from '../models/hotel'

const router = Router()

// types
interface fileResponse {
    fileId: ObjectId;
    filename:string,
    size:number
}






// mongodb connection config
const MongoURL = process.env.MONGODB_CONNECTION_STRING as string
const DBName = 'hotel_images'

// configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits:{
        fileSize: 5 * 1024*1024, //5MB
        files: 6
    }
})


class GridFSService {
    private bucket: GridFSBucket | null = null
    private client:MongoClient | null = null

    async connect():Promise<void> {
        try{
            this.client =  await MongoClient.connect(MongoURL)
            const db = this.client.db(DBName)
            this.bucket = new GridFSBucket(db)
        }catch(e){
            console.log("failed to connect to mongodb",e)
            throw e
        }
    }

    async uploadFile(file:Express.Multer.File):Promise<fileResponse> {
        if(!this.bucket){
            throw new Error('GridFs bucket not initialized')
        }
        return new Promise<fileResponse>((resolve,reject)=>{
            const readableStream = new Stream.Readable();
            readableStream.push(file.buffer)
            readableStream.push(null);

            const timeStamp = Date.now();
            const fileName = `${timeStamp}-${file.originalname}`

            const uploadStream = this.bucket!.openUploadStream(fileName,{
                contentType:file.mimetype
            })

            readableStream.pipe(
                uploadStream
            ).on('error',(error)=>{
                console.log('Error uploading file',error)
                reject(error);
            }).on('finish',()=>{
                resolve({
                    fileId: uploadStream.id,
                    filename:fileName,
                    size: file.size
                })
            })
        })
    }

    async updateUserImage(userId:string,fileIds: ObjectId[])  {
        try {
            const user = await hotelModel.findByIdAndUpdate({_id:userId},{$push:{images:{$each:fileIds}}},
                {new:true}
            )
            if(!user){
                throw new Error('user not found')
            }

            return user
        } catch (e) {
            throw new Error("failed to update")
        }
    }


    async  disconnect(): Promise<void>  {
        if(this.client){
            await this.client.close();
        }
    }
}


//the above class can create a gridfs and store the files

// Express router setup

