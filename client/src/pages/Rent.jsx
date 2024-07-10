import React, { useEffect, useState } from "react";
import ListingItem from "../components/Card";

export default function Rent() {
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
  const residentialCategories = [
    "Apartment",
    "Villa",
    "Townhouse",
    "Duplex",
    "Hotel Apartment",
  ];

  const [rentListings, setRentListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const loadListings = async (status, setState) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/listing/listings/${status}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setState(data);
          setFilteredListings(data); // Initially set to all listings
        } else {
          console.error("Expected an array but received:", data);
        }
      } catch (error) {
        console.error(`Failed to fetch ${status} listings:`, error);
      }
    };

    loadListings("rent", setRentListings);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredListings(
        rentListings.filter((listing) => listing.category === selectedCategory)
      );
    } else {
      setFilteredListings(rentListings);
    }
  }, [selectedCategory, rentListings]);

  return (
    <div className="w-90">
      <h2 className="text-3xl font-bold my-8 mt-20">Properties for rent</h2>
      <div className="tabs">
        {commercialCategories.concat(residentialCategories).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 mx-2 ${
              selectedCategory === category
                ? "bg-red-700 text-white"
                : "bg-gray-300 hover:bg-red-700 hover:text-white transition-all"
            } rounded`}
          >
            {category} ({rentListings.filter((listing) => listing.category === category).length})
          </button>
        ))}
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-4 py-2 mx-2 ${
            selectedCategory === ""
              ? "bg-red-700 text-white"
              : "bg-gray-300 hover:bg-red-700 hover:text-white transition-all"
          } rounded`}
        >
          All ({rentListings.length})
        </button>
      </div>
      <div className="listings-section">
        <div className="listings-grid">
          {filteredListings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
}
