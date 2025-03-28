import React, { useContext,useState } from "react"
import Toast from "../components/Toast"
import { useQuery } from "react-query"
import * as apiClient from '../api-client'


type ToastMessageType = {
    messsage: string,
    type: "SUCCESS" | "ERROR"
}

type AppContext = {
    showToast: (toastMessage: ToastMessageType) => void,
    isLogedIn: boolean,
    
}   


const AppContext = React.createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({children}:{children:React.ReactNode})=>{
    const [toast,setToast]  = useState<ToastMessageType | undefined>(undefined)

    

    const {isError} = useQuery("validateToken",apiClient.validateToken,{
        retry:false
    })



    return(
        
        <AppContext.Provider value={{
            showToast: (toastMessage) => {
                setToast(toastMessage)
            },
            isLogedIn:!isError,
        }}>
            {toast && (<Toast message={toast.messsage} type={toast.type} onClose={()=>setToast(undefined)}/>)}
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext)
    return context as AppContext
}