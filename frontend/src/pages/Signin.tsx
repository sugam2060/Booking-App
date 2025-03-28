import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import * as apiClient from '../api-client'
import { useAppContext } from '@/contexts/AppContext'
import { Link, useNavigate } from 'react-router-dom'

export type SigninFormData = {
    email: string,
    password: string
}

const Signin = () => {
    const queryClient = useQueryClient()
    const {showToast} = useAppContext()
    const navigate = useNavigate();
    const { register, formState: { errors }, handleSubmit } = useForm<SigninFormData>()

    const mutation = useMutation(apiClient.signIn, {
        onSuccess: async () => {
            showToast({messsage:'Login successfull',type:'SUCCESS'})
            await queryClient.invalidateQueries('validateToken')
            navigate('/',{replace:true})
        },
        onError: () => {
            showToast({messsage:'Invalid Credientials',type:'ERROR'})
        }

    })

    const onSubmit = handleSubmit(async (data) => {
        mutation.mutate(data);
    })


    return (
        <form className='flex flex-col gap-5' onSubmit={onSubmit}>
            <h2 className='text-3xl font-bold '>Sign In</h2>

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
            <span className='flex items-center justify-between'>
                <span className='text-sm'>Not Register? <Link to='/register' className='underline'>Create an account here</Link></span>
                <button type='submit' className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">Login</button>
            </span>
        </form>
    )
}

export default Signin