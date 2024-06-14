import  { useState } from 'react'; // Import useState for managing state
import { Link } from 'react-router-dom'; // Correct import for Link from react-router-dom
import MaxWidthWrapper from './MaxWidthWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { signOutSuccess } from '../redux/user/userSlice';
import toast from 'react-hot-toast';

const Navbar = () => {

  interface User {
    isAdmin: boolean;
    profilePicture: string;
  }

  const currentUser = useSelector((state: RootState) => state.user.currentUser) as User | null;
  const dispatch = useDispatch();

  // State to manage the visibility of the dropdown menu
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };


  const handleSignOut = async ()=>{
    try {
      const res = await fetch('https://go-shop-fbgh.onrender.com/api/sign-out',{
        method:'POST'
  
      })
      
      if(!res.ok){
        toast.error('failed')
      }
      else{
        dispatch(signOutSuccess())
        toast.success("Sigend out")

  
      }
      
    } catch (error) {
     toast.error('Network failed');
      
    }
  }
  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          {/* Correct usage of Link component with to prop instead of href */}
          <Link to="/">
            <div className="flex z-40 font-semibold">
              Felix<span className="text-green-600">Shop</span>
            </div>
          </Link>

          <div className="h-full flex items-center space-x-4 gap-3 text-[13px]">
            {!currentUser  ?(
              <>
              <Link to="/login">
              <div className="flex z-40 font-semibold  flex-col justify-center items-center">
                  Login
               
                
              </div>
            </Link>
           
           
              
              </>
              
            ):(

              <>
              
              
           

          </>
            )}
            
            
           

            <div className="h-8 w-px bg-zinc-200 hidden md:block" />
            {currentUser ? (
              <div className="relative">
                <button onClick={toggleDropdown} className="relative z-50">
                  <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' alt="Profile" className='w-9 h-9 rounded-full'/>
                </button>
                {dropdownVisible && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-40">
                    {currentUser.isAdmin && (
                      <>
                      <Link to="/admin-dash" className="block px-4 py-2 text-red-800 hover:bg-gray-100">Admin-profile</Link>
                      <Link to="/orders" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Orders</Link>
                    
                      
                      </>
                      
                    )}
                    <button className="block px-4 py-2 text-red-800 hover:bg-gray-100 w-full" onClick={handleSignOut}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;