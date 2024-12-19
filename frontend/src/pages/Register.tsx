import { useForm } from "react-hook-form"
import * as apiClient from "../api-client"
import { useMutation } from "react-query"
import { useAppContext } from "../contexts/AppContext"

export type RegisterFormData = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
}

const Register = () => {
    const {showToast} = useAppContext()
    const {register,watch ,handleSubmit, formState:{errors}} = useForm<RegisterFormData>();

    const mutation = useMutation(apiClient.register,{
        onSuccess:()=>{
            showToast({messsage:"Registration successfull", type:'SUCCESS'})
        },
        onError:(error:Error)=>{
            showToast({messsage:error.message,type:'ERROR'})
        }
    })

    const onSubmit = handleSubmit( async (data)=>{
        mutation.mutate(data);
    })

  return (
    <form className="flex flex-col gap-5 " onSubmit={onSubmit}>
        <h2 className="text-3xl font-bold">Create an Account</h2>
        <div className="flex flex-col md:flex-row gap-5">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input className="border rounded w-full py-1 px-2 font-normal" {...register("firstName",{required:"This field is required"})} />
                    {errors.firstName && (
                        <span className="text-red-500">{errors.firstName.message}</span>
                    )}
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input className="border rounded w-full py-1 px-2 font-normal" {...register('lastName',{required:'This field is required'})} />
                    {errors.lastName && (
                        <span className="text-red-500">{errors.lastName.message}</span>
                    )}
                </label>
        </div>
        <label className="text-gray-700 text-sm font-bold flex-1">
            Email
            <input className="border rounded w-full py-1 px-2 font-normal" {...register('email',{required:'This field is required'})} type='email' />
            {errors.email && (
                        <span className="text-red-500">{errors.email.message}</span>
                    )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
            Password
            <input className="border rounded w-full py-1 px-2 font-normal" {...register('password',{required:'This field is required',minLength:{
                value:6,
                message:'password must be at least 6 character'
            }})} type='password' />
            {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
            )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
            Confirm Password
            <input className="border rounded w-full py-1 px-2 font-normal" {...register('confirmPassword',{validate:(val)=>{
                if(!val){
                    return "This field is required"
                }else if(watch("password") !== val){
                    return "Your password Do not match"
                }
            }})} type='password' />
        </label>
        {errors.confirmPassword && (
            <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
        <span>
            <button type='submit' className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">create Account</button>
        </span>
    </form>
  )
}

export default Register