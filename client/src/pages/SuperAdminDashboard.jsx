import React from 'react'
import { useDispatch } from 'react-redux';
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function SuperAdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(signOutUserStart());
    try {
      const res = await fetch('http://localhost:3000/api/auth/signout', {
        method: 'GET',
        credentials: 'include', // Ensure the cookie is sent
      });

      if (res.ok) {
        dispatch(signOutUserSuccess());
        navigate('/sign-in');
      } else {
        const data = await res.json();
        dispatch(signOutUserFailure(data.message || 'Failed to log out.'));
      }
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      console.error(error);
    }
  };
  return (
    <div className="mt-20">
      <h1>Super Admin Dashboard</h1>
      <button className='bg-red-600' onClick={handleLogout}>Logout</button>
    </div>
  )
}
