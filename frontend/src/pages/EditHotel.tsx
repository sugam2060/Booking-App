import { hotelType } from "../../../backend/src/shared/types"
import ManageHotelForm from "@/form/manageHotelForm/ManageHotelForm"
import { useLocation,useNavigate } from "react-router-dom"
import { useMutation , useQueryClient} from "react-query"
import * as apiClient from '../api-client'
import { useAppContext } from "@/contexts/AppContext"




const EditHotel = () => {
    const queryClient = useQueryClient()
    const location = useLocation()
    const {hotel}:{hotel:hotelType} = location.state
    const navigate = useNavigate()
    const {showToast} = useAppContext()
   
   const mutation = useMutation(apiClient.updateMyHotel,{
      onSuccess:async ()=>{
         showToast({messsage:'updated successfully',type:"SUCCESS"})
         await queryClient.resetQueries('fetchMyHotels')
         navigate('/my-hotels')
      },
      onError:()=>{
         showToast({messsage:'failed to update',type:'ERROR'})
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
            <ManageHotelForm hotel={hotel} onSave={onSave}  isLoading={mutation.isLoading}/>
            
            
            
    </div>
 )
}

export default EditHotel