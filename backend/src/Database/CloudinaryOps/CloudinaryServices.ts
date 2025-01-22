import cloudinary from 'cloudinary'



export class CloudinaryServices{


    public async cloudinaryUpload(imageFiles: Express.Multer.File[]) {
        const uploadPromise = imageFiles.map(async (image) => {
            const b64String = Buffer.from(image.buffer).toString("base64");
            const dataURI = `data:${image.mimetype};base64,${b64String}`;
            const res = await cloudinary.v2.uploader.upload(dataURI);
            return res.url;
        });
    
        const imageUrls = await Promise.all(uploadPromise);
        return imageUrls;
    }
    
    private async extractPublicIds(urls:string[])  {

        const publicIds = urls.map(url=>{
            const urlObj = new URL(url)
            const pathParts =urlObj.pathname.split('/')
            const publicId = pathParts.slice(pathParts.findIndex(part=>part.startsWith('v'))+1).join('/').split('.')[0];
            return publicId
        })
    
        return publicIds
    }
    
    public async cloudinaryDelete(urls:string[]) {
    
        const publicIds = await this.extractPublicIds(urls)
        try {
            await cloudinary.v2.api.delete_resources(publicIds)
        } catch (error) {
            throw error
        }
    
    }
}