import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const PriceIndicator = () => {
  const [communities, setCommunities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    developer: "",
    community: "",
  });
  const [error, setError] = useState(null);
  const mapRef = useRef();
  const [metadata, setMetadata] = useState({ title: "", description: "" });


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
        throw new Error("Failed to fetch communities");
      }
      const data = await res.json();
      setCommunities(data);
      setError(null);
    } catch (error) {
      setError("Failed to fetch communities");
      console.error(error);
    }
  };

  const fetchProjectsByCommunity = async (communityId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/project/projects/community/${communityId}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch projects");
      }
      const projectsData = await res.json();

      // Fetch starting prices for each project
      const projectsWithStartingPrices = await Promise.all(
        projectsData.map(async (project) => {
          const startingPrice = await fetchStartingPrice(project._id);
          return { ...project, startingPrice };
        })
      );

      setProjects(projectsWithStartingPrices);
      setError(null);
    } catch (error) {
      setError("Failed to fetch projects");
      console.error(error);
    }
  };
  const fetchStartingPrice = async (projectId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/listing/listings/starting-price/${projectId}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch starting price");
      }
      const data = await res.json();
      return data.startingPrice;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    if (formData.developer) {
      fetchCommunities(formData.developer);
    } else {
      setCommunities([]);
    }
  }, [formData.developer]);

  useEffect(() => {
    if (formData.community) {
      fetchProjectsByCommunity(formData.community);
    } else {
      setProjects([]);
    }
  }, [formData.community]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };
  const fetchMetadata = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/price-indicator`);
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
  const getCenterCoordinates = (projects) => {
    if (projects.length > 0) {
      const [firstProject] = projects;
      return [firstProject.latitude, firstProject.longitude];
    }
    return [25.1941666, 55.2956219]; // Default coordinates
  };

  const MapUpdater = ({ center }) => {
    const map = useMap();
    const prevCenterRef = useRef(center);

    useEffect(() => {
      if (center && (prevCenterRef.current[0] !== center[0] || prevCenterRef.current[1] !== center[1])) {
        map.setView(center, 13);
        prevCenterRef.current = center; // Update the previous center
      }
    }, [center, map]);
    return null;
  };

  const centerCoordinates = getCenterCoordinates(projects);

  return (
    <div className="container mx-auto p-4 mt-28 flex">
          <Helmet>
        <title>{metadata.title || "Default Title"}</title>
        <meta
          name="description"
          content={metadata.description || "Default Description"}
        />
      </Helmet>
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
        {error && <div className="text-red-500 mt-2">Error: {error}</div>}
      </div>
      <div className="flex-1">
        <MapContainer
          center={[26.820553, 30.802498]}
          zoom={4}
          style={{ height: "400px" }}
          ref={mapRef}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {projects.map((project) => (
            <Marker
              key={project._id}
              position={[project.latitude, project.longitude]}
            >
              <Popup>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "200px",
                  }}
                >
                  <img
                    src={project.imageUrls[0]}
                    alt={project.name}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      marginRight: 10,
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: "bold" }}>
                      {project.name} | {project.community.name}
                    </div>
                    <div style={{ color: "#01b0f0" }}>
                      Start Price:{" "}
                      {project.startingPrice
                        ? `${project.startingPrice} AED`
                        : "N/A"}
                    </div>
                    <Link to={`/project/${project._id}`}>
                      <button
                        style={{
                          backgroundColor: "#01b0f0",
                          color: "#fff",
                          borderRadius: "12px",
                          border: "none",
                          marginTop: "10px",
                          padding: "5px 5px",
                          cursor: "pointer",
                        }}
                      >
                        + More
                      </button>
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          {projects.length > 0 && <MapUpdater center={centerCoordinates} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default PriceIndicator;

// import React, { useState, useEffect, useRef } from "react";
// import mapboxgl from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";

// mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;

// const PriceIndicator = () => {
//   const [communities, setCommunities] = useState([]);
//   const [formData, setFormData] = useState({
//     developer: "",
//     community: "",
//   });
//   const [error, setError] = useState(null);
//   const mapContainer = useRef(null);
//   const map = useRef(null);
//   const [lng, setLng] = useState(-70.9);
//   const [lat, setLat] = useState(42.35);
//   const [zoom, setZoom] = useState(9);

//   const developers = [
//     "emmar",
//     "damac",
//     "sobah-reality",
//     "nakheel",
//     "nshama",
//     "meraas",
//     "dubai-properties",
//     "tilal-al-ghaf",
//     "ellington",
//     "samana",
//     "aldar",
//     "masaar",
//   ];

//   const fetchCommunities = async (developer) => {
//     try {
//       const res = await fetch(
//         `http://localhost:3000/api/community/communities/developer/${developer}`
//       );
//       if (!res.ok) {
//         throw new Error("Failed to fetch communities");
//       }
//       const data = await res.json();
//       setCommunities(data);
//       setError(null);
//     } catch (error) {
//       setError("Failed to fetch communities");
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     if (formData.developer) {
//       fetchCommunities(formData.developer);
//     } else {
//       setCommunities([]);
//     }
//   }, [formData.developer]);

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData({
//       ...formData,
//       [id]: value,
//     });
//   };

//   useEffect(() => {
//     if (map.current) return; // initialize map only once
//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: "mapbox://styles/mapbox/streets-v12",
//       center: [lng, lat],
//       zoom: zoom,
//     });
//   }, [lng, lat, zoom]);

//   return (
//     <div className="container mx-auto p-4 mt-28 flex flex-col lg:flex-row">
//       <div className="bg-white p-6 shadow-md rounded-lg max-w-lg w-full lg:w-1/3 mr-0 lg:mr-4 mb-4 lg:mb-0">
//         <form className="space-y-8">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Developer
//             </label>
//             <select
//               id="developer"
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
//               onChange={handleChange}
//               value={formData.developer}
//             >
//               <option value="">Select a developer</option>
//               {developers.map((dev) => (
//                 <option key={dev} value={dev}>
//                   {dev}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Community
//             </label>
//             <select
//               id="community"
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
//               onChange={handleChange}
//               value={formData.community}
//               required
//             >
//               <option value="">Select a community</option>
//               {communities.map((community) => (
//                 <option key={community._id} value={community._id}>
//                   {community.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </form>
//         {error && <div className="text-red-500 mt-2">Error: {error}</div>}
//       </div>

//       <div className="flex-1 h-96 lg:h-auto">
//         <div ref={mapContainer} className="map-container h-full w-full" />
//       </div>
//     </div>
//   );
// };

// export default PriceIndicator;
