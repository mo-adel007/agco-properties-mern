import React from 'react';
// Import developer and team member images
import developer1 from '../assets/house.png';
// import developer2 from '../assets/developer1.png';
// import developer3 from '../assets/developer1.png';
// import developer4 from '../assets/developer1.png';
// import developer5 from '../assets/developer1.png';
// import developer6 from '../assets/developer1.png';
// import developer7 from '../assets/developer1.png';

import team1 from '../assets/OIP.jpg';
// import team2 from '../assets/team1.png';
// import team3 from '../assets/team1.png';
// import team4 from '../assets/team1.png';
// import team5 from '../assets/team1.png';

const DevelopersAndTeam = () => {
  const developers = [
    { name: 'Dubai Investments', img: developer1 },
    { name: 'Dubai Holding', img: developer1 },
    { name: 'LEOS', img: developer1 },
    { name: 'Danube Properties', img: developer1 },
    { name: 'Arada', img: developer1 },
    { name: 'Developer 6', img: developer1 },
    { name: 'Developer 7', img: developer1 },
  ];

  const team = [
    { name: 'Member 1', img: team1 },
    { name: 'Member 2', img: team1 },
    { name: 'Member 3', img: team1 },
    { name: 'Member 4', img: team1 },
    { name: 'Member 5', img: team1 },
  ];

  return (
    <div className="container mx-auto px-4 py-8  w-4/5">
      <section className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-center mb-8 bg-red-600 text-white inline-block px-4 py-2 rounded">Developer</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {developers.map((developer, index) => (
            <div key={index} className="flex flex-col items-center">
              <img src={developer.img} alt={developer.name} className="h-20 mb-4" />
              <p className="text-sm text-center">{developer.name}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="text-center">
        <h2 className="text-3xl font-bold text-center mb-8 bg-red-600 text-white inline-block px-4 py-2 rounded">Our Team</h2>
        <div className="flex flex-wrap justify-center gap-8 p-4">
          {team.map((member, index) => (
            <div key={index} className="p-7 flex flex-col items-center">
              <img src={member.img} alt={member.name} className="h-32 w-32 rounded-full mb-4" />
              <p className="text-sm text-center">{member.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DevelopersAndTeam;
