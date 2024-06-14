
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { RootState } from '../redux/store'; // Adjust the import based on your store setup

interface User {
  isAdmin: boolean;
}

export default function PrivateRoute() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser) as User | null;

  return (
    currentUser  ? <Outlet /> : <Navigate to='/login' />
  );
}