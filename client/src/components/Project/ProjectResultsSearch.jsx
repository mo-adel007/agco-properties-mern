import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const residentialCategories = [
  "Apartment",
  "Villa",
  "Townhouse",
  "Duplex",
  "Hotel Apartment",
];

const commercialCategories = [
  "Office Space",
  "Retail",
  "Warehouse",
  "Half Floor",
  "Full Floor",
  "Co-working Space",
  "Clinic",
  "Pharmacy",
];

const deliveryYears = Array.from({ length: 7 }, (_, index) => 2024 + index);

const ProjectResultsSearch = () => {
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();
  const locationState = useLocation();

  const handleSearch = async () => {
    const commonParams = {
      location,
      typeOfUnit: selectedCategory,
      deliveryDate,
      status,
    };

    const query = new URLSearchParams(commonParams).toString();

    try {
      const response = await fetch(`http://localhost:3000/api/project/advanced-search?${query}`, {
        method: "GET",
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const projectsData = await response.json();

      navigate(locationState.pathname, { state: { projects: projectsData } });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const categories = [...residentialCategories, ...commercialCategories];

  return (
    <div className="bg-white rounded-full shadow-md flex flex-col lg:flex-row items-center px-4 py-2 space-y-4 lg:space-y-0 lg:space-x-4 w-full relative">
      <input
        type="text"
        placeholder="City, community or building"
        className="bg-transparent flex-grow outline-none text-gray-700 px-4 py-2 w-full lg:w-auto"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <select
        className="bg-transparent outline-none text-gray-700 px-4 py-2 border-l border-gray-300 w-full lg:w-auto"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Property type</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select
        className="bg-transparent outline-none text-gray-700 px-4 py-2 border-l border-gray-300 w-full lg:w-auto"
        value={deliveryDate}
        onChange={(e) => setDeliveryDate(e.target.value)}
      >
        <option value="">Delivery Date</option>
        {deliveryYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <select
        className="bg-transparent outline-none text-gray-700 px-4 py-2 border-l border-gray-300 w-full lg:w-auto"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">Status</option>
        <option value="ready">Ready</option>
        <option value="off plan">Off Plan</option>
      </select>
      <button
        onClick={handleSearch}
        className="bg-black hover:bg-red-500 transition-all text-white rounded-full px-4 py-2 w-full lg:w-auto"
      >
        Find
      </button>
    </div>
  );
};

export default ProjectResultsSearch;
