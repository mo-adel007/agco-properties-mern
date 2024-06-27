import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { developersData } from '../components/DeveloperData';
import ProjectItem from "../components/ProjectItem";

export default function DeveloperPage() {
  const { developer } = useParams();
  const [projects, setProjects] = useState([]);
  const [otherProjects, setOtherProjects] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState("");

  const normalizedDeveloper = normalizeDeveloperName(developer);
  const developerData = developersData[normalizedDeveloper];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/project/projects/developer/${developer}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const fetchOtherProjects = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/project/projects`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        const otherProjects = data.filter(project => project.developer !== developer);
        setOtherProjects(otherProjects);
      } catch (error) {
        console.error("Error fetching other projects:", error);
      }
    };

    const fetchCommunities = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/community/communities/developer/${developer}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        setCommunities(data);
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    };

    fetchProjects();
    fetchOtherProjects();
    fetchCommunities();
  }, [developer]);

  useEffect(() => {
    const fetchProjectsByCommunity = async () => {
      try {
        let response;
        if (selectedCommunity) {
          response = await fetch(`http://localhost:3000/api/project/projects/community/${selectedCommunity}`);
        } else {
          response = await fetch(`http://localhost:3000/api/project/projects/developer/${developer}`);
        }

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects by community:", error);
      }
    };

    fetchProjectsByCommunity();
  }, [selectedCommunity, developer]);

  if (!developerData) {
    return <div>Developer data not found.</div>;
  }

  const { name, description } = developerData;

  const handleCommunityClick = (communityId) => {
    if (selectedCommunity === communityId) {
      setSelectedCommunity("");
    } else {
      setSelectedCommunity(communityId);
    }
  };

  return (
    <div className="container mx-auto py-8 mt-16">
      <h1 className="text-3xl font-bold text-center mb-8">
        About {name} Properties
      </h1>
      <p className="text-center text-gray-700 mb-8">{description}</p>
      
      <div className="flex justify-center mb-8">
        {communities.map((community, index) => (
          <button
            key={index}
            onClick={() => handleCommunityClick(community._id)}
            className={`px-4 py-2 mx-2 ${
              selectedCommunity === community._id ? "bg-red-700 text-white" : "bg-gray-300 hover:bg-red-700 hover:text-white transition-all"
            } rounded`}
          >
            {community.name}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <ProjectItem key={project._id} project={project} />
          ))
        ) : (
          <div className="text-3xl font-bold text-center mb-8">Coming Soon...</div>
        )}
      </div>

      <h2 className="text-3xl font-bold text-center mt-16 mb-8">
        Other Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherProjects.map((project) => (
          <div key={project._id} className="border p-4 rounded-lg shadow-lg">
            <img
              src={project.imageUrls[0] || "https://via.placeholder.com/150"}
              alt={project.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            {/* <h3 className="text-xl font-bold mb-2">{project.name}</h3>
            <p className="text-gray-700 mb-2">{project.description}</p>
            <a href={`/project/${project._id}`} className="text-blue-500 hover:underline">
              Learn more
            </a> */}
          </div>
        ))}
      </div>
    </div>
  );
}

function normalizeDeveloperName(name) {
  return name.toLowerCase().replace(/\s+/g, '');
}
