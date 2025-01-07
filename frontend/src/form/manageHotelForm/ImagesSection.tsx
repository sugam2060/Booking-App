import { useFormContext } from "react-hook-form"
import { HotelformData } from "./ManageHotelForm"



const ImagesSection = () => {
    const {register , formState: {errors},watch,setValue} = useFormContext<HotelformData>()

    const ExistingImages = watch('imageUrls') || []

    const handleDelete = (event:React.MouseEvent<HTMLButtonElement,MouseEvent>,imageData:string)=>{
        event.preventDefault()
    
        setValue('imageUrls',ExistingImages.filter((imgData) => imageData !== imgData))
    }

  return (
    <div>
        <h2 className="text-2xl font-bold mb-3">Images</h2>
        <div className="border rounded p-4 flex flex-col gap-4">
        {ExistingImages && 
            <div className="grid grid-cols-6 gap-4">
                {ExistingImages.map((image,idx)=>(
                    <div key={idx} className="relative group">
                        <img src={image} className="min-h-full object-cover"/>
                        <button onClick={(e)=> handleDelete(e,image)} className="absolute inset-0 flex items-center justify-center bg-black text-white bg-opacity-50 opacity-0 hover:opacity-100">Delete</button>
                    </div>
                ))}
            </div>
        }
            <input type='file' multiple accept="image/*" {...register('imageFiles',{
                validate: (imageFiles) => {
                    const totalLength = imageFiles.length + (ExistingImages.length || 0)
                    if(totalLength === 0) {
                        return 'At least one image should be added'
                    }
                    if(totalLength > 6){
                        return 'Total number of image cannot be more than 6'
                    }
                }
            })} className="w-full text-gray-700 font-normal" />
        </div>
        {errors.imageFiles && (
            <span className="text-red-500 text-sm font-bold">{errors.imageFiles.message}</span>
        )}
    </div>
  )
}

export default ImagesSection