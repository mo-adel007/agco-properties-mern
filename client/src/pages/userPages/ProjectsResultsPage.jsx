import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProjectItem from "../../components/Project/ProjectItem";
import ProjectResultsSearch from "../../components/Project/ProjectResultsSearch";
import { Helmet } from "react-helmet-async";

export default function ProjectsResultsPage() {
  const location = useLocation();
  const initialProjects = location.state?.projects || [];
  const initialOption = location.state?.option || "Projects"; // Default to "Rent" if not provided
  const [projects, setProjects] = useState(initialProjects);
  const [selectedOption, setSelectedOption] = useState(initialOption);
  const [metadata, setMetadata] = useState({ title: '', description: '' });

  useEffect(() => {
    if (location.state?.listings) {
      setListings(location.state.listings);
    }
    if (location.state?.option) {
      setSelectedOption(location.state.option);
    }
    const fetchMetadata = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/projects-results`);
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
  }, [location.state]);
 
  return (
    <div className="container mx-auto mt-28 fade-in-bottom">
        <Helmet>
        <title>{`${selectedOption} | ${metadata.title} `}</title>
        <meta
          name="description"
          content={`${metadata.description} Find your desired ${selectedOption.toLowerCase()} properties.`}
        />
        </Helmet>
      <ProjectResultsSearch />
      <div className="flex flex-wrap gap-6 fade-in-bottom mt-6">
        {projects.map((project) => (
          <ProjectItem key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}
