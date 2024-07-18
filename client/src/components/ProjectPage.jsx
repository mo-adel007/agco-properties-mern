import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaShare } from "react-icons/fa";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";

SwiperCore.use([Navigation]);

export default function ProjectPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3000/api/project/get/${projectId}`
        );
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setProject(data);
        setLoading(false);
        setError(false);

        // Fetch listings by project name
        const listingsRes = await fetch(
          `http://localhost:3000/api/listing/listings/projects/${data.name}`
        );
        const listingsData = await listingsRes.json();
        console.log("Listings response:", listingsData); // Debug log
        if (listingsData.success) {
          setListings(listingsData.listings);
        }
      } catch (error) {
        console.error("Error fetching project and listings:", error);
        setError(true);
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  return (
    <main>
      {loading && <p className="text-center my-7 mt-28 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 mt-28 text-2xl">Something Went Wrong!</p>
      )}

      {project && !loading && !error && (
        <div className="container mx-auto fade-in-bottom mt-16">
          <Swiper navigation>
            {project.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[35%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {project.name} by {project.community.name} | {project.developer} -
              UAE{" "}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {project.address}
            </p>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {project.description}
            </p>
          </div>

          <div className="flex justify-between">
            <div className="w-2/3">
              <h2 className="text-3xl font-semibold my-6">Properties</h2>
              {listings.map((listing) => (
                <div
                  key={listing._id}
                  className="border rounded-lg shadow-lg p-4 mb-4 flex justify-between items-center"
                >
                  <img
                    src={listing.imageUrls[0]}
                    alt={listing.name}
                    className="w-1/4 h-32 object-cover rounded-lg"
                  />
                  <div className="w-3/4 pl-4">
                    <h3 className="text-xl font-semibold">{listing.name}</h3>
                    <p>{listing.address}</p>
                    <p>
                      Beds: {listing.bedrooms}, Baths: {listing.bathrooms},
                      Size: {listing.size} sqft
                    </p>
                    <p className="font-semibold">{listing.regularPrice} AED</p>
                    <Link to="/listing/:listingId">
                    <button className="bg-black hover:bg-red-500 transition-all text-white rounded-full px-4 py-2 mt-2">
                      Details
                    </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-1/3 ml-6">
              <h2 className="text-2xl font-semibold mb-4">
                Register your Interest
              </h2>
              <form className="bg-white p-6 rounded-lg shadow-lg">
                <label className="block mb-2">
                  <span className="text-gray-700">Name:</span>
                  <input
                    type="text"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Enter your name"
                  />
                </label>
                <label className="block mb-2">
                  <span className="text-gray-700">E-mail:</span>
                  <input
                    type="email"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Enter your email"
                  />
                </label>
                <label className="block mb-2">
                  <span className="text-gray-700">Phone number:</span>
                  <input
                    type="text"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="+971 2 345 6789"
                  />
                </label>
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 transition-all text-white rounded-full px-4 py-2 mt-4 w-full"
                >
                  Register Now!
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
