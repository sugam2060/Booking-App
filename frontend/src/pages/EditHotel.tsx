import { hotelType } from "../../../backend/src/shared/types"
import ManageHotelForm from "@/form/manageHotelForm/ManageHotelForm"
import { useLocation } from "react-router-dom"
import { useMutation } from "react-query"
import * as apiClient from '../api-client'




const EditHotel = () => {
    
    const location = useLocation()
    const {hotel}:{hotel:hotelType} = location.state
   
   const mutation = useMutation(apiClient.updateMyHotel,{
      onSuccess:()=>{

      },
      onError:()=>{

      }
   })
   
   const onSave = (formData:FormData) => {
      const Data = {
         formData,
         hotelid:hotel._id
      }
      mutation.mutate(Data)
   }

 return(
    <div>
            <ManageHotelForm hotel={hotel} onSave={onSave}  isLoading={false}/>
            
            
            
    </div>
 )
}

export default EditHotel