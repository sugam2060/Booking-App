import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext"
import * as apiClient from '@/api-client'
// import { useState } from "react";
import { hotelType } from "../../../backend/src/shared/types";
import SearchResultCard from "@/components/SearchResultCard";


const Search = () => {

    const search = useSearchContext();

    // const [page,setPage] = useState<number>(1);

    const searchParams: apiClient.SearchParams = {
      destination:search.destination,
      checkIn:search.checkIn.toISOString(),
      checkOut:search.checkOut.toISOString(),
      adultCount:search.adultCount.toString(),
      childCount:search.childCount.toString(),
      page:"1"
    }
    
    const {data:hotelDate} = useQuery(["searchHotels",searchParams],()=>apiClient.searchHotel(searchParams))


  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
          </h3>
          {/* TODO Filter */}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
            <span className="text-xl font-bold">
              {hotelDate?.pagination.total} Hotels found
              {search?.destination ? ` in ${search.destination}`:""}
            </span>
        </div>
        {hotelDate?.data.map((hotel:hotelType)=>{
          return(
            <SearchResultCard hotel={hotel}/>
          )
        })}
      </div>
    </div>
  )
}

export default Search