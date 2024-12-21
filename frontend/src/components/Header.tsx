import { Link } from "react-router-dom"
import { useAppContext } from "../contexts/AppContext"
import SignOutBtn from "./SignOutBtn"

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
            <Link to={'/my-bookings'} className="flex items-center text-white px-3 font-bold hover:bg-blue-600 rounded-lg">My Booking</Link>
            <Link to={'/my-hotels'} className="flex items-center text-white px-3 font-bold hover:bg-blue-600 rounded-lg">My Hotels</Link>
            <SignOutBtn/>
          </> : 
          <>
            {/* <Link to='/register' className="flex items-center bg-white text=blue-600 px-3 font-bold hover:bg-gray-100 rounded-md text-xl">sign up</Link> */}
            <Link to='/sign-in' className="flex items-center bg-white text=blue-600 px-3 font-bold hover:bg-gray-100 rounded-md text-xl">Sign in</Link>
          </>
          }
        </span>
      </div>
    </div>
  )
}

export default Header