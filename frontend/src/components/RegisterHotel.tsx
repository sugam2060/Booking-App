import { useNavigate } from "react-router-dom"

type propType = {
    isLogedIn: boolean
}

const RegisterHotel = ({isLogedIn}:propType) => {

    const navigate = useNavigate();

    const handleClick = ()=>{
        if(isLogedIn){
            navigate('/add-hotel')
        }else{
            navigate('/sign-in')
        }
    }

  return (
    <button className={isLogedIn?'text-blue-600 px-3 font-bold hover:bg-gray-100 bg-white rounded-sm':'flex items-center bg-white text=blue-600 px-3 font-bold hover:bg-gray-100 rounded-md text-xl'} onClick={handleClick}>
        Register
    </button>
  )
}

export default RegisterHotel