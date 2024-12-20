import { RegisterFormData,RegisterFormDataWithOTPType } from "./pages/Register";
import axios, { AxiosResponse } from "axios";

const registerAPIUrl = import.meta.env.VITE_REGISTER_ENDPOINT
const validate_Token_endpoint = import.meta.env.VITE_VALIDATE_TOKEN_ENDPOINT
const verifyOtpEndpoint = import.meta.env.VITE_VERIFY_OTP_ENDPOINT

export const requestOTP = async (formData: RegisterFormData) => {
        const response = await axios.post(registerAPIUrl,formData,{
            headers:{
                'Content-Type':'application/json'
            },
            withCredentials: true
        })
        return response.data.message
    
    
    
}


export const validateToken = async () => {
    try {
        const response: AxiosResponse = await axios.get(validate_Token_endpoint,{
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
    
        const response = await axios.post(verifyOtpEndpoint,data,{
            withCredentials:true
        })
        return response.data.message
    
}