import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showProperties, setShowProperties] = useState(false); // New state for toggling properties
  const dispatch = useDispatch();

  useEffect(() => {
    if (showProperties) {
      handleShowListing();
    }
  }, [showProperties]);

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
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
      } else {
        dispatch(updateUserFailure(data.message));
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
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
          headers: { "Content-Type": "application/json" },
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

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/listing/delete/${listingId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUserListings((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePublish = async (listingId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/listing/publish/${listingId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
      } else {
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
          headers: { "Content-Type": "application/json" },
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
      } else {
        console.log("Failed to unpublish listing");
      }
    } catch (error) {
      console.error("Error unpublishing listing:", error);
    }
  };

  const toggleShowProperties = () => {
    setShowProperties((prevShowProperties) => !prevShowProperties);
  };

  return (
    <>
      <div className="flex justify-center pt-28">
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
            <Link
              className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
              to={"/list-property"}
            >
              Create Listing
            </Link>
            <div className="flex justify-between">
              <span
                onClick={handleSignOut}
                className="text-red-700 cursor-pointer"
              >
                {loading ? "Signing Out..." : "Sign Out"}
              </span>
            </div>
          </form>
          <button onClick={toggleShowProperties} className="text-blue-700">
            {showProperties ? "Hide Properties" : "Show Properties"}
          </button>
          <p className="text-red-700 mt-5">
            {showListingError ? "Error happened while showing listings" : ""}
          </p>
          {showProperties && userListings.length > 0 && (
            <div className="">
              <h1 className="text-center my-7 text-3xl">Your Properties</h1>
              {userListings.map((listing) => (
                <div
                  key={listing._id}
                  className="border border-black rounded-lg p-3 m-2 flex justify-between items-center gap-4"
                >
                  <Link to={`/listing/${listing._id}`}>
                    <img
                      src={listing.imageUrls[0]}
                      alt="listing"
                      className="h-16 w-16 object-contain"
                    />
                  </Link>
                  <Link
                    className="text-slate-700 font-semibold hover:underline truncate flex-1"
                    to={`/listing/${listing._id}`}
                  >
                    <p>{listing.name}</p>
                  </Link>
                  <div className="flex flex-col item-center">
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className="text-red-700 uppercase"
                    >
                      Delete
                    </button>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className="text-blue-700 uppercase">Edit</button>
                    </Link>
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
