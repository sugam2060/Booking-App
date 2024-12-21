import { Router,Request,Response } from 'express'
import multer from 'multer'
import { GridFSBucket,MongoClient,ObjectId } from 'mongodb'
import { Stream } from 'stream'
import { time } from 'console'
import mongoose from 'mongoose'

const router = Router()

// types
interface fileResponse {
    fileId: ObjectId;
    filename:string,
    size:number
}

interface Iuser extends Document {
    username: string,
    email:string,
    image: ObjectId[]
}

const Schema = new mongoose.Schema<Iuser>({
    username:{type:String},
    email:String,
    images: [{type:mongoose.Schema.Types.ObjectId}]
})

const model = mongoose.model<Iuser>('test-gridFs',Schema)

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
            const user = await model.findByIdAndUpdate({userId},{$push:{images:{$each:fileIds}}},
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


// Express router setup

const gridfsService = new GridFSService()
gridfsService.connect().catch(console.error);


//upload endpoint

router.post('/',upload.array('imageFiles',6),async (req:Request,res:Response)=>{
    const {userId} = req.params
    try{
        if(!req.files || !Array.isArray(req.files)){
            res.status(400).json({message:'No files uploaded'})
        }else{
            const uploadPromises: Promise<fileResponse>[] = (req.files as Express.Multer.File[]).map(file => 
                gridfsService.uploadFile(file)
              );

            

            const uploadedFiles = await Promise.all(uploadPromises)

            const fileIds = uploadedFiles.map(file=>file.fileId)

            res.status(200).json({message:'saved'})

            const updateUser = await gridfsService.updateUserImage(userId,fileIds)
        }
    }catch(e){
        console.log(e)
        res.status(400).json({message:'failed to save'})
    }
})


router.post('/createuser',async (req:Request,res:Response) => {
    const {username,email} = req.body
    const user = await model.create({username,email})
    res.end();
})

export default router