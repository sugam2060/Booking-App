import { channel } from 'diagnostics_channel'
import {MongoClient,GridFSBucket,ObjectId} from 'mongodb'
import { Readable } from 'stream'
import { imageIdType } from '../../shared/types'



export class GridFsServices {
    private client : MongoClient | null = null
    private bucket: GridFSBucket | null = null
    private bucketName: string | null = null
    private databaseName: string | null = null


    constructor(url:string,databaseName:string,bucketName:string){
        this.client = new MongoClient(url)
        this.bucketName = bucketName
        this.databaseName =  databaseName
    }


    async connect(): Promise<void> {
        try {
            await this.client?.connect();
            const db = this.client?.db(this.databaseName as string)
            if(db){
                this.bucket = new GridFSBucket(db,{
                    bucketName: this.bucketName as string
                })
            }
        } catch (error) {
            throw error
        }
    }


    async uploadFile(files:Express.Multer.File[]): Promise<string[]>{
        const fileIds : string[] = []
        try {
            for(const file of files){
                const uploadStream = this.bucket?.openUploadStream(file.originalname,{
                    contentType:file.mimetype
                })
                if(uploadStream){
                    uploadStream.write(file.buffer)
                    uploadStream.end()

                    fileIds.push(uploadStream.id.toString());
                }
            }
            return fileIds
        } catch (error) {
            throw error
        }
    }


    async fetchFile(fileIds: ObjectId[]): Promise<Buffer[]> {
        try {
            const imagePromise = fileIds.map(fileId => {
                return new Promise<Buffer>((resolve, reject) => {
                    const chunks: any[] = [];
                    const downloadStream = this.bucket?.openDownloadStream(fileId);
                    
                    if (!downloadStream) {
                        return reject(new Error(`Failed to open download stream for fileId: ${fileId}`));
                    }
    
                    downloadStream.on('data', (chunk) => {
                        chunks.push(chunk);
                    });
    
                    downloadStream.on('end', () => {
                        resolve(Buffer.concat(chunks));
                    });
    
                    downloadStream.on('error', (err) => {
                        reject(err);
                    });
                });
            });
    
            return await Promise.all(imagePromise);
        } catch (error) {
            throw error;
        }
    }


    async UpdateHotel(imageIds: imageIdType[],fileToUpload: Express.Multer.File[]) {
        try {
            if(!this.bucket){
                await this.connect()
                if(!this.connect){
                    throw new Error("failed to connect")
                }
            }

            await this.uploadFile(fileToUpload)

            for(const imageId of imageIds){
                const obj = new ObjectId(imageId.imageid)
                await this.bucket?.delete(obj)
            }

        } catch (error) {
            throw error
        }
    }
    

    async disconnect():Promise<void>{
        try{
            if(this.client){
                await this.client.close();
                
            }
        }catch(err){
            throw err
        }
    }

}