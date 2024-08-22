import React, { useEffect, useState } from "react";

const CommunitiesAndProjects = () => {
  const [projects, setProjects] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/project/featured-projects"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/community/featured-communities"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch communities");
        }
        const data = await response.json();
        setCommunities(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Dubai Top Communities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {communities.map((community, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden transition-transform transform hover:scale-105"
            >
              <img
                src={
                  community.imageUrls[0] ||
                  "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
                }
                alt={community.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-xl font-semibold">{community.name}</h3>
             
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">
          Trending New Projects
        </h2>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">Error: {error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {projects.map((project, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden transition-transform transform hover:scale-105"
              >
                <img
                  src={
                    project.imageUrls[0] ||
                    "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
                  }
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-xl font-semibold">{project.name}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CommunitiesAndProjects;