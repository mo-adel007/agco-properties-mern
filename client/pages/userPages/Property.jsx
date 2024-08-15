import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { TfiRulerAlt2 } from "react-icons/tfi";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Helmet } from "react-helmet-async";
import parse from "html-react-parser"; // Import html-react-parser

SwiperCore.use([Navigation]);

export default function Property() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3000/api/listing/get/${params.listingId}`
        );
        const data = await res.json();
        if (!res.ok || data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  // Default coordinates if latitude and longitude are not provided
  const defaultCoordinates = [25.1941666, 55.2956219];
  const projectCoordinates =
    listing?.project?.latitude && listing?.project?.longitude
      ? [listing.project.latitude, listing.project.longitude]
      : defaultCoordinates;

  return (
    <main>
      <Helmet>
        <title>{`AGCO Properties | ${listing?.name}`}</title>
        <meta
          name="description"
          content={`Discover your dream house now, ${listing?.name} View by AGCO Real Estate. We specialize in residential and commercial properties. contact us for more.`}
        />
      </Helmet>
      {loading && <p className="text-center my-7 mt-20 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 mt-20 text-2xl">Something Went Wrong!</p>
      )}

      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px] fade-in-bottom mt-16"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer fade-in-bottom">
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
            <p className="fixed top-[35%] right-[5%] z-10 rounded-md bg-slate-100 fade-in-bottom p-2">
              Link copied!
            </p>
          )}
          <div className="flex justify-between max-w-4xl mx-auto p-3 my-7 fade-in-bottom gap-4">
            <div className="w-2/3">
              <h1 className="text-2xl font-semibold mb-4">
                {listing.name} | {listing.project.name} |{" "}
                {listing.community.name} - UAE{" "}
                {listing.offer
                  ? listing.discountPrice.toLocaleString("en-US")
                  : listing.regularPrice.toLocaleString("en-US")}
                {listing.type === "rent" && " / month"}
              </h1>
              <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm mb-4">
                <FaMapMarkerAlt className="text-green-700" />
                {listing.address}
              </p>
              <p className="flex items-center gap-1 whitespace-nowrap mb-4">
                <TfiRulerAlt2 className="text-lg" />
                {listing.size} Sq Ft
              </p>
              <p className="flex items-center gap-1 whitespace-nowrap mb-4">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </p>
              <div className="flex gap-4 mb-4">
                <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  {listing.type === "rent" ? "For Rent" : "For Sale"}
                </p>
                {listing.offer && (
                  <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                    UAE{+listing.regularPrice - +listing.discountPrice} OFF
                  </p>
                )}
              </div>
              <p className="text-slate-800 mb-4">
                <span className="font-semibold text-black">Description - </span>
                {parse(listing.description)}
              </p>
              <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
                <li className="flex items-center gap-1 whitespace-nowrap">
                  <FaBed className="text-lg" />
                  {listing.bedrooms > 1
                    ? `${listing.bedrooms} beds`
                    : `${listing.bedrooms} bed`}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap">
                  <FaBath className="text-lg" />
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} baths`
                    : `${listing.bathrooms} bath`}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap">
                  <FaParking className="text-lg" />
                  {listing.parking ? "Parking spot" : "No Parking"}
                </li>
              </ul>
              {/* Map Section */}
              <MapContainer
                center={projectCoordinates}
                zoom={16}
                style={{ height: "300px", width: "100%", borderRadius: "10px" }}
                className="mb-6"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={projectCoordinates} />
              </MapContainer>
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
                    placeholder="Enter your phone number"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
