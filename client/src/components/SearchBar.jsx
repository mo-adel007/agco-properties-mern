import React, { useState } from 'react';

const buttons = [
  { title: "Buy" },
  { title: "Rent" },
  { title: "Commercial" },
  { title: "New Projects" },
];

const SearchBar = () => {
  const [selectedOption, setSelectedOption] = useState('Rent');

  const handleButtonClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap justify-between bg-white rounded-full shadow-md items-center p-1">
        {buttons.map((button) => (
          <button
            key={button.title}
            onClick={() => handleButtonClick(button.title)}
            className={`flex-grow sm:flex-grow-0 sm:mr-2 mb-2 sm:mb-0 rounded-full px-4 py-2 font-semibold ${
              selectedOption === button.title ? 'bg-gray-300' : 'bg-gray-100 hover:bg-red-200'
            } text-gray-700`}
          >
            {button.title}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-full shadow-md flex flex-wrap sm:flex-nowrap items-center p-1 mt-4">
        <input
          type="text"
          className="flex-grow w-full sm:w-auto px-4 py-2 mb-2 sm:mb-0 rounded-full focus:outline-none"
          placeholder="City, community or building"
        />
        <select className="flex-grow w-full sm:w-auto bg-white text-gray-700 px-4 py-2 mb-2 sm:mb-0 rounded-full focus:outline-none">
          <option>Property type</option>
          {/* Add more options as needed */}
        </select>
        <select className="flex-grow w-full sm:w-auto bg-white text-gray-700 px-4 py-2 mb-2 sm:mb-0 rounded-full focus:outline-none">
          <option>Beds & Baths</option>
          {/* Add more options as needed */}
        </select>
        <button className="w-full sm:w-auto bg-black hover:bg-red-700 text-white rounded-full px-6 py-2 font-semibold focus:outline-none">
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
