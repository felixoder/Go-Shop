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
    <>
     <Navbar/>
  <Routes>
    <Route path='https://go-shop-mk17.vercel.app' element={<Main/>}/>
    <Route path='https://go-shop-mk17.vercel.app/register' element={<Register/>}/>
    <Route path='https://go-shop-mk17.vercel.app/login' element={<Login/>}/>
    <Route element={<AdminPrivateRoute/>}>
      <Route path='https://go-shop-mk17.vercel.app/orders' element={<Orders/>}/>

    <Route path='https://go-shop-mk17.vercel.app/admin-dash' element={<AdminDash/>}/>
    </Route>
    <Route element={<PrivateRoute/>}>
    <Route path='https://go-shop-mk17.vercel.app/success/:productId' element={<Success/>}/>
    <Route path="https://go-shop-mk17.vercel.app/failure" element={<Failure/>}/>
    <Route path="https://go-shop-mk17.vercel.app/order/:productId" element={<Checkout/>}/>
    <Route path="https://go-shop-mk17.vercel.app/confirm/:productId" element={<Confirmation/>}/>

    <Route path='https://go-shop-mk17.vercel.app/products/:productId' element={<Products/>}/>
    </Route>

    


  </Routes>
    
    
    </>
   
  )
}

export default App