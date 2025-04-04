import { hotelFacilities } from "@/config/hotel-option-config"
import { useFormContext } from "react-hook-form"
import { HotelformData } from "./ManageHotelForm"

const FacilitiesSection = () => {

    const {register,formState: {errors}} = useFormContext<HotelformData>()

  return (
    <div>
        <h2 className="text-2xl font-bold mb-3">Facilities</h2>
        <div className="grid grid-cols-5 gap-3">
            {hotelFacilities.map((facility,idx)=>{
              return(
                <label key={idx} className="text-sm flex gap-1 text-gray-700">
                    <input type='checkbox' value={facility} {...register('facilities',{

                      validate: (facilities) => {
                        if(facilities && facilities.length > 0) {
                            return true
                        }else{
                          return "At least one Facility is required"
                        }
                      }
                    })}/>
                    {facility}
                </label>
              )
            })}
        </div>
        {errors.facilities && (
          <span  className="text-red-500 text-sm font-bold">{errors.facilities.message}</span>
        )}
    </div>
  )
}

export default FacilitiesSection