import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ListingCard from '../components/Card';
import ResultsSearch from '../components/ResultsSearch';

const ListingResults = () => {
  const location = useLocation();
  const initialListings = location.state?.listings || [];
  const [listings, setListings] = useState(initialListings);

  useEffect(() => {
    if (location.state?.listings) {
      setListings(location.state.listings);
    }
  }, [location.state]);

  return (
    <div className="container mx-auto mt-28 fade-in-bottom">
      <ResultsSearch />
      <div className="flex flex-wrap gap-6 fade-in-bottom mt-6">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
};

export default ListingResults;
