import React from 'react';
import { useLocation } from 'react-router-dom';
import ListingItem from '../components/Card';

const Results = () => {
  const location = useLocation();
  const { listings } = location.state || { listings: [] };

  return (
    <div className="container mx-auto mt-28">
      <div className="flex flex-wrap gap-6">
        {listings.map((listing) => (
          <ListingItem key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
};

export default Results;
