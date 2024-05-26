import React from "react";
import houses from "../assets/3.png";
import HeroBtn from "../components/HeroBtn";
import { RiSearchLine } from "react-icons/ri";
import About from "./About";
import CommunitiesAndProjects from "../components/Projects";
import DevelopersAndTeam from '../components/Developer'
import Footer from "../components/Footer";
const Home = () => {
  const buttons = [
    { title: "Buy" },
    { title: "Rent" },
    { title: "Commercial" },
    { title: "New Projects" },
  ];
  return (
    <>
    <div className="h-screen relative">
      <div className="absolute inset-0">
        <img
          src={houses}
          className="object-cover w-full h-full fade-in-bottom"
          alt="City Houses"
        />
      </div>
      {/* <Header /> */}
      <div className="relative z-10 flex flex-col items-center w-full pt-12">
        <h2 className="font-bold text-xl sm:text-xl flex flex-wrap">
          <span className="text-slate-950 mt-32">AGCO Properties</span>
        </h2>
        <ul className="">
          <div className="pt-8 flex flex-col sm:flex-row sm:space-x-2">
            {buttons.map((button, index) => (
              <HeroBtn
                key={index}
                title={button.title}
                underline={button.underline}
              />
            ))}
          </div>
        </ul>
        <div className="relative mt-9">
          <input
            type="search"
            placeholder="Area, Communicty, Building, Project"
            className="bg-white py-4 w-full sm:w-[37rem] rounded-full pl-5 placeholder:text-gray-500 placeholder:text-[20px] outline-0"
          />
          <div className="absolute w-[2.7rem] h-[2.7rem] rounded-full bg-[#e20112] top-[0.4rem] right-1 flex items-center justify-center">
            <RiSearchLine className="text-white text-[22px]" />
          </div>
        </div>
      </div>
    </div>
      <About />
      <CommunitiesAndProjects />   
      <DevelopersAndTeam />  
      <Footer />   
      </>
  );
};

export default Home;
