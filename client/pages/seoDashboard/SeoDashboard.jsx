import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function SeoDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [selectedAuthor, setSelectedAuthor] = useState(""); // State for selected author

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/blog");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      }
    };

    fetchPosts();
  }, []);

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

  const handleTogglePublish = async (postId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/blogs/toggle-publish/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        const updatedPost = await res.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === updatedPost._id ? updatedPost : post
          )
        );
      } else {
        console.error("Failed to toggle publish status");
      }
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  const handleEdit = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  const filteredBlogs = posts.filter((blog) => {
    const matchesTitle = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? blog.category === selectedCategory : true;
    const matchesAuthor = selectedAuthor ? blog.blogAuthor === selectedAuthor : true;
    return matchesTitle && matchesCategory && matchesAuthor;
  });



  return (
    <div className="mt-20 px-4">
      <h1 className="text-2xl font-bold mb-4">Welcome back</h1>
      <button
        className="bg-red-600 text-slate-100 w-max m-auto px-6 py-2 rounded mb-4"
        onClick={handleLogout}
      >
        Logout
      </button>
      <div className="flex flex-row space-evenly">
      <button className="bg-[#7747ff] w-max m-auto px-6 py-2 rounded text-white font-normal flex mb-6">
        <Link to="/create-post">Create a Blog Post</Link>
      </button>
      <button className="bg-[#7747ff] w-max m-auto px-6 py-2 rounded text-white font-normal flex mb-6">
        <Link to="/seo-listings">Show Listings</Link>
      </button>
      <button className="bg-[#7747ff] w-max m-auto px-6 py-2 rounded text-white font-normal flex mb-6">
        <Link to="/seo-projects">Show Projects</Link>
      </button>
      <button className="bg-[#7747ff] w-max m-auto px-6 py-2 rounded text-white font-normal flex mb-6">
        <Link to="/media-gallery">Media Galley</Link>
      </button>
      <button className="bg-[#7747ff] w-max m-auto px-6 py-2 rounded text-white font-normal flex mb-6">
        <Link to="/seo-edit">Edit Meta Data</Link>
      </button>
      </div>
      <div className="overflow-x-auto w-full max-w-8xl p-5 my-6 bg-white border border-gray-200 rounded-lg shadow mx-auto">
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg pl-10"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7l4-4m0 0l4 4m-4-4v18"
              ></path>
            </svg>
          </span>
        </div>
      </div>
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b border-gray-300 text-left">
                Title
              </th>
              <th className="px-4 py-2 border-b border-gray-300 text-left">
                Blog Categories
              </th>
              <th className="px-4 py-2 border-b border-gray-300 text-left">
                Blog Author
              </th>
              <th className="px-4 py-2 border-b border-gray-300 text-left">
                Date
              </th>
              <th className="px-4 py-2 border-b border-gray-300 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((post) => (
              <tr key={post._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{post.title}</td>
                <td className="border px-4 py-2">{post.category || "--"}</td>
                <td className="border px-4 py-2">{post.blogAuthor || "--"}</td>
                <td className="border px-4 py-2">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                    onClick={() => handleEdit(post._id)}
                  >
                    Edit
                  </button>
                  <button
                    className={`${
                      post.isPublished ? "bg-red-500" : "bg-green-500"
                    } text-white px-2 py-1 ml-6 rounded`}
                    onClick={() => handleTogglePublish(post._id)}
                  >
                    {post.isPublished ? "Unpublish" : "Publish"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
