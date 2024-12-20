import { useForm } from "react-hook-form"
import * as apiClient from "../api-client"
import { useMutation, useQueryClient } from "react-query"
import { useAppContext } from "../contexts/AppContext"
import { useNavigate } from "react-router-dom"
import { FormEvent, useState } from "react"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "../components/ui/input-otp"
import { Spinner } from "@/components/ui/Spinner"


export type RegisterFormData = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
}

export type RegisterFormDataWithOTPType = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
    otp: string
}

const Register = () => {
    const { showToast } = useAppContext()
    const { register, watch, handleSubmit, getValues, formState: { errors } } = useForm<RegisterFormData>();
    const [isOTP, setisOtp] = useState<boolean>(false)
    const [Loading,setLoading] = useState<boolean>(false);

    const mutation = useMutation(apiClient.requestOTP, {
        onSuccess: () => {
            setisOtp(true)
            setLoading(false)
        },
        onError: () => {
            showToast({ messsage: 'user exist' , type: 'ERROR' })
            setLoading(false)
        }
    })

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true)
        mutation.mutate(data);
    })
    
    const formData = getValues();
    return (
        <>
            {Loading?<div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
                <Spinner/>
            </div>:''}
            {isOTP ?

                <OtpPage formData={formData} />

                :
                <form className="flex flex-col gap-5 " onSubmit={onSubmit}>
                    <h2 className="text-3xl font-bold">Create an Account</h2>
                    <div className="flex flex-col md:flex-row gap-5">
                        <label className="text-gray-700 text-sm font-bold flex-1">
                            First Name
                            <input className="border rounded w-full py-1 px-2 font-normal" {...register("firstName", { required: "This field is required" })} />
                            {errors.firstName && (
                                <span className="text-red-500">{errors.firstName.message}</span>
                            )}
                        </label>
                        <label className="text-gray-700 text-sm font-bold flex-1">
                            Last Name
                            <input className="border rounded w-full py-1 px-2 font-normal" {...register('lastName', { required: 'This field is required' })} />
                            {errors.lastName && (
                                <span className="text-red-500">{errors.lastName.message}</span>
                            )}
                        </label>
                    </div>
                    <label className="text-gray-700 text-sm font-bold flex-1">
                        Email
                        <input className="border rounded w-full py-1 px-2 font-normal" {...register('email', { required: 'This field is required' })} type='email' />
                        {errors.email && (
                            <span className="text-red-500">{errors.email.message}</span>
                        )}
                    </label>
                    <label className="text-gray-700 text-sm font-bold flex-1">
                        Password
                        <input className="border rounded w-full py-1 px-2 font-normal" {...register('password', {
                            required: 'This field is required', minLength: {
                                value: 6,
                                message: 'password must be at least 6 character'
                            }
                        })} type='password' />
                        {errors.password && (
                            <span className="text-red-500">{errors.password.message}</span>
                        )}
                    </label>
                    <label className="text-gray-700 text-sm font-bold flex-1">
                        Confirm Password
                        <input className="border rounded w-full py-1 px-2 font-normal" {...register('confirmPassword', {
                            validate: (val) => {
                                if (!val) {
                                    return "This field is required"
                                } else if (watch("password") !== val) {
                                    return "Your password Do not match"
                                }
                            }
                        })} type='password' />
                    </label>
                    {errors.confirmPassword && (
                        <span className="text-red-500">{errors.confirmPassword.message}</span>
                    )}
                    <span>
                        <button type='submit' className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">create Account</button>
                    </span>
                </form>}
        </>
    )
}


export default Register


const OtpPage = ({formData}:{formData:RegisterFormData}) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()  
    const [otp, setOtp] = useState<string>('');
    const [errormsg,setErrorMessage] = useState<string>('');
    const {showToast} = useAppContext()

    const handleOtpChange = (newValue: string) => {
        setOtp(newValue)
    }

    const mutation = useMutation(apiClient.verifyOTP,{
        onSuccess: async (data:string) => {
            showToast({messsage:data,type:'SUCCESS'})
            await queryClient.invalidateQueries('validateToken')
            navigate('/',{replace:true});
        },
        onError:()=>{
            setErrorMessage('Invalid otp');
        }
    })

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const FormDataWithOTP = {...formData,otp}
        mutation.mutate(FormDataWithOTP)
    }

    return (
        <div className="flex justify-center flex-col items-center h-60 gap-1">
            <p className="text-red-500">{errormsg}</p>
            <form onSubmit={handleSubmit}>
                <InputOTP maxLength={6} value={otp} onChange={handleOtpChange} data-testid='otp-input'>
                    <InputOTPGroup>
                        {[...Array(3)].map((_, index) => (
                            <InputOTPSlot key={index} index={index} data-testid={`otp-input-${index}`} />
                        ))}
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        {[...Array(3)].map((_, index) => (
                            <InputOTPSlot key={index + 3} index={index + 3} data-testid={`otp-input-${index+3}`} />
                        ))}
                    </InputOTPGroup>
                </InputOTP>
                <button type='submit' className="py-1 mt-2 text-white bg-blue-600 px-2">submit otp</button>
            </form>
        </div>
    )
}