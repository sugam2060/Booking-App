import { Router, Request, Response } from "express";
import multer from 'multer'
import cloudinary from 'cloudinary'
import validate from "../middlewares/verifyToken";
import hotelModel from "../Database/models/hotel";
import { hotelType } from "../shared/types";
import { body } from "express-validator";



const hotelRoute = Router();

const storage = multer.memoryStorage()

const upload = multer({
    storage,
    limits: {
        fileSize: 20 * 1024 * 1024 //20MB
    }
})


async function cloudinaryUpload(imageFiles: Express.Multer.File[]) {
    const uploadPromise = imageFiles.map(async (image) => {
        const b64String = Buffer.from(image.buffer).toString("base64");
        const dataURI = `data:${image.mimetype};base64,${b64String}`;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
    });

    const imageUrls = await Promise.all(uploadPromise);
    return imageUrls;
}

const extractPublicIds = (urls:string[]) => {
    const publicIds = urls.map(url=>{
        const urlObj = new URL(url)
        const pathParts =urlObj.pathname.split('/')
        const publicId = pathParts.slice(pathParts.findIndex(part=>part.startsWith('v'))+1).join('/').split('.')[0];
        return publicId
    })

    return publicIds
}

const cloudinaryDelete = async (urls:string[]) => {

    const publicIds = extractPublicIds(urls)
    try {
        await cloudinary.v2.api.delete_resources(publicIds)
    } catch (error) {
        throw error
    }

}


// api/my-hotels


hotelRoute.post('/', validate, [
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
], upload.array("imageFiles", 6), async (req: Request, res: Response) => {
    try {
        const imageFiles = req.files as Express.Multer.File[];
        const HotelDetail: hotelType = req.body;


        // cloudinary Upload

        const imageUrls = await cloudinaryUpload(imageFiles);

        HotelDetail.imageUrls = imageUrls

        HotelDetail.lastUpdated = new Date();

        HotelDetail.userid = req.userId

        const hotel = new hotelModel(HotelDetail);
        await hotel.save()

        res.status(201).json({ message: 'Saved' })

    } catch (e) {
        console.log('error creating hotel', e);
        res.status(500).json({ message: 'something went wrong' })
    }
})


hotelRoute.get('/', validate, async (req: Request, res: Response) => {
    try {
        const hotelDetail = await hotelModel.find({
            userid: req.userId
        })
        if (hotelDetail.length === 0) {
            res.status(400).send('No image Found')
        } else {
            res.status(200).json(hotelDetail)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Something went wrong')
    }
})


hotelRoute.put('/:hotelid', [
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
]
    , validate, upload.array('imageFiles'), async (req: Request, res: Response) => {
        try {
            const updatedHotel :hotelType = req.body

            const imageFiles = req.files as Express.Multer.File[]

            const ExistingImage = await hotelModel.findOne({_id:req.params.hotelid,userid:req.userId},{imageUrls:1,_id:0})
            const imageurl = ExistingImage?.imageUrls as string[]
            

            const ImageToDelete = imageurl.filter(image => !updatedHotel.imageUrls.some(url => image.includes(url)))

            await cloudinaryDelete(ImageToDelete)

            if(imageFiles){
                const newImageUrls = await cloudinaryUpload(imageFiles)

                updatedHotel.imageUrls = [...newImageUrls,
                    ...(updatedHotel.imageUrls || [])]
            }

            const hotel = await hotelModel.findOneAndUpdate({
                _id:req.params.hotelid,
                userid:req.userId
            },updatedHotel,{new:true})

            res.send(hotel)

        } catch (error) {
            throw error
        }
    })



//------------------------------------------------------------------------------------------------------------------------------------

// const gridfsService = new GridFsServices(process.env.MONGODB_IMAGE_DB_CONNECTION_STRING as string, 'booking-app-images', 'HotelImages')


// const storage = multer.memoryStorage()
// const upload = multer({
//     storage,
//     limits: {
//         fileSize: 20 * 1024 * 1024
//     }
// })



// hotelRoute.post('/upload', validate, [
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
// ], upload.array('imageFiles', 6), async (req: Request, res: Response) => {
//     try {

//         const imageFiles = req.files as Express.Multer.File[];
//         const HotelDetail: hotelType = req.body;

//         await gridfsService.connect()

//         const ImageIds = await gridfsService.uploadFile(imageFiles)

//         if(!ImageIds || ImageIds.length === 0){
//             throw new Error('failed to upload')
//         }

//         HotelDetail.imageids = HotelDetail.imageids || [];

//         HotelDetail.imageids = ImageIds.map((id,idx) => ({
//             imageid:id,
//             Url:''
//         }))

//         HotelDetail.lastUpdated=new Date();
//         HotelDetail.userid = req.userId


//         const hotel = await hotelModel.create(HotelDetail)
//         res.status(200).json({message:'Saved'})

//     } catch (error) {
//         console.log(error)
//         res.status(400).json({message:'error'})
//     }
// })



// hotelRoute.get('/',validate,async (req:Request,res:Response)=>{
//     const userId = req.userId
//     try{
//         const response = await hotelModel.find({userid:userId})
//         if(response){
//             res.status(200).json(response);
//         }else{
//             res.status(400).send('Cannot find the user')
//         }
//     }catch(err){
//         console.log(err)
//         res.status(500).send('something went wrong')
//     }
// })


// hotelRoute.post('/image', async (req: Request, res: Response) => {
//     try{
//         const {ImageIds}:{ImageIds:imageIdType[]} = req.body

//         if(!ImageIds){
//             throw new Error('Failed to receive id')
//         }

//         const filesId = ImageIds.map(image => image.imageid)

//         await gridfsService.connect()

//         if(!ImageIds || ImageIds.length === 0){
//             res.status(400).send('No image found')
//         }else{
//             const ImageObjArr = filesId.map((image)=> new ObjectId(image))

//             const ImageBuffer = await gridfsService.fetchFile(ImageObjArr);
//             const base64Image = ImageBuffer.map((ImageFile)=> ImageFile.toString('base64'))

//             ImageIds.forEach((image,idx)=>{
//                 image.Url = base64Image[idx];
//             })

//             res.status(200).json(ImageIds)

//         }
//     }catch(err){
//         res.status(500).send('something went wrong')
//         console.log(err)
//     }
// });

// hotelRoute.put('/:hotelid',validate,upload.array('imageFiles'),async (req:Request,res:Response)=>{
//     try {
//         const HotelDetails = req.body as hotelType

//         const files = req.files as Express.Multer.File[]

//         const imageids:imageIdType[] = typeof HotelDetails.imageids === 'string'? JSON.parse(HotelDetails.imageids):HotelDetails.imageids

//         await gridfsService.connect()

//         const newFileIds = await gridfsService.UpdateHotel(imageids,files)


//         console.log(newFileIds)    


//         res.status(200).send('deleted')

//     } catch (error) {

//     }
// })


export default hotelRoute


