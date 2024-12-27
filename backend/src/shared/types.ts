
export type imageIdType = {
    imageid :string;
    Url: string
}


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
    imageids: imageIdType[]
    lastUpdated: Date;
}