


export const  convertToBlob = async (ImageId: string[]) => {

    const blobURL = await Promise.all(

        ImageId.map(base64Image=>{
            const byteCharacter = atob(base64Image)
            const byteNumbers = Array.from(byteCharacter, char => char.charCodeAt(0))
            const ByteArray = new Uint8Array(byteNumbers)
            const blob = new Blob([ByteArray], { type: 'image/jpeg' })
            return URL.createObjectURL(blob)
        })
    )

    return blobURL
}