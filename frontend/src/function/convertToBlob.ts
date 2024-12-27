import { imageIdType } from "../../../backend/src/shared/types"


export const  convertToBlob = async (ImageId: imageIdType[]): Promise<imageIdType[]> => {

    const blobURL = await Promise.all(

        ImageId.map((base64Image)=>{
            const byteCharacter = atob(base64Image.Url)
            const byteNumbers = Array.from(byteCharacter, char => char.charCodeAt(0))
            const ByteArray = new Uint8Array(byteNumbers)
            const blob = new Blob([ByteArray], { type: 'image/jpeg' })
            return URL.createObjectURL(blob)
        })
    )

    ImageId.forEach((image,idx)=>{
        image.Url = blobURL[idx]
    })
    
    return ImageId
}