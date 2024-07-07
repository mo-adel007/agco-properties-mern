import React from "react";
import { useNavigate } from "react-router-dom";
import { developersData } from '../components/DeveloperData';
import team1 from '../assets/OIP.jpg';
const team = [
  { name: 'Member 1', img: team1 },
  { name: 'Member 2', img: team1 },
  { name: 'Member 3', img: team1 },
  { name: 'Member 4', img: team1 },
  { name: 'Member 5', img: team1 },
];


export default function Developer() {
  const navigate = useNavigate();

  return (
    <div className="py-8 mt-20 text-center">
      {/* <h2 className="fade-in-bottom text-center text-3xl  font-bold text-white rounded mb-8 bg-red-600">
        Choose Your Desired Community With The Best Developers In The Market
      </h2> */}
        <h2 className="text-3xl font-bold text-center mb-8 bg-red-600 text-white inline-block px-4 py-2 rounded">Our Developers</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {Object.keys(developersData).map((key) => {
          const developer = developersData[key];
          return (
            <button
              key={developer.name}
              onClick={() => navigate(`/developer/${key}`)}
              className="fade-in-right flex justify-center items-center p-4 border-2 border-gray-300 rounded-full overflow-hidden transition-colors duration-300 hover:bg-slate-400"
            >
              <img
                src={developer.logo}
                alt={developer.name}
                className="w-30 h-30 object-contain rounded-full"
              />
            </button>
          );
        })}
      </div>
      <section className="text-center mt-10">
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
}
