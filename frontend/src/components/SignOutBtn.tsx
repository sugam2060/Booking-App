import { useMutation,useQueryClient } from "react-query"
import * as apiClient from '../api-client'
import { useAppContext } from "@/contexts/AppContext"
import { useNavigate } from "react-router-dom"

const SignOutBtn = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const {showToast} = useAppContext()
    const mutation = useMutation(apiClient.signOut,{
        onSuccess:async ()=> {
            showToast({messsage:'logged out successfully',type:'SUCCESS'});
            await queryClient.invalidateQueries('validateToken')
            navigate('/',{replace:true});
        },
        onError: (error:Error) => {
            showToast({messsage:error.message,type:'ERROR'})
        }
    })

    const handleClick = () => {
        mutation.mutate();
    }

    return (
        <button className="text-blue-600 px-3 font-bold hover:bg-gray-100 bg-white rounded-sm" onClick={handleClick}>
            sign out
        </button>
    )
}

export default SignOutBtn