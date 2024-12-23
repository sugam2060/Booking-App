import mongoose from "mongoose";


export type hotelType = {
    _id: string;
    userid: string;
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    adultCount: number;
    childCount:  number;
    facilities: string[];
    pricePerNight: number;
    starRating:number;
    imageid: string[];
    lastUpdated: Date;
}


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
    imageid: [{type:String,required:true}],
    lastUpdated:{type:Date ,required:true}
},{timestamps:true})


const hotelModel = mongoose.model<hotelType>("Hotels",hotelSchema,'Hotels')

export default hotelModel