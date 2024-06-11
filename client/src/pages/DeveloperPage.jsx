// src/pages/DeveloperPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { developersData } from '../components/DeveloperData';
import ListingItem from "../components/Card";

export default function DeveloperPage() {
  const { developer } = useParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState("");

  const developerData = developersData[developer.toLowerCase()];
  console.log("Developer Data:", developerData);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        console.log(`Fetching listings for developer: ${developer} and community: ${selectedCommunity}`);
        const response = await fetch(`http://localhost:3000/api/listing/listings/developer/${developer}/community/${selectedCommunity}`);
        console.log('Response:', response);

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response");
        }

        const data = await response.json();
        console.log("Fetched data:", data);
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCommunity) {
      fetchListings();
    }
  }, [developer, selectedCommunity]);

  if (!developerData) {
    return <div>Developer data not found.</div>;
  }

  const { name, description, communities, projects } = developerData;

  return (
    <div className="container mx-auto py-8 mt-16">
      <h1 className="text-3xl font-bold text-center mb-8">
        About {name} Properties
      </h1>
      <p className="text-center text-gray-700 mb-8">{description}</p>
      
      <div className="flex justify-center mb-8">
        {communities.map((community, index) => (
          <button
            key={index}
            onClick={() => setSelectedCommunity(community)}
            className={`px-4 py-2 mx-2 ${
              selectedCommunity === community ? "bg-red-700 text-white" : "bg-gray-300 hover:bg-red-700 hover:text-white transition-all"
            } rounded`}
          >
            {community}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.length > 0 ? listings.map((listing) => (
          <ListingItem key={listing._id} listing={listing} />
        )) : <div className="text-3xl font-bold text-center mb-8">Coming Soon...</div>}
      </div>

      <h2 className="text-3xl font-bold text-center mt-16 mb-8">
        Other Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.name} className="border p-4 rounded-lg shadow-lg">
            <img
              src={project.imageUrl}
              alt={project.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-bold mb-2">{project.name}</h3>
            <a href={project.link} className="text-blue-500 hover:underline">
              Learn more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
