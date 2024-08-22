import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineLeft } from "react-icons/ai";

export default function ShowListings() {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term

  useEffect(() => {
    // Fetch listings from the API
    fetch("http://localhost:3000/api/listing/listings")
      .then((response) => response.json())
      .then((data) => {
        setListings(data);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
      });
  }, []);


  // Filter listings based on the search term
  const filteredListings = listings.filter((listing) =>
    listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.project?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.community?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto w-full max-w-8xl mt-20 p-5 my-6 bg-white border border-gray-200 rounded-lg shadow mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Listings</h1>
      <Link
        to={"/seo-dashboard"}
        className="inline-flex items-center text-blue-500 hover:text-blue-700 font-semibold"
      >
        <AiOutlineLeft className="w-6 h-6 mr-2" />
        Back to Profile
      </Link>
      {/* Search Field */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg pl-10"
            placeholder="Search listings..."
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
              Category
            </th>
            <th className="px-4 py-2 border-b border-gray-300 text-left">
              Project
            </th>
            <th className="px-4 py-2 border-b border-gray-300 text-left">
              Community
            </th>
            <th className="px-4 py-2 border-b border-gray-300 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredListings.map((listing) => (
            <tr key={listing._id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{listing.name}</td>
              <td className="border px-4 py-2">{listing.category || "--"}</td>
              <td className="border px-4 py-2">
                {listing.project?.name || "--"}
              </td>
              <td className="border px-4 py-2">
                {listing.community?.name || "--"}
              </td>

              <td className="border px-4 py-2">
                <Link to={`/seo-edit-listing/${listing._id}`}>
                  <button className="bg-blue-500 text-white px-2 py-1 rounded">
                    Edit
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
