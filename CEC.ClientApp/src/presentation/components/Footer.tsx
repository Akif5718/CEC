import React from 'react';
import logo from '../assets/data/brand-logo.png';
// import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  // const navigate = useNavigate();

  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          {/* First Part: Logo and Company Name */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-start mb-6 md:mb-0">
            <div className="text-center">
              <div className="text-2xl font-bold">
                <img
                  src={logo}
                  alt="Brand Logo"
                  className="h-16 w-16 mx-auto"
                />
              </div>
              <div className="mt-2 text-lg">Care Edu Compass</div>
            </div>
          </div>

          {/* Second Part: Navigation */}
          <div className="w-full md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
            <nav className="text-left">
              <div className="text-lg font-bold">Navigation</div>
              <button
                // onClick={() => navigate('/')}
                className="block text-gray-300 hover:text-white mt-2"
              >
                Home
              </button>
              <button
                // onClick={() => navigate('/user-management')}
                className="block text-gray-300 hover:text-white mt-2"
              >
                User Management
              </button>
              <button
                // onClick={() => navigate('/search-in-map')}
                className="block text-gray-300 hover:text-white mt-2"
              >
                Search In Map
              </button>
            </nav>
          </div>

          {/* Third Part: Contact Us */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-end mb-6 md:mb-0">
            <div className="text-center md:text-right">
              <div className="text-lg font-bold">Contact Us</div>
              <div className="mt-2 text-gray-400">
                Straße der Nationen 62, 09111 Chemnitz
              </div>
              <div className="text-gray-400">Phone: +491739806246</div>
              <div className="text-gray-400">
                Email: akif.ahmed5718@gmail.com
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Line */}
        <hr className="my-8 border-gray-600" />

        {/* Disclaimer */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Disclaimer: This website does not belong to a real company. It is a
            Data banken Web Engineering project at Technische Universität
            Chemnitz, Germany.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
