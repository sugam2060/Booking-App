import './App.css'
import Layout from './layouts/Layout'
import {Navigate, Route,Routes} from 'react-router-dom'
import Register from './pages/Register'
import Signin from './pages/Signin'
import { useAppContext } from './contexts/AppContext'
import AddHotel from './pages/AddHotel'
import MyHotels from './pages/MyHotels'
import EditHotel from './pages/EditHotel'
import Search from './pages/Search'

function App() {

  const {isLogedIn} = useAppContext()

 

  return (
    
      <Routes>
      <Route path='/' element={<Layout>
        <p>Home page</p>
      </Layout>}/>
      <Route path='/search' element={<Layout>
          <Search/>
      </Layout>}/>
      <Route path='register' element={<Layout >
        <Register/>
      </Layout>}/>
      <Route path='/sign-in' element={<Layout>
        <Signin/>
      </Layout>}></Route>
      {isLogedIn && <>
        <Route path='/add-hotel' element={<Layout>
            <AddHotel/>
        </Layout>}/>
        <Route path='/my-hotels' element={<Layout>
           <MyHotels/>
        </Layout>}/>
        <Route path='/edit-hotel' element={<Layout>
          <EditHotel/>
        </Layout>}/>
      </>
      }
      <Route path='*' element={<Navigate to={'/'}/>}/>
    </Routes>
    

  )
}

export default App
