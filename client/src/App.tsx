import { Route, Routes } from "react-router-dom"
import Login from "./auth/Login"
import AdminDash from "./components/AdminDash"
import Main from "./components/Main"
import Navbar from "./components/Navbar"
import Products from "./components/Products"
import Success from "./components/Success"
import Failure from "./components/Failure"
import Register from "./auth/Register"
import Checkout from "./components/Checkout"
import Confirmation from "./components/Confirmation"
import AdminPrivateRoute from "./components/AdminPrivateRoute"
import PrivateRoute from "./components/PrivateRoute"
import Orders from "./components/Orders"


const App = () => {
  return (

    // Change this path while in the local mode
    <>
     <Navbar/>
  <Routes>
    <Route path='/' element={<Main/>}/>
    <Route path='/register' element={<Register/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route element={<AdminPrivateRoute/>}>
      <Route path='/orders' element={<Orders/>}/>

    <Route path='/admin-dash' element={<AdminDash/>}/>
    </Route>
    <Route element={<PrivateRoute/>}>
    <Route path='/success/:productId' element={<Success/>}/>
    <Route path="/failure" element={<Failure/>}/>
    <Route path="/order/:productId" element={<Checkout/>}/>
    <Route path="/confirm/:productId" element={<Confirmation/>}/>

    <Route path='/products/:productId' element={<Products/>}/>
    </Route>

    


  </Routes>
    
    
    </>
   
  )
}

export default App