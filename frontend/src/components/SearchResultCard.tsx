import { hotelType } from "../../../backend/src/shared/types"
import { AiFillStar } from 'react-icons/ai'

type Props = {
    hotel: hotelType
}

const SearchResultCard = ({ hotel }: Props) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8">
            <div className="w-full h-[300px]">
                <img src={hotel.imageUrls[0]} className="w-full h-full object-cover object-center" />
            </div>
            <div className="grid grid-rows-[0.5fr_2fr_1fr]">
                <div>
                    <div className="flex items-center">
                        <span className="flex">
                            {Array.from({ length: hotel.starRating }).map(() => (
                                <AiFillStar className="fill-yellow-400" />
                            ))}
                        </span>
                        <span className="ml-1 text-sm">{hotel.type}</span>
                    </div>
                    <h2 className="text-2xl font-bold cursor-pointer">{hotel.name}</h2>
                </div>
                <div>
                    <div className="line-clamp-4">
                        {hotel.description}
                    </div>
                </div>
                <div className="grid grid-cols-2 items-end whitespace-nowrap">
                    <div className="flex gap-1 items-center">
                        {hotel.facilities.slice(0, 3).map((facility: string) => (
                            <span className="bg-slate-300 p-2 rounded-lg font-bold test-xs whitespace-nowrap">
                                {facility}
                            </span>
                        ))}
                        <span className="text-sm">
                            {hotel.facilities.length > 3 &&
                                `+${hotel.facilities.length - 3} more`
                            }
                        </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="font-bold">
                            ${hotel.pricePerNight} per nigth
                        </span>
                        <button className="bg-blue-600 text-white h-full p-2 font-bold text-xl rounded-md max-w-fit hover:bg-blue-500">View More</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchResultCard