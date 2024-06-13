import React, { useEffect, useState } from "react";
import ListingItem from "../components/Card";

export default function Rent() {
    const [rentListings, setRentListings] = useState([]);
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
        } else {
          console.error("Expected an array but received:", data);
        }
      } catch (error) {
        console.error(`Failed to fetch ${status} listings:`, error);
      }
    };

    loadListings("rent", setRentListings);
  }, [])
  return (
    <div className="w-90">
        <h2 className="text-3xl font-bold my-8 mt-20">Properties for rent</h2>
         <div className="listings-section">
        <div className="listings-grid">
          {rentListings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  )
}
