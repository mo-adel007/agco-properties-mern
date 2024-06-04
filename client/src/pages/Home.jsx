import React, { useEffect, useState } from "react";
import houses from "../assets/4.png";
import About from "./About";
import CommunitiesAndProjects from "../components/Projects";
import DevelopersAndTeam from "../components/Developer";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import ListingItem from "../components/Card";

const Home = () => {
  const [buyListings, setBuyListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [commercialListings, setCommercialListings] = useState([]);

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

    loadListings("buy", setBuyListings);
    loadListings("rent", setRentListings);
    loadListings("commercial", setCommercialListings);
  }, []);

  return (
    <>
      <div className="h-screen relative">
        <div className="absolute inset-0">
          <img
            src={houses}
            className="object-cover w-full h-full fade-in-bottom"
            alt="City Houses"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center w-full pt-12">
          <h2 className="text-white text-4xl sm:text-5xl font-bold mt-32">
            Better Home, Better Investment
          </h2>
          <div className="relative mt-9 w-full max-w-3xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="listings-section">
        <h2 className="text-3xl font-bold my-8">Properties for sale</h2>
        <div className="listings-grid">
          {buyListings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>
      </div>

      <div className="listings-section">
        <h2 className="text-3xl font-bold my-8">Properties for rent</h2>
        <div className="listings-grid">
          {rentListings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>
      </div>

      

      <About />
      <CommunitiesAndProjects />
      <DevelopersAndTeam />
      <Footer />
    </>
  );
};

export default Home;
