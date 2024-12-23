import { Router, Request, Response } from "express";
import multer from 'multer'
import cloudinary from 'cloudinary'
import validate from "../middlewares/verifyToken";
import hotelModel, { hotelType } from "../Database/models/hotel";
import { body } from "express-validator";
import { GridFsServices } from "../Database/gridFs/GridfsServices";
import { User } from "../Database/models/user";

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



hotelRoute.post('/test', validate, [
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
        
        HotelDetail.imageid = ImageIds
        HotelDetail.lastUpdated=new Date();
        HotelDetail.userid = req.userId
        console.log(HotelDetail.userid)

        const hotel = await hotelModel.create(HotelDetail)
        res.status(200).json({message:'Saved'})
        
    } catch (error) {
        console.log(error)
        res.status(400).json({message:'error'})
    }
})




export default hotelRoute