import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const buttons = [
  { title: "Buy" },
  { title: "Rent" },
  { title: "Commercial" },
  { title: "New Projects" },
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

const deliveryYears = Array.from({ length: 7 }, (_, index) => 2024 + index);

const SearchBar = () => {
  const [selectedOption, setSelectedOption] = useState("Rent");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBedrooms, setSelectedBedrooms] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleButtonClick = (option) => {
    setSelectedOption(option);
    setSelectedCategory("");
    setSelectedBedrooms("");
    setLocation("");
  };

  const handleBedroomsChange = (e) => {
    setSelectedBedrooms(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSearch = async () => {
    const commonParams = { location };

    if (selectedOption === "New Projects") {
      if (selectedBedrooms) {
        commonParams.deliveryDate = selectedBedrooms; // Send the year directly
      }
      commonParams.typeOfUnit = selectedCategory;
    } else {
      commonParams.option = selectedOption;
      commonParams.bedrooms = selectedBedrooms;
      commonParams.category = selectedCategory;
    }

    const query = new URLSearchParams(commonParams).toString();

    try {
      let listingsData = [];
      let projectsData = [];

      if (selectedOption === "New Projects") {
        const projectsResponse = await fetch(
          `/api/project/search?${query}`,
          { method: "GET" }
        );

        if (!projectsResponse.ok) {
          const projectsText = await projectsResponse.text();
          throw new Error(projectsText);
        }

        projectsData = await projectsResponse.json();
      } else {
        const listingsResponse = await fetch(
          `/api/listing/search?${query}`,
          { method: "GET" }
        );

        if (!listingsResponse.ok) {
          const listingsText = await listingsResponse.text();
          throw new Error(listingsText);
        }

        listingsData = await listingsResponse.json();
      }

      if (selectedOption === "New Projects") {
        navigate("/projects-results", {
          state: { projects: projectsData, option: selectedOption },
        });
      } else {
        navigate("/results", {
          state: { listings: listingsData, option: selectedOption },
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  let categories = [];
  if (selectedOption === "Commercial") {
    categories = commercialCategories;
  } else if (
    selectedOption === "Buy" ||
    selectedOption === "Rent" ||
    selectedOption === "New Projects"
  ) {
    categories = [...residentialCategories, ...commercialCategories];
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap justify-between bg-white rounded-full shadow-md items-center p-1">
        {buttons.map((button) => (
          <button
            key={button.title}
            onClick={() => handleButtonClick(button.title)}
            className={`flex-grow sm:flex-grow-0 sm:mr-2 mb-2 sm:mb-0 rounded-full px-4 py-2 font-semibold ${
              selectedOption === button.title
                ? "bg-gray-300"
                : "bg-gray-100 hover:bg-red-200"
            } text-gray-700`}
          >
            {button.title}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-full shadow-md flex flex-wrap sm:flex-nowrap items-center p-1 mt-4">
        <input
          type="text"
          className="flex-grow w-full sm:w-auto px-4 py-2 mb-2 sm:mb-0 rounded-full focus:outline-none"
          placeholder="City, community or building"
          value={location}
          onChange={handleLocationChange}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="flex-grow w-full sm:w-auto bg-white text-gray-700 px-4 py-2 mb-2 sm:mb-0 rounded-full focus:outline-none"
        >
          <option value="">Property type</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          value={selectedBedrooms}
          onChange={handleBedroomsChange}
          className="flex-grow w-full sm:w-auto bg-white text-gray-700 px-4 py-2 mb-2 sm:mb-0 rounded-full focus:outline-none"
        >
          <option value="">
            {selectedOption === "New Projects" ? "Delivery Date" : "Bedrooms"}
          </option>
          {(selectedOption === "New Projects"
            ? deliveryYears
            : ["Studio", 1, 2, 3, 4, 5, 6, 7]
          ).map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          className="w-full sm:w-auto bg-black hover:bg-red-700 text-white rounded-full px-6 py-2 font-semibold focus:outline-none"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
