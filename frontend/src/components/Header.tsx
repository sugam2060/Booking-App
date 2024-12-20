import { Link } from "react-router-dom"
import { useAppContext } from "../contexts/AppContext"

const Header = () => {
  const { isLogedIn } = useAppContext()
  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to='/'>Booking.com</Link>
        </span>
        <span className="flex space-x-2">
          {isLogedIn ? <>
            <Link to={'/my-bookings'}>My Booking</Link>
            <Link to={'/my-hotels'}>My Hotels</Link>
            <button>sign out</button>
          </> : <Link to='/register' className="flex items-center bg-white text=blue-600 px-3 font-bold hover:bg-gray-100 rounded-md text-xl">sign up</Link>
          }
        </span>
      </div>
    </div>
  )
}

export default Header