import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import backgroundImage from "../assets/2.png";
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
  const dispatch = useDispatch();

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
          headers: {
            "Content-Type": "application/json",
          },
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
      // dispatch(signOutUserSuccess(data));
    } catch (error) {
      console.log(error);
      dispatch(signOutUserFailure(error));
    }
  };

  return (
    <>
      {/* <Header /> */}
      <div className="flex justify-center pt-28">
        <div className="fade-in-right max-w-md mx-auto relative flex flex-col p-4 rounded-md text-black bg-white">
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
                className="rounded border border-indigo-800 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2  ring-indigo-900 outline-0"
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
                className="rounded border border-indigo-800 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2  ring-indigo-900 outline-0"
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
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
          to={'/list-property'}
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
        </div>
      </div>
      <style>{`
        html,
        body {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        body {
          background-image: url(${backgroundImage});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
      `}</style>
    </>
  );
}
