import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const buttons = [
  { title: "Buy" },
  { title: "Rent" },
  { title: "Commercial Buy" },
  { title: "Commercial Rent" },
];

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

const ResultsSearch = () => {
  const [selectedOption, setSelectedOption] = useState("Rent");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBedrooms, setSelectedBedrooms] = useState("");
  const [location, setLocation] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [parking, setParking] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [showAreaPopover, setShowAreaPopover] = useState(false);
  const [showPricePopover, setShowPricePopover] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    const commonParams = {
      location,
      category: selectedCategory,
      bedrooms: selectedBedrooms,
      minArea,
      maxArea,
      minPrice,
      maxPrice,
      parking: parking.toString(),
      furnished: furnished.toString(),
      option: selectedOption,
    };

    const query = new URLSearchParams(commonParams).toString();

    try {
      const response = await fetch(`http://localhost:3000/api/listing/advanced-search?${query}`, {
        method: "GET",
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const listingsData = await response.json();
      console.log(listingsData);

      navigate("/results", { state: { listings: listingsData } });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getCategories = () => {
    if (selectedOption.includes("Commercial")) {
      return commercialCategories;
    }
    return residentialCategories;
  };

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
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        {buttons.map((button) => (
          <option key={button.title} value={button.title}>
            {button.title}
          </option>
        ))}
      </select>
      <select
        className="bg-transparent outline-none text-gray-700 px-4 py-2 border-l border-gray-300 w-full lg:w-auto"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Property type</option>
        {getCategories().map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select
        className="bg-transparent outline-none text-gray-700 px-4 py-2 border-l border-gray-300 w-full lg:w-auto"
        value={selectedBedrooms}
        onChange={(e) => setSelectedBedrooms(e.target.value)}
      >
        <option value="">Bedrooms</option>
        {["Studio", 1, 2, 3, 4, 5, 6, 7].map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="relative">
        <button
          className="bg-transparent outline-none text-gray-700 px-4 py-2 border-l border-gray-300 w-full lg:w-auto"
          onClick={() => setShowAreaPopover(!showAreaPopover)}
        >
          Area (sqft)
        </button>
        {showAreaPopover && (
          <div className="absolute z-10 bg-white shadow-lg rounded-lg p-6 mt-2 w-64">
            <input
              type="text"
              placeholder="Min. Area (sqft)"
              className="bg-transparent outline-none text-gray-700 px-4 py-2 border border-gray-300 w-full mb-2 lg:w-auto"
              value={minArea}
              onChange={(e) => setMinArea(e.target.value)}
            />
            <input
              type="text"
              placeholder="Max. Area (sqft)"
              className="bg-transparent outline-none text-gray-700 px-4 py-2 border border-gray-300 w-full lg:w-auto"
              value={maxArea}
              onChange={(e) => setMaxArea(e.target.value)}
            />
          </div>
        )}
      </div>
      <div className="relative">
        <button
          className="bg-transparent outline-none text-gray-700 px-4 py-2 border-l border-gray-300 w-full lg:w-auto"
          onClick={() => setShowPricePopover(!showPricePopover)}
        >
          Price
        </button>
        {showPricePopover && (
          <div className="absolute z-10 bg-white shadow-lg rounded-lg p-4 mt-2 w-64">
            <input
              type="text"
              placeholder="Min. Price (AED)"
              className="bg-transparent outline-none text-gray-700 px-4 py-2 border border-gray-300 w-full mb-2"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="text"
              placeholder="Max. Price (AED)"
              className="bg-transparent outline-none text-gray-700 px-4 py-2 border border-gray-300 w-full"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={parking}
            onChange={() => setParking(!parking)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="text-gray-700">Parking</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={furnished}
            onChange={() => setFurnished(!furnished)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="text-gray-700">Furnished</span>
        </label>
      </div>
      <button
        onClick={handleSearch}
        className="bg-black text-white hover:bg-red-600 transition-all rounded-full px-4 py-2"
      >
        Search
      </button>
    </div>
  );
};

export default ResultsSearch;
