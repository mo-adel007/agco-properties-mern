import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/new_logo.webp";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  
} from "../redux/user/userSlice";
import backgroundImage from "../assets/1.png";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        setSuccessMessage(data.message);
        navigate("/profile");
      } else {
        dispatch(signInFailure(data.message));
      }
    } catch (error) {
      dispatch(signInFailure(error.message));

      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen mt-1">
      <div className="p-6 max-w-xs mx-auto bg-black fade-in-bottom rounded-xl">
        <Link to="/">
          <img
            src={logo}
            alt="AGCO LOGO"
            className="max-w-32 sm:max-w-42 ml-10"
          />
        </Link>
        <h1 className="text-xl text-center text-slate-100 font-semibold my-4">
          Sign In for Admins.
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center align-baseline text-center max-w-xs gap-6"
        >
          <input
            type="text"
            placeholder="Enter Your Email Address"
            className="border p-3 rounded-lg"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            className="border p-3 rounded-lg"
            id="password"
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-slate-100 text-red-700 border-red-500 p-3 rounded-lg uppercase hover:bg-red-700 hover:border-red-500 hover:text-white border border-transparent transition-all duration-300 ease-in-out disabled:opacity-8"
          >
            {loading ? 'Loading...' : "Sign-In"}
          </button>
        </form>
        <Link to="/sign-up">
          <div className="flex underline-offset-2 text-slate-100 gap-2 mt-9 underline">
            <p>Don't Have an account?</p>
          </div>
        </Link>
        {error && <p className="text-red-500 mt-5">{error}</p>}
        {successMessage && (
          <p className="text-green-500 mt-5">{successMessage}</p>
        )}
        <style>{`
          html, body {
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
      </div>
    </div>
  );
}
