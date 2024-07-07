import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import communityData from './communities.json'; // Import your JSON data here

const PriceIndicator = () => {
  const [communities, setCommunities] = useState([]);
  const [formData, setFormData] = useState({
    developer: "",
    community: ""
  });
  const [error, setError] = useState(null);
  const mapRef = useRef();

  const developers = [
    "emmar",
    "damac",
    "sobah-reality",
    "nakheel",
    "nshama",
    "meraas",
    "dubai-properties",
    "tilal-al-ghaf",
    "ellington",
    "samana",
    "aldar",
    "masaar",
  ];

  const fetchCommunities = async (developer) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/community/communities/developer/${developer}`
      );
      if (!res.ok) {
        throw new Error('Failed to fetch communities');
      }
      const data = await res.json();
      setCommunities(data);
      setError(null);
    } catch (error) {
      setError("Failed to fetch communities");
      console.error(error);
    }
  };

  useEffect(() => {
    if (formData.developer) {
      fetchCommunities(formData.developer);
    } else {
      setCommunities([]);
    }
  }, [formData.developer]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const findCommunityCoordinates = (communityId) => {
    const selectedCommunity = communities.find(c => c._id === communityId);
    if (!selectedCommunity) return [25.1941666, 55.2956219]; // Default coordinates if community not found

    const communityName = selectedCommunity.name;
    const communityFromJSON = communityData.find(c => c.name === communityName);
    return communityFromJSON ? communityFromJSON.coordinates : [25.1941666, 55.2956219]; // Default coordinates if not found
  };

  const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.setView(center, 13);
      }
    }, [center, map]);
    return null;
  };

  return (
    <div className="container mx-auto p-4 mt-28 flex">
      <div className="bg-white p-6 shadow-md rounded-lg max-w-sm mr-4">
        <form className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Developer
            </label>
            <select
              id="developer"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              onChange={handleChange}
              value={formData.developer}
            >
              <option value="">Select a developer</option>
              {developers.map((dev) => (
                <option key={dev} value={dev}>
                  {dev}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Community
            </label>
            <select
              id="community"
              className="border p-3 rounded-lg"
              onChange={handleChange}
              value={formData.community}
              required
            >
              <option value="">Select a community</option>
              {communities.map((community) => (
                <option key={community._id} value={community._id}>
                  {community.name}
                </option>
              ))}
            </select>
          </div>

        
        </form>
        {error && (
          <div className="text-red-500 mt-2">
            Error: {error}
          </div>
        )}
      </div>
      <div className="flex-1">
        <MapContainer
          center={[25.1941666, 55.2956219]}
          zoom={13}
          style={{ height: "400px" }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {formData.community && (
            <>
              <Marker position={findCommunityCoordinates(formData.community)}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
              <MapUpdater center={findCommunityCoordinates(formData.community)} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default PriceIndicator;
