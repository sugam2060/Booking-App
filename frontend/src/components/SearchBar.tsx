import React from "react";
import { DateRange } from "react-day-picker";
import { addYears } from "date-fns";
import { useSearchContext } from "@/contexts/SearchContext"
import { FormEvent, useState } from "react";
import { DatePickerWithRange } from "./ui/DatePickerWithRange";
import { MdTravelExplore } from "react-icons/md";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {

    const search = useSearchContext();
    const navigate = useNavigate()

    const [destination, setDestination] = useState<string>(search.destination)
    const [checkIn, setCheckIn] = useState<Date>(search.checkIn)
    const [checkOut, setCheckOut] = useState<Date>(search.checkOut)
    const [adultCount, setAdultCount] = useState<number | "">(search.adultCount)
    const [childCount, setChildCount] = useState<number | "">(search.childCount)

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: addYears(new Date(), 1),
    });

    const handleInitialDate = (startDate: Date | undefined) => {
        if (startDate) {
            setCheckIn(startDate);
        }
    }

    const handleEndDate = (endDate: Date | undefined) => {
        if (endDate) {
            setCheckOut(endDate);
        }
    }


    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        search.saveSearchValues(destination, checkIn, checkOut, adultCount, childCount)
        navigate('/search');
    }





    return (
        <form className="-mt-7 p-3 gap-4 w-full bg-orange-400 focus:outline-none rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-center" onSubmit={handleSubmit}>


            <div className="flex flex-row items-center flex-1 bg-white p-2 rounded-md">
                <MdTravelExplore size={25} className="mr-2 text-gray-500" />
                <input
                    type="text"
                    placeholder="Where are you going?"
                    className="text-md w-full focus:outline-none"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
            </div>

            <div className="flex flex-col sm:flex-row bg-white px-2 py-1 gap-2 rounded-md">
  <label className="items-center flex flex-1 min-w-0">
    <span className="mr-1 text-sm">Adults:</span>
    <input
      type="number"
      className="w-full p-1 focus:outline-none font-bold text-right"
      min={1}
      max={3}
      value={adultCount}
      onChange={(e) => {
        const value = e.target.value;
        setAdultCount(value === "" ? "" : parseInt(value, 10));
      }}
    />
  </label>
  <label className="items-center flex flex-1 min-w-0">
    <span className="mr-1 text-sm">Children:</span>
    <input
      type="number"
      className="w-full p-1 focus:outline-none font-bold text-right"
      min={0}
      max={2}
      value={childCount}
      onChange={(e) => {
        const value = e.target.value;
        setChildCount(value === "" ? "" : parseInt(e.target.value));
      }}
    />
  </label>
</div>


            <DatePickerWithRange handleEndDate={handleEndDate} handleInitialDate={handleInitialDate} setDate={setDate} date={date} />


            <div className="flex gap-2 col-span-1 sm:col-span-2 lg:col-span-2">
                <Button
                    type="submit"
                    className="flex-grow bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 transition-colors"
                    onClick={handleSubmit}
                >
                    Search
                </Button>
                <Button
                    type="button"
                    variant="destructive"
                    className="flex-grow font-bold text-lg transition-colors"
                    onClick={() => {
                        setDestination("")
                        setAdultCount(1)
                        setChildCount(0)
                        setDate(undefined)
                    }}
                >
                    Clear
                </Button>
            </div>

        </form>
    )
}

export default SearchBar