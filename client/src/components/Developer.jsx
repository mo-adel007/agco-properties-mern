import React from 'react';
import emar from "../assets/edits/emar.png";
import damac from "../assets/edits/damac.png";
import shobah from "../assets/edits/shobah.png";
import nakheel from "../assets/edits/NakheellogoNavy.png";
import nshama from "../assets/edits/nashama.png";
import meraas from "../assets/edits/Meraas.png";
import dubaiProperties from "../assets/edits/dubai-properties.png";
import tag from "../assets/edits/TAG_.png";
import ellington from "../assets/edits/ellington.png";
import samana from "../assets/edits/samana.png";
import aldar from "../assets/edits/el-daar.png";
import masaar from "../assets/edits/massar.png";

import team1 from '../assets/OIP.jpg';
// import team2 from '../assets/team1.png';
// import team3 from '../assets/team1.png';
// import team4 from '../assets/team1.png';
// import team5 from '../assets/team1.png';

const DevelopersAndTeam = () => {
  const logos = [
    { id: 1, name: "EMAAR", src: emar, alt: "EMAAR", url: "/emaar" },
    { id: 2, name: "DAMAC", src: damac, alt: "DAMAC", url: "/damac" },
    { id: 3, name: "SOBHA", src: shobah, alt: "SOBHA", url: "/sobha" },
    { id: 4, name: "NAKHEEL", src: nakheel, alt: "NAKHEEL", url: "/nakheel" },
    { id: 5, name: "NSHAMA", src: nshama, alt: "NSHAMA", url: "/nshama" },
    { id: 6, name: "MERAAS", src: meraas, alt: "MERAAS", url: "/meraas" },
    {
      id: 7,
      name: "DUBAI PROPERTIES",
      src: dubaiProperties,
      alt: "DUBAI PROPERTIES",
      url: "/dubai-properties",
    },
    {
      id: 8,
      name: "TILAL AL GHAF",
      src: tag,
      alt: "TILAL AL GHAF",
      url: "/tilal-al-ghaf",
    },
    {
      id: 9,
      name: "ELLINGTON",
      src: ellington,
      alt: "ELLINGTON",
      url: "/ellington",
    },
    { id: 10, name: "SAMANA", src: samana, alt: "SAMANA", url: "/samana" },
    { id: 11, name: "ALDAR", src: aldar, alt: "ALDAR", url: "/aldar" },
    { id: 12, name: "MASAAR", src: masaar, alt: "MASAAR", url: "/masaar" },
  ];
  

  const team = [
    { name: 'Member 1', img: team1 },
    { name: 'Member 2', img: team1 },
    { name: 'Member 3', img: team1 },
    { name: 'Member 4', img: team1 },
    { name: 'Member 5', img: team1 },
  ];

  return (
    <div className="container mx-auto px-4 py-8  w-full">
      <section className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-center mb-8 bg-red-600 text-white inline-block px-4 py-2 rounded">Developer</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {logos.map((logo, index) => (
            <div key={index} className="flex flex-col items-center fade-in-right">
              <img src={logo.src} alt={logo.name} className="h-20 mb-4" />
             
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
