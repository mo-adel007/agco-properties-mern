import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../../redux/user/userSlice";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Profile() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);

  const [projects, setProjects] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [showProperties, setShowProperties] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showCommunities, setShowCommunities] = useState(false);
  const [activeTab, setActiveTab] = useState("listings");
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
      setFormData(
        {
          username: currentUser.username,
          email: currentUser.email,
        },
        [currentUser]
      );
    }
    if (showProperties) {
      handleShowListing();
    }
  }, [showProperties]);

  useEffect(() => {
    if (showProjects) {
      fetchProjects();
    }
  }, [showProjects]);

  useEffect(() => {
    if (showCommunities) {
      fetchCommunities();
    }
  }, [showCommunities]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(
        `http://localhost:3000/api/user/update/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
        toast.success('Personal information is updated successfully')
      } else {
        dispatch(updateUserFailure(data.message));
        toast.error("Failed to update the user personal information")
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error("Failed to update the user personal information")
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("http://localhost:3000/api/auth/signout");
      const data = await res.json();
      if (res.ok) {
        dispatch(signOutUserSuccess(data.message));
        return;
      }
      dispatch(signOutUserFailure(data.message));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListing = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/user/listings/${currentUser._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUserListings(data);
        setShowListingError(false);
      } else {
        setShowListingError(true);
      }
    } catch (error) {
      setShowListingError(true);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/project");
      const data = await res.json();
      if (res.ok) {
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchCommunities = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/community/communities"
      );
      const data = await res.json();
      if (res.ok) {
        setCommunities(data);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };
  const handlePublish = async (listingId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/listing/publish/${listingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          credentials: "include",
        }
      );
      if (res.ok) {
        setUserListings((prevListings) =>
          prevListings.map((listing) =>
            listing._id === listingId
              ? { ...listing, isPublished: true }
              : listing
          )
        );
        toast.success("The listing is successfully published")
      } else {
        toast.error("Failed to publish the listing")
        console.log("Failed to publish listing");
      }
    } catch (error) {
      console.error("Error publishing listing:", error);
    }
  };

  const handleUnpublish = async (listingId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/listing/unpublish/${listingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          credentials: "include",
        }
      );
      if (res.ok) {
        setUserListings((prevListings) =>
          prevListings.map((listing) =>
            listing._id === listingId
              ? { ...listing, isPublished: false }
              : listing
          )
        );
        toast.success("The listing is unpublished successfully")
      } else {
        toast.error("Failed to publish the listing")
        console.log("Failed to unpublish listing");
      }
    } catch (error) {
      console.error("Error unpublishing listing:", error);
    }
  };
 
  const handleToggleSoldStatus = async (listingId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/listing/toggle-sold-status/${listingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          credentials: "include",
        }
      );
  
      const data = await res.json();
  
      if (res.ok) {
        setUserListings((prevListings) =>
          prevListings.map((listing) =>
            listing._id === listingId ? { ...listing, status: data.listing.status } : listing
          )
        );
        toast.success("The listing was marked as sold!")
      } else {
        toast.error("Failed to mark listing as sold!")
        console.error("Failed to update listing status:", data.message);
      }
    } catch (error) {
      console.error("Error updating listing status:", error);
    }
  };
  

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowProperties(tab === "Properties");
    setShowProjects(tab === "Projects");
    setShowCommunities(tab === "Communities");
  };
  const filterData = (data, searchTerm) => {
    if (!searchTerm) return data; // Return original data if no search term

    return data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <>
      <div className="flex justify-center pt-28 mr-40">
        <ToastContainer />
        <div className="fade-in-right max-w-md mx-auto relative flex flex-col p-4 rounded-md text-black bg-slate-300">
          <div className="text-2xl font-bold mb-2 text-[#1e0e4b] text-center">
            Welcome back to your <span className="text-[#7747ff]">Account</span>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 fade-in-bottom"
          >
            <div className="block relative">
              <label
                htmlFor="username"
                className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2"
              >
                Username
              </label>
              <input
                type="text"
                defaultValue={currentUser.username}
                id="username"
                onChange={handleChange}
                className="rounded border border-indigo-800 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2 ring-indigo-900 outline-0"
              />
              <label
                htmlFor="email"
                className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                onChange={handleChange}
                defaultValue={currentUser.email}
                className="rounded border border-indigo-800 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2 ring-indigo-900 outline-0"
              />
            </div>
            <div>
              <h2 className="text-[#7747ff]">Forgot your password? </h2>
              <div className="block relative">
                <label
                  htmlFor="password"
                  className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  className="rounded border border-indigo-800 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2 ring-indigo-900 outline-0"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-[#7747ff] w-max m-auto px-6 py-2 rounded text-white text-sm font-normal"
            >
              Update
            </button>
            <div className="flex justify-between gap-4">
              <Link
                className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
                to={"/list-property"}
              >
                Create Listing
              </Link>
              <Link
                className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
                to={"/create-project"}
              >
                Create Project
              </Link>
              <Link
                className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
                to={"/create-community"}
              >
                Create Community
              </Link>
            </div>
            <div className="flex justify-between">
              <span
                onClick={handleSignOut}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                <button>{loading ? "Signing Out..." : "Sign Out"}</button>
              </span>
            </div>
          </form>

          <div className="my-5">
            <div className="flex justify-around mb-4">
              <button
                onClick={() => handleTabChange("Properties")}
                className={`py-2 px-4 ${
                  activeTab === "Properties"
                    ? "bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    : "bg-gray-300"
                } rounded`}
              >
                Properties
              </button>
              <button
                onClick={() => handleTabChange("Projects")}
                className={`py-2 px-4 ${
                  activeTab === "Projects"
                    ? "bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
                    : "bg-gray-300"
                } rounded`}
              >
                Projects
              </button>
              <button
                onClick={() => handleTabChange("Communities")}
                className={`py-2 px-4 ${
                  activeTab === "Communities"
                    ? "bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700"
                    : "bg-gray-300"
                } rounded`}
              >
                Communities
              </button>
            </div>
            <p className="text-red-700 mt-5">
              {showListingError ? "Error happened while showing listings" : ""}
            </p>
            {/* Properties Table */}
          </div>
        </div>
        {showProperties && userListings.length > 0 && (
          <div className="">
            <h1 className="text-center my-7 text-3xl">Your Properties</h1>
            <div className="my-5">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-2 px-4 border-r">Image</th>
                  <th className="py-2 px-4 border-r">Name</th>
                  <th className="py-2 px-4 border-r">Actions</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4 border-r">Add to Sold</th>

                </tr>
              </thead>
              <tbody>
                {filterData(userListings, searchTerm).map((listing) => (
                  <tr key={listing._id} className="border-b">
                    <td className="py-2 px-4">
                      <img
                        src={listing.imageUrls[0]}
                        alt="listing"
                        className="h-28 w-52 object-contain"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <Link
                        to={`/listing/${listing._id}`}
                        className="text-slate-700 font-semibold hover:underline truncate"
                      >
                        {listing.name}
                      </Link>
                    </td>
                    <td className="py-2 px-4">
                      <Link to={`/update-listings/${listing._id}`}>
                        <button className="text-blue-700 uppercase">
                          Edit
                        </button>
                      </Link>
                    </td>
                    <td className="py-2 px-4">
                      {listing.isPublished ? (
                        <button
                          onClick={() => handleUnpublish(listing._id)}
                          className="text-yellow-600 uppercase"
                        >
                          Unpublish
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePublish(listing._id)}
                          className="text-green-600 uppercase"
                        >
                          Publish
                        </button>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleToggleSoldStatus(listing._id)}
                        className="text-red-600 uppercase"
                        disabled={listing.isPublished} // Disable the button if the listing is still published
                      >
                        {listing.status === "sold"
                          ? "Mark as Unsold"
                          : "Mark as Sold"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Projects Table */}
        {showProjects && projects.length > 0 && (
          <div className="my-5">
            <h1 className="text-center my-7 text-3xl">Your Projects</h1>
            <div className="my-5">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-2 px-4 border-r">Image</th>
                  <th className="py-2 px-4 border-r">Name</th>
                  <th className="py-2 px-4 border-r">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterData(projects, searchTerm).map((project) => (
                  <tr key={project._id} className="border-b">
                    <td className="py-2 px-4">
                      <img
                        src={project.imageUrls[0]}
                        alt="project"
                        className="h-28 w-52 object-contain"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <Link
                        to={`/project/${project._id}`}
                        className="text-slate-700 font-semibold hover:underline truncate"
                      >
                        {project.name}
                      </Link>
                    </td>
                    <td className="py-2 px-4">
                      <Link to={`/update-projects/${project._id}`}>
                        <button className="text-blue-700 uppercase">
                          Edit
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Communities Table */}
        {showCommunities && communities.length > 0 && (
          <div className="my-5">
            <h1 className="text-center my-7 text-3xl">Your Communities</h1>
            <div className="my-5">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-2 px-4 border-r">Image</th>
                  <th className="py-2 px-4 border-r">Name</th>
                  <th className="py-2 px-4 border-r">Actions</th>

                </tr>
              </thead>
              <tbody>
                {filterData(communities, searchTerm).map((community) => (
                  <tr key={community._id} className="border-b">
                    <td className="py-2 px-4">
                      <img
                        src={community.imageUrls[0]}
                        alt="community"
                        className="h-28 w-52 object-contain"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <Link
                        to={`/community/${community._id}`}
                        className="text-slate-700 font-semibold hover:underline truncate"
                      >
                        {community.name}
                      </Link>
                    </td>
                    <td className="py-2 px-4">
                      <Link to={`/update-community/${community._id}`}>
                        <button className="text-blue-700 uppercase">
                          Edit
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
