import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function CreateUser() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    sendNotification: true,
  });
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setLoading(false);
        setSuccessMessage("User created successfully!");
      } else {
        setLoading(false);
        setError(data.error || "An error occurred");
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md p-6 rounded-lg mt-20">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Add New User
      </h2>
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter the new username"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter the email for this user"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <div className="flex items-center">
            <input
              type="password"
              name="password"
              placeholder="Enter the password for this account"
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Role</label>
          <select
            name="role"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="">Select Role</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="SEO">SEO</option>

            {/* Add more roles as needed */}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add New User"}
        </button>
      </form>
    </div>
  );
}
