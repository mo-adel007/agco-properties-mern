import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SuperAdminDashboard() {
  const { currentUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [listings, setListings] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [roleCounts, setRoleCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term

  const handleLogout = async () => {
    dispatch(signOutUserStart());
    try {
      const res = await fetch("http://localhost:3000/api/auth/signout", {
        method: "GET",
        credentials: "include",
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await fetch(
          "http://localhost:3000/api/user/count-users"
        );
        const userData = await userRes.json();
        setUserCount(userData.userCount);

        const roleRes = await fetch(
          "http://localhost:3000/api/user/count-roles"
        );
        const roleData = await roleRes.json();
        setRoleCounts(roleData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (activeTab === "listings") {
      fetch("http://localhost:3000/api/listing/allListings")
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then((data) => {
          console.log("Listings Data:", data); // Debugging
          setListings(data);
        })
        .catch((err) => console.error("Fetch error:", err));
    } else if (activeTab === "blogs") {
      fetch("http://localhost:3000/api/blog")
        .then((res) => res.json())
        .then((data) => {
          console.log("Blogs Data:", data); // Debugging
          setBlogs(data);
        })
        .catch((err) => console.error(err));
    } else if (activeTab === "projects") {
      fetch("http://localhost:3000/api/project")
        .then((res) => res.json())
        .then((data) => {
          console.log("Projects Data:", data); // Debugging
          setProjects(data);
        })
        .catch((err) => console.error(err));
    } else if (activeTab === "communities") {
      fetch("http://localhost:3000/api/community/communities")
        .then((res) => res.json())
        .then((data) => {
          console.log("Communities Data:", data); // Debugging
          setCommunities(data);
        })
        .catch((err) => console.error(err));
    }
  }, [activeTab]);

  const handleDelete = async (id, type) => {
    try {
      const endpointMap = {
        listings: "listing/delete",
        blogs: "blogs/delete",
        projects: "project/delete",
        communities: "community/delete",
      };
      await fetch(`http://localhost:3000/api/${endpointMap[type]}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        credentials: "include",
      });
      setActiveTab(type); // Refresh data after delete
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handlePublish = async (id, type, isPublished) => {
    try {
      const endpointMap = {
        listings: isPublished ? "listing/unpublish" : "listing/publish",
        blogs: "blogs/toggle-publish",
      };
      await fetch(`http://localhost:3000/api/${endpointMap[type]}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        credentials: "include",
      });
      setActiveTab(type); // Refresh data after publish/unpublish
    } catch (error) {
      console.error("Failed to publish/unpublish:", error);
    }
  };

  const renderTableRows = (data, type) =>
    data
      .filter((item) =>
        (item.name || item.title)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .map((item) => (
        <tr key={item._id}>
          <td className="py-2 px-4 border">{item.name || item.title}</td>
          {type === "listings" && (
            <td className="py-2 px-4 border">{item.userRef?.username}</td>
          )}
          <td className="py-2 px-4 border">
            {type === "projects" || type === "communities"
              ? "N/A"
              : item.isPublished
              ? "Published"
              : "Unpublished"}
          </td>
          <td className="py-2 px-4 border flex space-x-2 justify-evenly">
            <button
              onClick={() =>
                navigate(`/update-${type.slice(0, -1)}/${item._id}`)
              }
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Edit
              {console.log(`/update-${type.slice(0, -1)}/${item._id}`)}
            </button>
            <button
              onClick={() =>
                type === "projects" || type === "communities"
                  ? null
                  : handlePublish(item._id, type, item.isPublished)
              }
              className={`${
                type === "projects" || type === "communities"
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-500"
              } text-white px-4 py-1 rounded`}
              disabled={type === "projects" || type === "communities"}
            >
              {type === "projects" || type === "communities"
                ? "N/A"
                : item.isPublished
                ? "Unpublish"
                : "Publish"}
            </button>
            <button
              onClick={() => handleDelete(item._id, type)}
              className="bg-red-500 text-white px-4 py-1 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => navigate(`/${type.slice(0, -1)}/${item._id}`)}
              className="bg-yellow-500 text-white px-4 py-1 rounded"
            >
              View
            </button>
          </td>
        </tr>
      ));

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col mt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Super Admin Dashboard
        </h1>
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
                  <button
                    className={`${
                      activeTab === "Dashboard"
                        ? "bg-gray-900"
                        : "hover:bg-gray-700"
                    } block py-2 px-4 rounded w-full text-left`}
                    onClick={() => setActiveTab("Dashboard")}
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    className={`${
                      activeTab === "listings"
                        ? "bg-gray-900"
                        : "hover:bg-gray-700"
                    } block py-2 px-4 rounded w-full text-left`}
                    onClick={() => setActiveTab("listings")}
                  >
                    Manage Listings
                  </button>
                </li>
                <li>
                  <button
                    className={`${
                      activeTab === "blogs"
                        ? "bg-gray-900"
                        : "hover:bg-gray-700"
                    } block py-2 px-4 rounded w-full text-left`}
                    onClick={() => setActiveTab("blogs")}
                  >
                    Manage Blogs
                  </button>
                </li>
                <li>
                  <button
                    className={`${
                      activeTab === "projects"
                        ? "bg-gray-900"
                        : "hover:bg-gray-700"
                    } block py-2 px-4 rounded w-full text-left`}
                    onClick={() => setActiveTab("projects")}
                  >
                    Manage Projects
                  </button>
                </li>
                <li>
                  <button
                    className={`${
                      activeTab === "communities"
                        ? "bg-gray-900"
                        : "hover:bg-gray-700"
                    } block py-2 px-4 rounded w-full text-left`}
                    onClick={() => setActiveTab("communities")}
                  >
                    Manage Communities
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          <div className="flex-grow p-6">
            {activeTab === "Dashboard" && (
              <div className="flex-grow p-6">
                <div className="grid grid-cols-3 gap-6 mb-6">
                  {Object.keys(roleCounts).map((role) => (
                    <div
                      key={role}
                      className="bg-blue-500 text-white p-4 rounded-lg shadow-lg flex items-center justify-between"
                    >
                      <div>
                        <h2 className="text-lg font-semibold">{role}</h2>
                        <p className="text-3xl">{roleCounts[role]}</p>
                      </div>
                      <div className="text-6xl">
                        <i className="fas fa-user"></i>
                      </div>
                    </div>
                  ))}
                  <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">Total Users</h2>
                      <p className="text-3xl">{userCount}</p>
                    </div>
                    <div className="text-6xl">
                      <i className="fas fa-users"></i>
                    </div>
                  </div>
                  <div className="bg-purple-500 text-white pl-16 rounded-lg shadow-lg flex items-center justify-between">
                    <Link to={`/create-user`}>
                      <div className="text-4xl flex items-center">
                        <button className="flex items-center">
                          <i className="fas fa-user-plus mr-2"></i>
                          <p>Create User</p>
                        </button>
                      </div>
                    </Link>
                  </div>
                  <div className="bg-red-500 text-white pl-16 rounded-lg shadow-lg flex items-center justify-between">
                    <Link to={`/manage-user`}>
                      <div className="text-4xl flex items-center">
                        <button className="flex items-center">
                          <i className="fas fa-cog mr-2"></i>
                          <p>Manage User</p>
                        </button>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border"
            />
            {activeTab === "listings" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Manage Listings</h2>
              
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Listing Name</th>
                      <th className="py-2 px-4 border-b">User</th>
                      <th className="py-2 px-4 border-b">Status</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>{renderTableRows(listings, "listings")}</tbody>
                </table>
              </div>
            )}

            {activeTab === "blogs" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Manage Blogs</h2>
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Blog Title</th>
                      <th className="py-2 px-4 border-b">Status</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>{renderTableRows(blogs, "blogs")}</tbody>
                </table>
              </div>
            )}

            {activeTab === "projects" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Manage Projects</h2>
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Project Name</th>
                      <th className="py-2 px-4 border-b">Status</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>{renderTableRows(projects, "projects")}</tbody>
                </table>
              </div>
            )}

            {activeTab === "communities" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  Manage Communities
                </h2>
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Community Name</th>
                      <th className="py-2 px-4 border-b">Status</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>{renderTableRows(communities, "communities")}</tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
