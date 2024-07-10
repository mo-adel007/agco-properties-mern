// src/pages/Developer.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { developersData } from '../components/DeveloperData';

export default function Developer() {
  const navigate = useNavigate();

  return (
    <div className="py-8 mt-20">
      
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
