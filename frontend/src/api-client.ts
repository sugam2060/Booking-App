import { RegisterFormData,RegisterFormDataWithOTPType } from "./pages/Register";
import axios, { AxiosResponse } from "axios";
import { SigninFormData } from "./pages/Signin";

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