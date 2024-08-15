import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ListingCard from "../../components/Listing/Card";
import ResultsSearch from "../../components/ResultsSearch";
import { Helmet } from "react-helmet-async";

const ListingResults = () => {
  const location = useLocation();
  const initialListings = location.state?.listings || [];
  const initialOption = location.state?.option || "Rent"; // Default to "Rent" if not provided
  const [listings, setListings] = useState(initialListings);
  const [selectedOption, setSelectedOption] = useState(initialOption);
  const [metadata, setMetadata] = useState({ title: '', description: '' });

  useEffect(() => {
    if (location.state?.listings) {
      setListings(location.state.listings);
    }
    if (location.state?.option) {
      setSelectedOption(location.state.option);
    }
    const fetchMetadata = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/results`);
          if (!response.ok) {
            throw new Error('Failed to fetch page metadata');
          }
          const data = await response.json();
          setMetadata(data);
        } catch (error) {
          console.error('Error fetching page metadata:', error);
        }
      };
  
      fetchMetadata();
  }, [location.state]);

  // Callback to update selected option from ResultsSearch
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="container mx-auto mt-28 fade-in-bottom">
      <Helmet>
        <title>{`${selectedOption} | ${metadata.title} `}</title>
        <meta
          name="description"
          content={`${metadata.description} Find your desired ${selectedOption.toLowerCase()} properties.`}
        />
      </Helmet>
      <ResultsSearch onOptionChange={handleOptionChange} />
      <div className="flex flex-wrap gap-6 fade-in-bottom mt-6">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
};

export default ListingResults;
