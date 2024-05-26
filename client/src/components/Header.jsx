import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoMenu, IoClose } from "react-icons/io5"; // Import IoClose icon
import logo from "../assets/new_logo.webp";
import "./Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarDropdownOpen, setSidebarDropdownOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebarDropdown = () => {
    setSidebarDropdownOpen(!sidebarDropdownOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? "bg-red-600" : "text-slate-800";
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-opacity-30 bg-gray-200 backdrop-blur-lg z-20">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-1">
          <Link to="/">
            <img
              src={logo}
              alt="AGCO LOGO"
              className="max-w-32 sm:max-w-42 fade-in-bottom"
            />
          </Link>

          {/* Menu Button */}
          <button
            onClick={toggleMenu}
            className="sm:hidden text-slate-900"
            aria-label="Toggle Menu"
          >
            <IoMenu />
          </button>

          {/* List Items */}
          <ul className="hidden sm:flex gap-6 fade-in-right font-bold text-center justify-center">
            <li className={`p-2 rounded relative ${isActive("/")}`}>
              <button onClick={toggleDropdown} className="block text-slate-800">
                Home
              </button>
              {dropdownOpen && (
                <ul className="absolute fade-in-bottom left-0 mt-2 w-48 bg-white shadow-lg rounded transition-all duration-300 ease-in-out transform">
                  <li className="p-2 hover:bg-red-600">
                    <Link to="/our-properties">Our Properties</Link>
                  </li>
                  <li className="p-2 hover:bg-red-600">
                    <Link to="/overview">Overview</Link>
                  </li>
                  <li className="p-2 hover:bg-red-600">
                    <Link to="/why-dubai">Why Dubai?</Link>
                  </li>
                  <li className="p-2 hover:bg-red-600">
                    <Link to="/blogs">Blogs</Link>
                  </li>
                  <li className="p-2 hover:bg-red-600">
                    <Link to="/agents">Agents</Link>
                  </li>
                  <li className="p-2 hover:bg-red-600">
                    <Link to="/our-team">Our Team</Link>
                  </li>
                  <li className="p-2 hover:bg-red-600">
                    <Link to="/join-us">Join Us</Link>
                  </li>
                  {/* <li className="p-2 relative hover:bg-red-600">
                    <button className="block w-full text-left" onClick={() => setDropdownOpen(!dropdownOpen)}>Our Team</button>
                    {dropdownOpen && (
                      <ul className="mt-2 pl-4 transition-all duration-300 ease-in-out transform">
                   
                      </ul>
                    )}
                  </li> */}
                </ul>
              )}
            </li>
            <li
              className={`p-2 rounded hover:bg-red-600 ${isActive(
                "/developer"
              )}`}
            >
              <Link to="/developer" className="block ">
                Developer
              </Link>
            </li>
            <li
              className={`p-2 rounded hover:bg-red-600 ${isActive(
                "/new-projects"
              )}`}
            >
              <Link to="/new-projects" className="block ">
                New Projects
              </Link>
            </li>
            <li
              className={`p-2 rounded hover:bg-red-600 ${isActive(
                "/services"
              )}`}
            >
              <Link to="/services" className="block ">
                Services
              </Link>
            </li>
            <li
              className={`p-2 rounded hover:bg-red-600 ${isActive("/contact")}`}
            >
              <Link to="/contact" className="block ">
                Contact-AGCO
              </Link>
            </li>
          </ul>
        </div>
      </header>

      {/* Sidebar */}
    
      <div className={`sidebar ${menuOpen ? "active" : ""}`}>
        <button
          onClick={closeMenu}
          className="close-button text-slate-100"
          aria-label="Close Menu"
        >
          <IoClose />
        </button>
        <ul className="sidebar-list">
          <li
            className={`sidebar-item hover:bg-red-600 relative ${isActive(
              "/"
            )}`}
          >
            <button
              onClick={toggleSidebarDropdown}
              className="hover:bg-red-600"
            >
              Home
            </button>
            {sidebarDropdownOpen && (
              <ul className="mt-2 fade-in-bottom pl-4 transition-all duration-300 ease-in-out transform w-44  shadow-lg rounded">
                <li className="p-2  hover:bg-red-600">
                  <Link to="/our-properties" onClick={closeMenu}>
                    Our Properties
                  </Link>
                </li>
                <li className="p-2  hover:bg-red-600">
                  <Link to="/overview" onClick={closeMenu}>
                    Overview
                  </Link>
                </li>
                <li className="p-2 hover:bg-red-600">
                  <Link to="/why-dubai" onClick={closeMenu}>
                    Why Dubai?
                  </Link>
                </li>
                <li className="p-2 hover:bg-red-600">
                  <Link to="/blogs" onClick={closeMenu}>
                    Blogs
                  </Link>
                </li>
                <li className="p-2 relative">
                  <p
                    className="block w-full text-left"
                    onClick={() => setSidebarDropdownOpen(!sidebarDropdownOpen)}
                  >
                    Our Team
                  </p>
                  {sidebarDropdownOpen && (
                    <ul className="mt-2 pl-4 transition-all duration-300 ease-in-out transform">
                      <button>
                      <li className="p-2 hover:bg-red-600">
                        <Link to="/agents" onClick={closeMenu}>
                          Agents
                        </Link>
                      </li>
                      </button>
                      <button>
                      <li className="p-2 hover:bg-red-600">
                        <Link to="/our-team" onClick={closeMenu}>
                          Our Team
                        </Link>
                      </li>
                      </button>
                      <button>
                      <li className="p-2 hover:bg-red-600">
                        <Link to="/join-us" onClick={closeMenu}>
                          Join Us
                        </Link>
                      </li>
                      </button>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>
          <li className={`sidebar-item ${isActive("/developer")}`}>
            <Link
              to="/developer"
              className="block text-slate-950"
              onClick={closeMenu}
            >
              Developer
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/new-projects")}`}>
            <Link
              to="/new-projects"
              className="block text-slate-950"
              onClick={closeMenu}
            >
              New Projects
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/services")}`}>
            <Link
              to="/services"
              className="block text-slate-800"
              onClick={closeMenu}
            >
              Services
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/contact")}`}>
            <Link
              to="/contact"
              className="block text-slate-950"
              onClick={closeMenu}
            >
              Contact-AGCO
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
