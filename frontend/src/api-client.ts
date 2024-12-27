import { RegisterFormData,RegisterFormDataWithOTPType } from "./pages/Register";
import axios, { AxiosResponse } from "axios";
import { SigninFormData } from "./pages/Signin";
import { imageIdType } from "../../backend/src/shared/types";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''


export const requestOTP = async (formData: RegisterFormData) => {
        const response = await axios.post(`${API_BASE_URL}/api/users/register`,formData,{
            headers:{
                'Content-Type':'application/json'
            },
            withCredentials: true
        })
        return response.data.message
    
}


export const validateToken = async () => {
    try {
        const response: AxiosResponse = await axios.get(`${API_BASE_URL}/api/auth/validate-token`,{
            withCredentials: true,
        })

        return response.data
    } catch (error:any) {
        if(error.response){
            throw new Error("token invalid")
        }
        else{
            console.log(error);
            throw error
        }
    }
}


export const verifyOTP = async (data: RegisterFormDataWithOTPType) => {
    
        const response = await axios.post(`${API_BASE_URL}/api/users/verify-otp`,data,{
            withCredentials:true
        })
        return response.data.message
    
}


export const  signIn = async (formData: SigninFormData) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`,formData,{
        withCredentials:true,
        headers:{
            'Content-Type':"application/json"
        }
    })

    if(!response.status){
        throw new Error(response.data);
    }
    return response.data.message
}


export const signOut = async () => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/logout`,{},{
        withCredentials:true
    })

    if(!response.status){
        throw new Error("Error during sign out")
    }
}


export const addMyHotel = async (hotelFormData: FormData) => {
    const response = await axios.post(`${API_BASE_URL}/api/my-hotels/upload`,hotelFormData,{
        withCredentials:true,
    })

    if(!response.status){
        throw new Error("failed to add hotel")
    }
    console.log(response.data.message)
    return response.data.message
}



export const getHotelData = async () => {
    const res = await axios.get(`${API_BASE_URL}/api/my-hotels`,{
        withCredentials:true
    })
    if(res.status){
        return res.data
    }
    
}

export const fetchHotelImage = async (imageId:imageIdType[]): Promise<imageIdType[]> => {


    const res = await axios.post(`${API_BASE_URL}/api/my-hotels/image`,{ImageIds:imageId},{
        withCredentials:true,
    })

    if(res.status === 200){
        return res.data as imageIdType[]
    }else{
        throw Error
    }
}


// export const  updateMyHotel = async ({Data,hotelid}:{Data:FormData,hotelid:string}) => {
//     const res = await axios.put(`${API_BASE_URL}/api/my-hotels/${hotelid}`,Data,
//         {
//             withCredentials:true
//         ,
//         headers:{
//             'Content-Type':'multipart/form-data'
//         }
//     })

//     if(res.status === 200){
//         return res.data
//     }else{
//         throw new Error("failed")
//     }
// }