import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoMenu, IoClose } from "react-icons/io5";
import logo from "../../assets/new_logo.webp";
import "./Header.css";
import Modal from "./Modal";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarDropdownOpen, setSidebarDropdownOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [listModalOpen, setListModalOpen] = useState(false);

  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleDropdown = (event) => {
    event.preventDefault();
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebarDropdown = (event) => {
    event.preventDefault();
    setSidebarDropdownOpen(!sidebarDropdownOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const openContactModal = () => {
    setContactModalOpen(true);
  };

  const closeContactModal = () => {
    setContactModalOpen(false);
  };

  const openListModal = () => {
    setListModalOpen(true);
  };

  const closeListModal = () => {
    setListModalOpen(false);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const closeSidebarDropdown = () => {
    setSidebarDropdownOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-opacity-30 bg-gray-200 backdrop-blur-lg z-20">
        <div className="flex justify-between items-center max-w-8xl mx-auto p-1">
          <Link to="/">
            <img
              src={logo}
              alt="AGCO LOGO"
              className="max-w-32 sm:max-w-42 fade-in-bottom"
            />
          </Link>

          <ul className="hidden sm:flex gap-7 fade-in-right font-bold text-center justify-center">
            <li className={`p-2 rounded ${isActive("/buy")}`}>
              <Link
                to="/buy"
                className="block text-slate-800 hover-underline-animation"
              >
                Buy
              </Link>
            </li>
            <li className={`p-2 rounded ${isActive("/rent")}`}>
              <Link
                to="/rent"
                className="block text-slate-800 hover-underline-animation"
              >
                Rent
              </Link>
            </li>
            <li className={`p-2 rounded ${isActive("/commercial")}`}>
              <Link
                to="/commercial"
                className="block text-slate-800 hover-underline-animation"
              >
                Commercial
              </Link>
            </li>
         
            <li className={`p-2 rounded ${isActive("/developer")}`}>
              <Link
                to="/developer"
                className="block text-slate-800 hover-underline-animation"
              >
                Developer
              </Link>
            </li>
            <li className={`p-2 rounded ${isActive("/new-projects")}`}>
              <Link
                to="/new-projects"
                className="block text-slate-800 hover-underline-animation"
              >
                New Projects
              </Link>
            </li>
            <li className={`p-2 rounded ${isActive("/services")}`}>
              <Link
                to="/services"
                className="block text-slate-800 hover-underline-animation"
              >
                Services
              </Link>
            </li>
            <li className={`p-2 rounded relative ${isActive("/")}`}>
              <button
                onClick={toggleDropdown}
                className="block text-slate-800 hover-underline-animation"
              >
                About Us
              </button>
              {dropdownOpen && (
                <ul className="absolute fade-in-bottom left-0 mt-2 w-44 bg-white shadow-lg rounded transition-all duration-300 ease-in-out transform">
                  <li className="p-2 w-full hover-underline-animation">
                    <Link to="/our-properties" onClick={closeDropdown}>
                      Our Properties
                    </Link>
                  </li>
                  <li className="p-2 w-full hover-underline-animation">
                    <Link to="/overview" onClick={closeDropdown}>
                      Overview
                    </Link>
                  </li>
                  <li className="p-2 w-full hover-underline-animation">
                    <Link to="/why-dubai" onClick={closeDropdown}>
                      Why Dubai?
                    </Link>
                  </li>
                  <li className="p-2 w-full hover-underline-animation">
                    <Link to="/blogs" onClick={closeDropdown}>
                      Blogs
                    </Link>
                  </li>
                  <li className="p-2 w-full hover-underline-animation">
                    <Link to="/agents" onClick={closeDropdown}>
                      Our Agents
                    </Link>
                  </li>
                  <li className="p-2 w-full hover-underline-animation">
                    <Link to="/our-team" onClick={closeDropdown}>
                      Team Members
                    </Link>
                  </li>
                  <li className="p-2 w-full hover-underline-animation">
                    <Link to="/our-team" onClick={closeDropdown}>
                      Our Team
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>

          <div className="flex gap-2 w-60">
            <button
              onClick={openContactModal}
              className="relative fade-in-bottom font-bold px-3 py-1.5 sm:px-6 sm:py-2 rounded-3xl text-slate-800 isolation-auto z-10 border-2 border-red-600 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full hover:border-black before:bg-red-600 before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700"
            >
              Contact AGCO
            </button>
            <Link to="/list-your-property">
              <button
                className="fade-in-bottom relative font-bold px-3 py-1.5 sm:px-6 sm:py-2 rounded-3xl text-slate-800 isolation-auto z-10 border-2 border-black before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full hover:border-red-600 before:bg-red-600 before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700"
              >
                List Your Property
              </button>
            </Link>
          </div>

          <button
            onClick={toggleMenu}
            className="sm:hidden text-slate-900"
            aria-label="Toggle Menu"
          >
            <IoMenu />
          </button>
        </div>
      </header>

      <div className={`sidebar ${menuOpen ? "active" : ""}`}>
        <button
          onClick={closeMenu}
          className="close-button text-slate-100"
          aria-label="Close Menu"
        >
          <IoClose />
        </button>
        <ul className="sidebar-list text-slate-100">
          <li className={`sidebar-item ${isActive("/buy")}`}>
            <Link to="/buy" onClick={closeMenu}>
              <button className="hover-underline-animation">Buy</button>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/rent")}`}>
            <Link to="/rent" onClick={closeMenu}>
              <button className="hover-underline-animation">Rent</button>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/commercial")}`}>
            <Link to="/commercial" onClick={closeMenu}>
              <button className="hover-underline-animation">Commercial</button>
            </Link>
          </li>
         
          <li className={`sidebar-item ${isActive("/developer")}`}>
            <Link to="/developer" onClick={closeMenu}>
              <button className="hover-underline-animation">Developer</button>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/new-projects")}`}>
            <Link to="/new-projects" onClick={closeMenu}>
              <button className="hover-underline-animation">
                New Projects
              </button>
            </Link>
          </li>
          <li className={`sidebar-item ${isActive("/services")}`}>
            <Link to="/services" onClick={closeMenu}>
              <button className="hover-underline-animation">Services</button>
            </Link>
          </li>
          <li className={`sidebar-item relative ${isActive("/")}`}>
            <button
              onClick={toggleSidebarDropdown}
              className="hover-underline-animation"
            >
              About Us
            </button>
            {sidebarDropdownOpen && (
              <ul className="fade-in-right mt-2 pl-4 sidebar-item">
                <li className="p-2 hover-underline-animation">
                  <Link to="/our-properties" onClick={closeMenu}>
                    Our Properties
                  </Link>
                </li>
                <li className="p-2 hover-underline-animation">
                  <Link to="/overview" onClick={closeMenu}>
                    Overview
                  </Link>
                </li>
                <li className="p-2 hover-underline-animation">
                  <Link to="/why-dubai" onClick={closeMenu}>
                    Why Dubai?
                  </Link>
                </li>
                <li className="p-2 hover-underline-animation">
                  <Link to="/blogs" onClick={closeMenu}>
                    Blogs
                  </Link>
                </li>
                <li className="p-2 hover-underline-animation">
                  <Link to="/agents/" onClick={closeMenu}>
                    Our Agents
                  </Link>
                </li>
                <li className="p-2 hover-underline-animation">
                  <Link to="/our-team/" onClick={closeMenu}>
                    Team Members
                  </Link>
                </li>
                <li className="p-2 hover-underline-animation">
                  <Link to="/join-us/" onClick={closeMenu}>
                    Join Us
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
        
      </div>

      {contactModalOpen && (
        <Modal
          title="Contact AGCO"
          closeModal={closeContactModal}
          formFields={["Name", "Email", "Message"]}
        />
      )}
    </>
  );
}
