import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/new_logo.webp";
import backgroundImage from "../assets/1.png";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data) {
        setLoading(false);
        setSuccessMessage(data.message);
        setError(data.message);
        navigate("/sign-in");
        return;
      } else {
      setLoading(false);
      setError(data.message);
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className="p-2 max-w-sm mx-auto bg-black rounded-lg shadow-red-600 mt-32 fade-in-bottom">
      <Link to="/">
          <img src={logo} alt="AGCO LOGO" className="max-w-32 sm:max-w-48 ml-24" />
        </Link>
      <h1 className="text-3xl text-center font-semibold my-2"> Sign Up for Admins.</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <option className="text-white">Username</option>
        <input
          type="text"
          placeholder="Please enter your username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <option className="text-white">Email</option>

        <input
          type="text"
          placeholder="Please enter your email address"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />{" "}
        <option className="text-white">Password</option>

        <input
          type="text"
          placeholder="Please enter your password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-green-500 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-8"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-9 text-white ">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <button className="bg-red-700 rounded-lg p-2 hover:opacity-95 disabled:opacity-8 text-slate-100">
            {" "}
            Sign in
          </button>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
      {successMessage && <p className="text-green-500 mt-5">{successMessage}</p>}
      <style>{`
          html, body {
            height: 133%;
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
  );
}
