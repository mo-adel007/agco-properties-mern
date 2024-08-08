import React from "react";
import { useDispatch } from "react-redux";
import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";

export default function SuperAdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(signOutUserStart());
    try {
      const res = await fetch("http://localhost:3000/api/auth/signout", {
        method: "GET",
        credentials: "include", // Ensure the cookie is sent
      });

      if (res.ok) {
        dispatch(signOutUserSuccess());
        navigate("/sign-in");
      } else {
        const data = await res.json();
        dispatch(signOutUserFailure(data.message || "Failed to log out."));
      }
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col mt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Super Admin Dashboard</h1>
        <button
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex">
          <aside className="w-64 bg-gray-800 text-white flex-shrink-0 p-6">
            <nav>
              <ul className="space-y-4">
                <li>
                  <Link to={`/super-admin-dashboard`} className="block py-2 px-4 rounded hover:bg-gray-700">Dashboard</Link>
                </li>
                <li>
                <Link to={`/create-user`} className="block py-2 px-4 rounded hover:bg-gray-700">Create User</Link>
                </li>
                <li>
                <Link to={`/manage-user`} className="block py-2 px-4 rounded hover:bg-gray-700">Manage User</Link>
                </li>
              </ul>
            </nav>
          </aside>
          
          <main className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <div className="bg-purple-400 shadow rounded-lg p-4">
                <h2 className="text-xl font-bold mb-2">User Statistics</h2>
                <p className="text-white">Total Users: 120</p>
                <p className="text-white">Active Users: 98</p>
              </div>
              
              <div className="bg-yellow-400 shadow rounded-lg p-4">
                <h2 className="text-xl font-bold mb-2">Role Assignments</h2>
                <p className="text-white">Admins: 10</p>
                <p className="text-white">Supervisors: 15</p>
                <p className="text-white">SEO: 5</p>
              </div>
              
             
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
