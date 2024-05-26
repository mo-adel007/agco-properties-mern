import React from 'react';
import city from '../assets/city.jpg';

const communities = [
  { name: 'Downtown Dubai', img: city},
  { name: 'Dubai Marina', img: city },
  { name: 'Palm Jabel Ali', img: city },
  { name: 'Palm Jumeirah', img: city },
  { name: 'Business Bay', img: city },
  { name: 'Dubai Hills Estate', img: city },
  { name: 'Emaar Beach Front', img: city }
];

const projects = [
  { name: 'Hyde Walk - Imtiaz', img: city, price: 'AED 1.73M', plan: '20/80' },
  { name: 'Stonehenge Residence', img: city, price: 'AED 675K', plan: '50/50' },
  { name: 'Volga Tower - Tiger', img: city, price: 'AED 1.8M', plan: '40/60' },
  { name: 'Verde - Sobha', img: city, price: 'AED 2.67M', plan: '80/20' }
];

const CommunitiesAndProjects = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Dubai Top Communities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {communities.map((community, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden transition-transform transform hover:scale-105"
            >
              <img src={community.img} alt={community.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-xl font-semibold">{community.name}</h3>
                <button className="mt-2 px-3 py-1 bg-blue-500 rounded">MORE DETAILS</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Trending New Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden transition-transform transform hover:scale-105"
            >
              <img src={project.img} alt={project.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-xl font-semibold">{project.name}</h3>
                <p className="mt-1">{project.price}</p>
                <p className="mt-1">{project.plan}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CommunitiesAndProjects;
