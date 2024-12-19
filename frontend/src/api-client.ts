import { RegisterFormData } from "./pages/Register";
import axios from "axios";

const registerAPIUrl = import.meta.env.VITE_REGISTER_ENDPOINT

export const register = async (formData: RegisterFormData) => {
    const response = await axios.post(registerAPIUrl,formData,{
        headers:{
            'Content-Type':'application/json'
        }
    })
}