import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProjectItem from "../components/ProjectItem";
import ProjectResultsSearch from "../components/ProjectResultsSearch";

export default function ProjectsResultsPage() {
  const location = useLocation();
  const initialProjects = location.state?.projects || [];
  const [projects, setProjects] = useState(initialProjects);

  useEffect(() => {
    if (location.state?.projects) {
      setProjects(location.state.projects);
    }
  }, [location.state]);

  return (
    <div className="container mx-auto mt-28 fade-in-bottom">
      <ProjectResultsSearch />
      <div className="flex flex-wrap gap-6 fade-in-bottom mt-6">
        {projects.map((project) => (
          <ProjectItem key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}
