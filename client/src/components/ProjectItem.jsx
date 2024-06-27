import React from "react";
import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

export default function ProjectItem({ project }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/project/${project._id}`}>
        <img
          src={
            project.imageUrls[0] ||
            "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
          }
          alt="project cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {project.name} by {project.community.name} | {project.developer}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-red-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {project.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {project.description}
          </p>
        </div>
        <div className="flex gap-10 p-2 pl-8">
          <a href="https://wa.me/1234567890" className="text-green-700">
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
      </Link>
    </div>
  );
}
