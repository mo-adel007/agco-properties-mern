import React, { useState } from "react";

export default function ListProperty() {
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <>
      <h1 className="text-3xl font-semibold text-center my-7 mt-24">
        List your property
      </h1>
      <main className="flex flex-col p-6 max-w-4xl mx-auto shadow-xl bg-slate-300 rounded-lg">
        <form className="flex flex-col md:flex-row gap-6" action="">
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              placeholder="Name"
              className="border p-3 rounded-lg shadow-md focus:ring-2 ring-offset-2 ring-red-700 outline-none"
              id="name"
              maxLength="300"
              minLength="10"
              required
            />
            <textarea
              placeholder="Description"
              className=" p-3 rounded-lg shadow-md focus:ring-2 ring-offset-2 ring-red-700 outline-none"
              id="description"
              maxLength="1000"
              minLength="10"
              required
            />
            <input
              type="text"
              placeholder="Address"
              className="border p-3 rounded-lg shadow-md focus:ring-2 ring-offset-2 ring-red-700 outline-none"
              id="address"
              maxLength="62"
              minLength="10"
              required
            />
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="sell" className="form-checkbox h-5 w-5 text-blue-600" />
                <label htmlFor="sell" className="font-bold">Sell</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="rent" className="form-checkbox h-5 w-5 text-blue-600" />
                <label htmlFor="rent" className="font-bold">Rent</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="parking" className="form-checkbox h-5 w-5 text-blue-600" />
                <label htmlFor="parking" className="font-bold">Parking spot</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="furnished" className="form-checkbox h-5 w-5 text-blue-600" />
                <label htmlFor="furnished" className="font-bold">Furnished</label>
              </div>
              
            </div>
            <div className="flex gap-4 flex-wrap">
              <div className="flex flex-col items-center">
                <label htmlFor="beds" className="font-bold">Beds</label>
                <input
                  type="number"
                  id="beds"
                  min="1"
                  max="10"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex flex-col items-center">
                <label htmlFor="baths" className="font-bold">Baths</label>
                <input
                  type="number"
                  id="baths"
                  min="1"
                  max="10"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex flex-col items-center md:items-start">
                  <label htmlFor="regularPrice" className="font-bold">Regular Price</label>
                  <input
                    type="number"
                    id="regularPrice"
                    min="0"
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                  />
                  <span className="text-xs text-gray-500">(USD / Month)</span>
                </div>
               
              </div>
            </div>
            <div className="flex flex-col mt-4">
              <p className="font-semibold">
                Images:
                <span className="font-normal text-gray-600 ml-2">
                  The First will be the cover (max 6MB for each photo)
                </span>
              </p>
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                className="mt-2"
                onChange={handleImageUpload}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload Preview ${index}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 mt-1 mr-1 bg-red-600 text-white rounded-full p-1 text-xs"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="mt-3 p-3 text-white bg-green-600 border border-green-700 rounded uppercase hover:bg-green-700"
                type="button"
              >
                Upload
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center md:items-start w-full md:w-1/3">
            <button
              className="mt-6 p-3 w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              type="submit"
            >
              Create Listing
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
