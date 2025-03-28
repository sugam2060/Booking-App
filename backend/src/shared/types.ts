


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
    imageUrls: string[]
    lastUpdated: Date;
}


export type HotelSearchResponse = {
    data: hotelType[],
    pagination:{
        total:number,
        page:number,
        pages:number
    }
}