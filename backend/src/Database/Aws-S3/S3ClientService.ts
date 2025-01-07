import {S3Client,GetObjectCommand,PutObjectCommand,DeleteObjectCommand} from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'


export class AwsS3Services {
    private bucketName : string | null = null
    private region:string | null = null
    private accessKey: string | null = null
    private secretAccessKey: string | null = null
    private s3Client: S3Client | null = null

    constructor(bucketName:string,region:string,accessKey:string,secretAccessKey:string){
        this.bucketName = bucketName
        this.region = region
        this.accessKey = accessKey
        this.secretAccessKey = secretAccessKey

        this.s3Client = new S3Client({
            region:this.region,
            credentials:{
                accessKeyId:this.accessKey,
                secretAccessKey:this.secretAccessKey
            }
        })
    }

    // private async getPreSignedUrl(filename:string){
    //     const command = new GetObjectCommand({
    //         Key:filename,
    //         Bucket:this.bucketName as string
    //     })

    //     const url = await getSignedUrl(this.s3Client as S3Client,command,{expiresIn: 2 * 3600})
    //     return url
    // }

    public async PutObject(files:Express.Multer.File[]): Promise<string[]>{
        try {
            if(!this.s3Client){
                throw new Error('failed to initiailzed')
            }
            const Urls = []
            for(const file of files){
                const command = new PutObjectCommand({
                    Bucket:this.bucketName as string,
                    Body:file.buffer,
                    ContentType:file.mimetype,
                    Key:file.originalname,
                    
                })
                
                await this.s3Client.send(command)
                const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${file.originalname}`
                
                Urls.push(url)
            }
            return Urls
        } catch (error) {
            throw error
        }
    }


    public async UpdateFiles(urls:string[],files:Express.Multer.File[]): Promise<string[] | undefined>{
    
        try {
            for(const url of urls){
                const path = new URL(url)
                const key = path.pathname

                const command = new DeleteObjectCommand({
                    Bucket:this.bucketName as string,
                    Key: key.startsWith('/')? key.slice(1):key
                })

                await this.s3Client?.send(command)
            }
            if(!files || files.length === 0){
                return
            }else{
                const url = await this.PutObject(files)
                return url
            }
        } catch (error) {
            throw error
        }
    }


}