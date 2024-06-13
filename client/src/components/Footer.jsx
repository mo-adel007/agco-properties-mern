// src/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white p-8 mt-20">
      <div className="container mx-auto">
        <div className="md:flex justify-between items-start">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl mb-2">Sell Your Property</h2>
            <p className="mb-4">Provide us with your property information and we will call you!</p>
            <button className="bg-yellow-500 hover:bg-red-600 text-black px-4 py-2">Sell Now</button>
          </div>
          <div className="max-w-md w-full">
            <h3 className="text-xl mb-4">Get in touch with us</h3>
            <form>
              <input 
                type="text" 
                name="name" 
                placeholder="Name" 
                className="w-full p-2 mb-4 border border-gray-300" 
                required 
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                className="w-full p-2 mb-4 border border-gray-300" 
                required 
              />
              <input 
                type="tel" 
                name="phone" 
                placeholder="Phone Number" 
                className="w-full p-2 mb-4 border border-gray-300" 
                required 
              />
              <textarea 
                name="message" 
                placeholder="Message" 
                className="w-full p-2 mb-4 border border-gray-300" 
                required 
              ></textarea>
              <div className="flex items-center mb-4">
                <input type="checkbox" id="not-robot" className="mr-2" required />
                <label htmlFor="not-robot">I'm not a robot</label>
              </div>
              <button type="submit" className="bg-red-700 text-white px-4 py-2 w-full">Submit</button>
            </form>
          </div>
        </div>
        <div className="mt-8 flex justify-between items-center">
          <div className="flex space-x-4">
            <a href="#" className="text-white text-xl hover:text-red-600"><i className="fab fa-facebook"></i></a>
            <a href="#" className="text-white text-xl hover:text-red-600"><i className="fab fa-instagram"></i></a>
            <a href="#" className="text-white text-xl hover:text-red-600"><i className="fab fa-linkedin"></i></a>
            <a href="#" className="text-white text-xl hover:text-red-600"><i className="fab fa-tiktok"></i></a>
            <a href="#" className="text-white text-xl hover:text-red-600"><i className="fab fa-youtube"></i></a>
          </div>
          <div className="flex space-x-4">
            <a href="https://wa.me/1234567890" className="text-white text-xl hover:text-red-600"><i className="fab fa-whatsapp"></i></a>
            <a href="tel:+1234567890" className="text-white text-xl hover:text-red-600"><i className="fas fa-phone"></i></a>
            <a href="#" className="text-white text-xl hover:text-red-600"><i className="fas fa-comment"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
