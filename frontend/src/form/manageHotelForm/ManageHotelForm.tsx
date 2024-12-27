import { useForm ,FormProvider} from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestSection from "./GuestSection";
import ImagesSection from "./ImagesSection";
import { hotelType,imageIdType } from "../../../../backend/src/shared/types";
import { useEffect } from "react";




export type HotelformData = {
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
    imageFiles: FileList;
    imageids: imageIdType[]
}

type propsType = {
    hotel?:hotelType
    onSave: (hotelFormData: FormData) => void,
    isLoading: boolean
}

const ManageHotelForm = ({hotel,onSave,isLoading}:propsType) => {

    const formMethods = useForm<HotelformData>()
    const {handleSubmit,reset} = formMethods

    
    

    useEffect(()=>{

        reset(hotel)

    },[hotel,hotel?.imageids[0].Url,reset])

    const onSubmit = handleSubmit((formDataJson: HotelformData)=>{
       
        const formData = new FormData();

        if(hotel){
            formData.append('imageids',JSON.stringify(formDataJson.imageids))
        }
        
        formData.append('name',formDataJson.name);
        formData.append('city',formDataJson.city);
        formData.append('country',formDataJson.country);
        formData.append('description',formDataJson.description)
        formData.append('type',formDataJson.type)
        formData.append('pricePerNight',formDataJson.pricePerNight.toString())
        formData.append('starRating',formDataJson.starRating.toString())
        formData.append('adultCount',formDataJson.adultCount.toString())
        formData.append('childCount',formDataJson.childCount.toString())

        formDataJson.facilities.forEach((facility,index)=>{
            formData.append(`facilities[${index}]`,facility)
        })

        Array.from(formDataJson.imageFiles).forEach((imageFile)=>{
            formData.append(`imageFiles`,imageFile)
        })

        onSave(formData)

    })

  return (
        <FormProvider {...formMethods}>
            <form className="flex flex-col gap-10" onSubmit={onSubmit}>
                <DetailsSection/>
                <TypeSection/>
                <FacilitiesSection/>
                <GuestSection/>
                <ImagesSection/>
                <span className="flex justify-end">
                    <button type='submit' className="bg-blue-600 text-white rounded-lg px-3 py-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500" disabled={isLoading}>
                        {isLoading?'Saving...':'Save'}
                    </button>
                </span>
            </form>
        </FormProvider>
  )
}

export default ManageHotelForm