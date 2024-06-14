import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { RootState } from '../redux/store'; // Adjust the import based on your store setup

interface User {
  isAdmin: boolean;
}

export default function AdminPrivateRoute() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser) as User | null;

  return (
    currentUser && currentUser.isAdmin ? <Outlet /> : <Navigate to='/login' />
  );
}