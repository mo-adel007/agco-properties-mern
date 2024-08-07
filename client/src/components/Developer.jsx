import React from "react";
import { useNavigate } from "react-router-dom";
import { developersData } from '../components/DeveloperData';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Core Swiper styles
import 'swiper/css/navigation'; // Navigation module styles
import 'swiper/css/autoplay'; // Autoplay module styles
import { Navigation, Autoplay } from 'swiper/modules'; // Import modules from swiper/modules
import team1 from '../assets/OIP.jpg';

const team = [
  { name: 'Member 1', img: team1 },
  { name: 'Member 2', img: team1 },
  { name: 'Member 3', img: team1 },
  { name: 'Member 4', img: team1 },
  { name: 'Member 5', img: team1 },
  { name: 'Member 6', img: team1 },
  { name: 'Member 7', img: team1 },
  { name: 'Member 8', img: team1 },

];

export default function Developer() {
  const navigate = useNavigate();

  return (
    <div className="py-8 mt-20 text-center">
      <h2 className="text-3xl font-bold text-center mb-8 bg-red-600 text-white inline-block px-4 py-2 rounded">Our Developers</h2>

      {/* Developers Carousel */}
      <Swiper
        modules={[Navigation, Autoplay]} // Use the correct modules array
        slidesPerView={5} // Number of slides visible at a time
        spaceBetween={20} // Space between slides
        navigation // Enables navigation arrows
        autoplay={{ delay: 1000, disableOnInteraction: false }} // Auto-slide every 3 seconds and continue after interaction
        loop // Enables looping of slides
        className="w-full" // Full width of the page
      >
        {Object.keys(developersData).map((key) => {
          const developer = developersData[key];
          return (
            <SwiperSlide key={developer.name}>
              <button
                onClick={() => navigate(`/developer/${key}`)}
                className="flex justify-center items-center p-4 border-2 border-gray-300 rounded-full overflow-hidden transition-colors duration-300 hover:bg-slate-400"
              >
                <img
                  src={developer.logo}
                  alt={developer.name}
                  className="w-30 h-30 object-contain rounded-full"
                />
              </button>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <section className="text-center mt-10">
        <h2 className="text-3xl font-bold text-center mb-8 bg-red-600 text-white inline-block px-4 py-2 rounded">Our Team</h2>
        
        {/* Team Carousel */}
        <Swiper
         modules={[Navigation, Autoplay]} // Use the correct modules array
         slidesPerView={5} // Number of slides visible at a time
         spaceBetween={5} // Space between slides
         navigation // Enables navigation arrows
         autoplay={{ delay: 1000, disableOnInteraction: false }} // Auto-slide every 3 seconds and continue after interaction
         loop // Enables looping of slides
         className="w-full" // F
        >
          {team.map((member, index) => (
            <SwiperSlide key={index}>
              <div className="p-2 flex flex-col items-center">
                <img src={member.img} alt={member.name} className="h-32 w-32 rounded-full mb-4" />
                <p className="text-sm text-center">{member.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
}
