import './App.css'
import Layout from './layouts/Layout'
import {Navigate, Route,Routes} from 'react-router-dom'
import Register from './pages/Register'
import Signin from './pages/Signin'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Layout>
        <p>Home page</p>
      </Layout>}/>
      <Route path='/search' element={<Layout>
          <p>search page</p>
      </Layout>}/>
      <Route path='register' element={<Layout >
        <Register/>
      </Layout>}/>
      <Route path='/sign-in' element={<Layout>
        <Signin/>
      </Layout>}></Route>
      <Route path='*' element={<Navigate to={'/'}/>}/>
    </Routes>

  )
}

export default App
