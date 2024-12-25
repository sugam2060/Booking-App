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