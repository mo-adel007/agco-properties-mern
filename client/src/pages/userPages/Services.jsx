// src/components/Services.js
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaBook, FaHome, FaKey, FaCalculator, FaBuilding } from "react-icons/fa";
import { Link } from "react-router-dom";

const Services = () => {
  const [metadata, setMetadata] = useState({ title: "", description: "" });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/services`);
        if (!response.ok) {
          throw new Error("Failed to fetch page metadata");
        }
        const data = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error("Error fetching page metadata:", error);
      }
    };

    fetchMetadata();
  }, []);
  return (
    <div className="p-8 mt-16 fade-in-bottom">
     <Helmet>
        <title>{metadata.title || "Default Title"}</title>
        <meta
          name="description"
          content={metadata.description || "Default Description"}
        />
      </Helmet>
      <h2 className="text-3xl font-semibold text-center mb-4">
        We help people buy, rent and sell homes
      </h2>
      <p className="text-center mb-8">
        Home buying can be a stressful process, but we take the guess work out of finding a real estate agent. We'll help you find the perfect match to purchase your ideal home.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 fade-in-right">
        <div className="bg-white shadow-md p-4 rounded-lg ">
          <div className="flex items-center mb-2">
            <FaBook className="text-2xl text-blue-500 mr-2" />
            <h3 className="text-xl font-semibold">Buyer Guide</h3>
          </div>
          <ul className="space-y-2">
            <li><Link to="/price-indicator" className="text-blue-500 hover:underline">Price Indicator</Link></li>
            <li><Link to="/budget-calculator" className="text-blue-500 hover:underline">Budget Calculator</Link></li>
          </ul>
        </div>
        <div className="bg-white shadow-md p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaHome className="text-2xl text-yellow-500 mr-2" />
            <h3 className="text-xl font-semibold">Buy Residential</h3>
          </div>
          <p>
            Easily navigate through the process of buying residential properties with our expert guidance.
          </p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaKey className="text-2xl text-red-500 mr-2" />
            <h3 className="text-xl font-semibold">Leasing Residential</h3>
          </div>
          <p>
            We offer comprehensive leasing services, offering both long-term and short-term leasing options tailored to your needs.
          </p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaCalculator className="text-2xl text-green-500 mr-2" />
            <h3 className="text-xl font-semibold">Property Management</h3>
          </div>
          <p>
            Professional property management services in Dubai, ensuring your property is well-maintained and your tenants are happy.
          </p>
       
          </div>
        <div className="bg-white shadow-md p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaBuilding className="text-2xl text-purple-500 mr-2" />
            <h3 className="text-xl font-semibold">Commercial Property</h3>
          </div>
          <p>
            Assistance in buying, leasing, or managing commercial properties. Our services ensure you find the best properties for your business needs.
          </p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaHome className="text-2xl text-orange-500 mr-2" />
            <h3 className="text-xl font-semibold">Relocation Services</h3>
          </div>
          <p>
            We provide comprehensive relocation services to make your move to or within Dubai smooth and stress-free.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;