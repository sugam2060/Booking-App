import { useQuery } from "react-query"
import * as apiClient from '../api-client'
import { Link } from "react-router-dom"
import  {BsBuilding, BsMap} from 'react-icons/bs'
import { BiHotel, BiMoney, BiStar } from "react-icons/bi"
import { hotelType } from "../../../backend/src/shared/types"




const MyHotels = () => {

    const { data: HotelData } = useQuery<hotelType[]>("fetchMyHotels", apiClient.getHotelData, {
        onError: (e) => {
            console.log(e)
        }
    })





    console.log(HotelData)

    
    

    if(!HotelData) return


    

    return (
        <>
            {!HotelData?<span>Loading...</span>:
                <div className="space-y-5">
                <span className="flex justify-between">
                    <h1 className="text-3xl font-bold">My Hotels</h1>
                    <Link to='/add-hotel' className="flex bg-blue-600 text-white text-2xl font-bold p-2 hover:bg-blue-500">Add Hotel</Link>
                </span>
                <div className="grid grid-cols-1 gap-8">
                    {HotelData.map((hotel: hotelType,idx) => {
                        return (
                            
                            <div key={idx} className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5">
                                    <h2 className="text-2xl font-bold">{hotel.name}</h2>
                                    <div className=" break-words">
                                        {hotel.description}
                                    </div>
                                    <div className="grid grid-cols-5 gap-2">
                                        <div className="border border-state-300 rounded-sm p-3 items-center flex">
                                            <BsMap className="mr-1"/>
                                            {hotel.city},{hotel.country}
                                        </div>
                                        <div className="border border-state-300 rounded-sm p-3 items-center flex">
                                            <BsBuilding className="mr-1"/>
                                            {hotel.type}
                                        </div>
                                        <div className="border border-state-300 rounded-sm p-3 items-center flex">
                                            <BiMoney className="mr-1"/>
                                            Rs. {hotel.pricePerNight} per night
                                        </div>
                                        <div className="border border-state-300 rounded-sm p-3 items-center flex">
                                            <BiHotel className="mr-1"/>
                                            {hotel.adultCount} adults, {hotel.childCount} children
                                        </div>
                                        <div className="border border-state-300 rounded-sm p-3 items-center flex">
                                            <BiStar className="mr-1"/>
                                            {hotel.starRating} star rating
                                        </div>
                                    </div>
                                <span className="flex justify-end">
                                    <Link className="flex bg-blue-600 text-white test-xl font-bold p-2 hover:bg-blue-500" to={`/edit-hotel`} state={{hotel}}>View Details</Link>
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
            }
        </>
    )


    

}


export default MyHotels