import React, { useEffect, useState } from "react";
import ListingItem from "../components/Card";

export default function Commercial() {
  const [commercialListings, setCommercialListings] = useState([]);

  useEffect(() => {
    const loadListings = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/listing/listings/type/commercial`);
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        console.log(`Fetched commercial data:`, data); // Debugging line
        if (Array.isArray(data)) {
          setCommercialListings(data);
        } else {
          console.error("Expected an array but received:", data);
        }
      } catch (error) {
        console.error(`Failed to fetch commercial listings:`, error); // Debugging line
      }
    };

    loadListings();
  }, []);

  return (
    <div>
        <h2 className="text-3xl font-bold my-8 mt-20">Commercial Properties</h2>

      <div className="listings-section">
        <div className="listings-grid">
          {commercialListings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
}
