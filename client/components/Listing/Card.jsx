// ListingItem.jsx

import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { TfiRulerAlt2 } from "react-icons/tfi";
import { FaBath, FaBed } from "react-icons/fa";
import parse from "html-react-parser"; // Import html-react-parser

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
     
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <h1 className="truncate text-lg font-semibold text-slate-700">
            {listing.name} | {listing.project?.name} | {listing.community?.name}
          </h1>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-red-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
          {parse(listing.description)}
          </p>
          <p className="text-slate-500 mt-2 font-semibold ">
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"} UAE
          </p>
          <div className="text-slate-700 flex gap-4">
            <FaBed className="text-lg text-red-700" />
            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>
            <FaBath className="text-red-700" />
            <div className="font-bold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </div>
            <TfiRulerAlt2 className=" text-red-700" />
            <div className="font-bold text-xs  ">{listing.size} SqFt</div>
          </div>
        </div>
        </Link>
        <div className="flex gap-10 p-2 pl-8">
          <a href="https://wa.me/+201092942466" target="_blank" className="text-green-700">
            <button className="relative fade-in-bottom font-bold px-2 py-1 sm:px-4 sm:py-1 text-sm rounded-3xl isolation-auto z-10 border-2 border-green-600 before:absolute before:w-full before:transition-all hover:text-white before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-green-600 before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700">
              <i className="fab fa-whatsapp"></i>
              WhatsApp
            </button>
          </a>
          <a href="#" className="hover:text-white">
            <button className="fade-in-bottom relative font-bold px-2 py-1 sm:px-4 sm:py-1 text-sm rounded-3xl isolation-auto z-10 border-2 border-black before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full hover:border-red-600 before:bg-black before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700">
              <i className="fas fa-comment"></i>
              Inquiry
            </button>
          </a>
        </div>
    
    </div>
  );
}
