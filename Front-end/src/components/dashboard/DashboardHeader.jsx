import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaSearchLocation, FaBars, FaTimes } from 'react-icons/fa';
import Notifications from './Notifications';
import ProfileMenu from './ProfileMenu';

const DashboardHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { to: "/dashboard", text: "Dashboard", end: true },
    { to: "/dashboard/browse", text: "Browse Items" },
    { to: "/dashboard/report-lost", text: "Report Lost" },
    { to: "/dashboard/report-found", text: "Report Found" },
    { to: "/dashboard/my-posts", text: "My Posts" },
  ];

  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <FaSearchLocation className="w-6 h-6 text-[#F35B04] group-hover:scale-105 transition-transform" />
            <span className="font-bold text-xl text-gray-800 group-hover:text-gray-900 transition-colors">
              FindSpot
            </span>
          </Link>

          {/* Desktop Navigation Links - Centered */}
          <nav className="hidden md:flex flex-1 justify-center items-center space-x-4 lg:space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
                  }`
                }
                onClick={() => isMobileMenuOpen && toggleMobileMenu()} // Close mobile menu on link click
              >
                {link.text}
              </NavLink>
            ))}
          </nav>

          {/* Actions - Kept for desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <Notifications />
            <ProfileMenu />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Notifications /> {/* Show notifications icon on mobile too before hamburger */}
            <ProfileMenu /> {/* Show profile menu icon on mobile too before hamburger */}
            <button
              onClick={toggleMobileMenu}
              className="ml-2 p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={`mobile-${link.to}`}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                onClick={toggleMobileMenu} // Close mobile menu on link click
              >
                {link.text}
              </NavLink>
            ))}
          </nav>
          {/* Mobile Actions can be added here if needed, or rely on the ones next to hamburger */}
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
