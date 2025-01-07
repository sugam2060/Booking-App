import ManageHotelForm from "@/form/manageHotelForm/ManageHotelForm"
import { useMutation } from "react-query"
import * as apiClient from '../api-client'
import { useAppContext } from "@/contexts/AppContext"

const AddHotel = () => {
    const {showToast} = useAppContext()

    const mutation = useMutation(apiClient.addMyHotel,{
        onSuccess:() => {
            showToast({messsage:'Saved',type:'SUCCESS'})
        },
        onError: () => {
            showToast({messsage:'Failed to add hotels',type:'ERROR'})
        }
    })


    const handleSave = (hotelFormData: FormData) => {
        console.log(hotelFormData)
        mutation.mutate(hotelFormData)
    }
return (
    <ManageHotelForm onSave={handleSave} isLoading={mutation.isLoading}/>
)
}

export default AddHotel