import { Router, Request, Response } from "express";
import multer from 'multer'
import cloudinary from 'cloudinary'
import validate from "../middlewares/verifyToken";
import hotelModel from "../Database/models/hotel";
import { hotelType, imageIdType } from "../shared/types";
import { body } from "express-validator";
import { GridFsServices } from "../Database/gridFs/GridfsServices";
import { ObjectId } from "mongodb";
import { error } from "console";
import { url } from "inspector";
import { arrayBuffer } from "stream/consumers";
const hotelRoute = Router();

// const storage = multer.memoryStorage()

// const upload = multer({
//     storage,
//     limits: {
//         fileSize: 20 * 1024 * 1024 //20MB
//     }
// })



// // api/my-hotels

// hotelRoute.post('/',validate,[
//     body('name').notEmpty().withMessage('Name is required'),
//     body('city').notEmpty().withMessage('City is required'),
//     body('country').notEmpty().withMessage('Country is Required'),
//     body('description').notEmpty().withMessage('Description is Required'),
//     body('type').notEmpty().withMessage('Hotel type required'),
//     body('pricePerNight').notEmpty().isNumeric().withMessage('Price per Night is Required and mush be a number'),
//     body('facilities').notEmpty().isArray().withMessage('Facilities are required'),
//     body('adultCount').notEmpty().isNumeric().withMessage('adult count required'),
//     body('childCount').isNumeric().withMessage('must be a number'),
//     body('starRating').isNumeric().withMessage('rating must be a number')
// ],upload.array("imageFiles",6),async (req:Request,res:Response)=>{
//     try{
//         const imageFiles = req.files as Express.Multer.File[];
//         const HotelDetail:hotelType = req.body;

//         const uploadPromises = imageFiles.map(async(image)=>{
//             const base64 = Buffer.from(image.buffer).toString('base64');
//             let dataURL = "data:" + image.mimetype + ";base64," +base64;
//             const res = await cloudinary.v2.uploader.upload(dataURL)
//             return res.url;
//         })



//         const imageUrl = await Promise.all(uploadPromises)


//         HotelDetail.imageUrls = imageUrl

//         HotelDetail.lastUpdated = new Date();

//         HotelDetail.userid = req.userId
//         console.log('control reached')
//         const hotel = new hotelModel(HotelDetail);
//         await hotel.save()

//         res.status(201).json({message:'Saved'})

//     }catch(e){
//         console.log('error creating hotel',e);
//         res.status(500).json({message:'something went wrong'})
//     }
// })

//------------------------------------------------------------------------------------------------------------------------------------

const gridfsService = new GridFsServices(process.env.MONGODB_IMAGE_DB_CONNECTION_STRING as string, 'booking-app-images', 'HotelImages')


const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits: {
        fileSize: 20 * 1024 * 1024
    }
})



hotelRoute.post('/upload', validate, [
    body('name').notEmpty().withMessage('Name is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('country').notEmpty().withMessage('Country is Required'),
    body('description').notEmpty().withMessage('Description is Required'),
    body('type').notEmpty().withMessage('Hotel type required'),
    body('pricePerNight').notEmpty().isNumeric().withMessage('Price per Night is Required and mush be a number'),
    body('facilities').notEmpty().isArray().withMessage('Facilities are required'),
    body('adultCount').notEmpty().isNumeric().withMessage('adult count required'),
    body('childCount').isNumeric().withMessage('must be a number'),
    body('starRating').isNumeric().withMessage('rating must be a number')
], upload.array('imageFiles', 6), async (req: Request, res: Response) => {
    try {
    
        const imageFiles = req.files as Express.Multer.File[];
        const HotelDetail: hotelType = req.body;
        
        await gridfsService.connect()

        const ImageIds = await gridfsService.uploadFile(imageFiles)

        if(!ImageIds || ImageIds.length === 0){
            throw new Error('failed to upload')
        }

        HotelDetail.imageids = HotelDetail.imageids || [];

        HotelDetail.imageids = ImageIds.map((id,idx) => ({
            imageid:id,
            Url:''
        }))

        HotelDetail.lastUpdated=new Date();
        HotelDetail.userid = req.userId


        const hotel = await hotelModel.create(HotelDetail)
        res.status(200).json({message:'Saved'})
        
    } catch (error) {
        console.log(error)
        res.status(400).json({message:'error'})
    }
})



hotelRoute.get('/',validate,async (req:Request,res:Response)=>{
    const userId = req.userId
    try{
        const response = await hotelModel.find({userid:userId})
        if(response){
            res.status(200).json(response);
        }else{
            res.status(400).send('Cannot find the user')
        }
    }catch(err){
        console.log(err)
        res.status(500).send('something went wrong')
    }
})


hotelRoute.post('/image', async (req: Request, res: Response) => {
    try{
        const {ImageIds}:{ImageIds:imageIdType[]} = req.body
        
        if(!ImageIds){
            throw new Error('Failed to receive id')
        }

        const filesId = ImageIds.map(image => image.imageid)

        await gridfsService.connect()

        if(!ImageIds || ImageIds.length === 0){
            res.status(400).send('No image found')
        }else{
            const ImageObjArr = filesId.map((image)=> new ObjectId(image))

            const ImageBuffer = await gridfsService.fetchFile(ImageObjArr);
            const base64Image = ImageBuffer.map((ImageFile)=> ImageFile.toString('base64'))

            ImageIds.forEach((image,idx)=>{
                image.Url = base64Image[idx];
            })
                
            res.status(200).json(ImageIds)
            
        }
    }catch(err){
        res.status(500).send('something went wrong')
        console.log(err)
    }
});

hotelRoute.put('/:hotelid',validate,upload.array('imageFiles'),async (req:Request,res:Response)=>{
    try {
        const HotelDetails = req.body as hotelType
        const hotelid = req.params.hotelid as string
        const files = req.files as Express.Multer.File[]

        const imageids:imageIdType[] = typeof HotelDetails.imageids === 'string'? JSON.parse(HotelDetails.imageids):HotelDetails.imageids
        
        await gridfsService.connect()
        
        const newFileIds = await gridfsService.UpdateHotel(imageids,files)

       
        console.log(newFileIds)    
        

        res.status(200).send('deleted')

    } catch (error) {
        
    }
})


export default hotelRoute