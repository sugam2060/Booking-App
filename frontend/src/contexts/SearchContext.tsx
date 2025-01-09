import { createContext, ReactNode, useContext, useState } from "react"

type SearchContext = {
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number,
    hotelId: string
    saveSearchValues: (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number
    ) => void
}

type SearchContextProviderPropsType = {
    children: ReactNode
}

const SearchContext = createContext<SearchContext | undefined>(undefined)


export const SearchContextProvider = ({ children }: SearchContextProviderPropsType) => {

    const [destination, setDestination] = useState<string>("")
    const [checkIn, setcheckIn] = useState<Date>(new Date())
    const [checkOut, setcheckOut] = useState<Date>(new Date())
    const [adultCount, setAdultCount] = useState<number>(1)
    const [childCount, setChildCount] = useState<number>(0)
    const [hotelId,setHotelId] = useState<string>("")

    const saveSearchValues = (destination: string, checkIn: Date, checkOut: Date, adultCount: number, childCount: number,hotelId?:string) => {
        setDestination(destination)
        setcheckIn(checkIn)
        setcheckOut(checkOut)
        setAdultCount(adultCount)
        setChildCount(childCount)
        if(hotelId){
            setHotelId(hotelId)
        }
    }

    return (
        <SearchContext.Provider value={{
            destination,
            checkIn,
            checkOut,
            childCount,
            adultCount,
            hotelId,
            saveSearchValues
        }}>
            {children}
        </SearchContext.Provider>
    )
}

export const useSearchContext = () => {
    const context = useContext(SearchContext)
    return context as SearchContext
}


