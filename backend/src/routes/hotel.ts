import {Router,Request,Response} from 'express'
import hotelModel from '../Database/models/hotel'
import { HotelSearchResponse } from '../shared/types'

const router = Router()

// /api/hotel/search
router.get("/search",async (req:Request,res:Response)=>{
    try {
        const pageSize = 5
        const pageNumber = parseInt(req.query.page?
            req.query.page.toString():
            "1"
        )

        const query = req.query;

        const skip = (pageNumber - 1) * pageSize 

        const hotels = await hotelModel.find({city:query.destination}).skip(skip).limit(pageSize);
        const total  = await hotelModel.countDocuments({city:query.destination})

        const response:HotelSearchResponse = {
            data: hotels,
            pagination:{
                total,
                page: pageNumber,
                pages: Math.ceil(total/pageSize)
            }
        }

        res.status(200).json(response)
    } catch (error) {
        console.log("error",error)
        res.status(500).json({message:'something went wrong'})
    }
})


export default router