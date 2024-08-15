// ManageUsers.js
import React, { useState, useEffect } from 'react';
import EditUser from './EditUser'; // Import the EditUser component
import ViewProfile from './UserProfile'; // Import the ViewProfile component
import { useSelector } from "react-redux";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user/get-users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditUser(user);
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${currentUser.token}`, // Replace with actual token management
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
        console.log(data.message);
      } else {
        console.error('Failed to delete user:', data.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleViewProfile = (user) => {
    setViewUser(user._id);
  };

  const handleSave = (updatedUser) => {
    setUsers(users.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
    setEditUser(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 mt-20">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      {editUser ? (
        <EditUser user={editUser} onSave={handleSave} onCancel={() => setEditUser(null)} />
      ) : viewUser ? (
        <ViewProfile userId={viewUser} />
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Username</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="py-2 px-4">{user.username}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-blue-500 text-white py-1 px-2 rounded mr-2"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded mr-2"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-green-500 text-white py-1 px-2 rounded"
                    onClick={() => handleViewProfile(user)}
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;
