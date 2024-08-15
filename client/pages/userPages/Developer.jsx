// src/pages/Developer.js
import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { developersData } from '../../components/DeveloperData';
import { Helmet } from "react-helmet-async";

export default function Developer() {
  const [metadata, setMetadata] = useState({ title: '', description: '' });

  const navigate = useNavigate();
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/developer`);
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
  }, []);

  return (
    
    <div className="py-8 mt-20">
        <Helmet>
        <title>{metadata.title || "Default Title"}</title>
        <meta name="description" content={metadata.description || "Default Description"} />
      </Helmet>
      <h2 className="fade-in-bottom text-center text-xl font-bold mb-8">
        Choose Your Desired Community With The Best Developers In The Market
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {Object.keys(developersData).map((key) => {
          const developer = developersData[key];
          return (
            <button
              key={developer.name}
              onClick={() => navigate(`/developer/${key}`)}
              className="fade-in-right flex justify-center items-center p-4 border-2 border-gray-300 rounded-full overflow-hidden transition-colors duration-300 hover:bg-slate-400"
            >
              <img
                src={developer.logo}
                alt={developer.name}
                className="w-30 h-30 object-contain rounded-full"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
