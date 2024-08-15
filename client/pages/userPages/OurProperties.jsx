import React, { useState, useEffect } from 'react';
import ListingItem from '../../components/Listing/Card';
import { Helmet } from 'react-helmet-async';

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

export default function OurProperties() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [metadata, setMetadata] = useState({ title: "", description: "" });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/listing/listings');
        const data = await res.json();
        console.log("Fetched data:", data);
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListings(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(true);
        setLoading(false);
      }
    };
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/our-properties`);
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

    fetchListings();
  }, []);

  const handleTypeChange = async (e) => {
    const type = e.target.value;
    setSelectedType(type);
    setSelectedCategory('');
    await fetchFilteredListings(type, selectedStatus, selectedCategory);
  };

  const handleStatusChange = async (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    await fetchFilteredListings(selectedType, status, selectedCategory);
  };

  const handleCategoryChange = async (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    await fetchFilteredListings(selectedType, selectedStatus, category);
  };

  const fetchFilteredListings = async (type, status, category) => {
    try {
      let query = `?isPublished=true`;
      if (type) query += `&type=${type}`;
      if (status) query += `&status=${status}`;
      if (category) query += `&category=${category}`;

      const res = await fetch(`http://localhost:3000/api/listing/search${query}`);
      const data = await res.json();
      console.log("Fetched filtered data:", data);
      if (data.success === false) {
        setError(true);
        return;
      }
      setListings(data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(true);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-20">
         <Helmet>
        <title>{metadata.title || "Default Title"}</title>
        <meta
          name="description"
          content={metadata.description || "Default Description"}
        />
      </Helmet>
      <div className="flex gap-4 mb-4">
        <select
          value={selectedType}
          onChange={handleTypeChange}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Type</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
        </select>

        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="p-2 border border-gray-300 rounded-md"
          disabled={!selectedType}
        >
          <option value="">Select Status</option>
          <option value="buy">Buy</option>
          <option value="rent">Rent</option>
        </select>

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border border-gray-300 rounded-md"
          disabled={!selectedType}
        >
          <option value="">Select Category</option>
          {selectedType === 'residential' &&
            residentialCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          {selectedType === 'commercial' &&
            commercialCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
        </select>
      </div>

      {loading && <p className="text-center text-2xl">Loading...</p>}
      {error && <p className="text-center text-2xl">Something went wrong!</p>}
      {!loading && !error && listings.length === 0 && (
        <p className="text-center text-2xl">No listings available</p>
      )}
      {!loading && !error && listings.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => {
            console.log("Rendering listing:", listing);
            return <ListingItem key={listing._id} listing={listing} />;
          })}
        </div>
      )}
    </div>
  );
}
