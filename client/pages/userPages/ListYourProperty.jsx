import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import ListingItem from '../../components/Listing/Card'
const ListYourProperty = () => {
  const [metadata, setMetadata] = useState({ title: "", description: "" });
  const [successfulListings, setSuccessfulListings] = useState([]); // State to store successful listings

 
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/list-your-property`);
        if (!response.ok) {
          throw new Error("Failed to fetch page metadata");
        }
        const data = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error("Error fetching page metadata:", error);
      }
    };

    const fetchSuccessfulListings = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/listing/successful-listings`);
        if (!response.ok) {
          throw new Error("Failed to fetch successful listings");
        }
        const data = await response.json();
        setSuccessfulListings(data); // Assuming the response is an array of listing objects
      } catch (error) {
        console.error("Error fetching successful listings:", error);
      }
    };

    fetchMetadata();
    fetchSuccessfulListings();
  }, []);

  
  return (
    <div className="container mx-auto p-4 mt-20 ">
      <Helmet>
        <title>{metadata.title || "Default Title"}</title>
        <meta
          name="description"
          content={metadata.description || "Default Description"}
        />
      </Helmet>
      <div className="bg-white p-6 shadow-md rounded-lg max-w-2xl mx-auto fade-in-bottom">
        <div className="grid grid-cols-3 gap-4 mb-6 fade-in-right">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-900">1 Step</div>
            <div className="font-semibold">List Your Property Details</div>
            <div className="text-sm text-gray-500">
              Add All The Information Related To Your Property
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-900">2 Step</div>
            <div className="font-semibold">One Of Our Agents Will Call You</div>
            <div className="text-sm text-gray-500">
              We Will Help You Find The Best Buyer
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-900">3 Step</div>
            <div className="font-semibold">Meet With Serious Buyers</div>
            <div className="text-sm text-gray-500">
              Final Step To Sell Your Property
            </div>
          </div>
        </div>
        <form className="space-y-4 fade-in-right">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm rounded-l-md">
                  🇪🇬
                </span>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-r-md shadow-sm"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                <option value="">Select Location</option>
                {/* Add more locations as needed */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Compound
              </label>
              <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                <option value="">Select Compound</option>
                {/* Add more compounds as needed */}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property Type
            </label>
            <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">Select Property Type</option>
              {/* Add more property types as needed */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
          </div>
          <div>
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded-md shadow-sm"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
        <div className="mb-10">
        <h2 className="text-4xl font-bold text-center mb-6">Successful Stories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {successfulListings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListYourProperty;
