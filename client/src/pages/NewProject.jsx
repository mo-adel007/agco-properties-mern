import React, { useEffect, useState } from 'react';
import ProjectItem from '../components/ProjectItem';

export default function NewProject() {
  const [residentialProjects, setResidentialProjects] = useState([]);
  const [commercialProjects, setCommercialProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async (type, setProjects) => {
      try {
        const response = await fetch(`http://localhost:3000/api/project/projects/${type}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${type} projects`);
        }
        const data = await response.json();
        console.log(data)
        setProjects(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProjects('residential', setResidentialProjects);
    fetchProjects('commercial', setCommercialProjects);
  }, []);

  return (
    <div className="container mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">New Projects</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <section>
            <h2 className="text-xl font-semibold mb-4">Residential Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20">
              {residentialProjects.map((project) => (
                <ProjectItem key={project._id} project={project} />
              ))}
            </div>
          </section>
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Commercial Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20">
              {commercialProjects.map((project) => (
                <ProjectItem key={project._id} project={project} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
