import { hotelType, imageIdType } from "../../../backend/src/shared/types"
import { useMutation } from "react-query"
import * as apiClient from '../api-client'
import {  useEffect, useState } from "react"
import { convertToBlob } from "@/function/convertToBlob"
import { useAppContext } from "@/contexts/AppContext"
import ManageHotelForm from "@/form/manageHotelForm/ManageHotelForm"
import { useLocation } from "react-router-dom"





const EditHotel = () => {
    
    const location = useLocation()
    const {hotel}:{hotel:hotelType} = location.state
    const {showToast} = useAppContext()

    const [isLoading,setIsLoading] = useState(false)



    const mutateImage = useMutation(apiClient.fetchHotelImage,{
        onSuccess:async (data:imageIdType[])=>{
            setIsLoading(true)
            const BlobUrl = await convertToBlob(data)
            hotel.imageids = BlobUrl
            setIsLoading(false)
        },
        onError:()=>{
            showToast({messsage:"Can't fetch Images of hotel",type:'ERROR'})
            setIsLoading(false)
        }
    })

    useEffect(()=>{

        mutateImage.mutate(hotel.imageids)
        
    },[hotel])

    
    const mutateDelImage = useMutation(apiClient.updateMyHotel,{
        onSuccess:()=>{

        },
        onError:()=>{

        }
    })

    const handleSave = (hotelFormData:FormData) => {
        if(!hotel._id) return
        mutateDelImage.mutate({Data:hotelFormData,hotelid:hotel._id})
    }



 return(
    <div>
            <ManageHotelForm hotel={hotel} onSave={handleSave}  isLoading={isLoading}/>
            
            
    </div>
 )
}

export default EditHotel