import mongoose from "mongoose";
import { hotelType, imageIdType } from "../../shared/types";


const hotelSchema = new mongoose.Schema<hotelType>({
    userid: {type: String, required:true},
    name: {type:String, required:true},
    city: {type: String, required: true},
    country:{type:String, required:true},
    description:{type:String,required:true},
    type: {type:String,required:true},
    adultCount: {type:Number, required:true},
    childCount: {type:Number, required:true},
    facilities: [{type:String,required:true}],
    pricePerNight: {type:Number,required:true},
    starRating: {type:Number,required:true, max:5, min:1},
    imageids: [
        {
            imageid:{type:String,required:true},
            Url:{type:String}
        }
    ],
    lastUpdated:{type:Date ,required:true}
},{timestamps:true})


const hotelModel = mongoose.model<hotelType>("Hotels",hotelSchema,'Hotels')


export const deleteImageId = async (imageIds: imageIdType[],hotelId:string) => {
    try {
        const deleteImage = await Promise.all(imageIds.map(async (image) => {
            await hotelModel.updateMany({_id:hotelId},{$ne:{}})
        }))
    } catch (error) {
        
    }
}

export default hotelModel