import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaSearchLocation, FaBars, FaTimes } from 'react-icons/fa';
import Notifications from './Notifications';
import ProfileMenu from './ProfileMenu';
import ThemeToggle from '../ui/ThemeToggle';
import { useTheme } from '../../contexts/ThemeContext';

const DashboardHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode } = useTheme();

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
    <header className={`glass-effect sticky top-0 z-50 border-b shadow-sm ${
      isDarkMode 
        ? 'border-gray-700 bg-gray-900/90 backdrop-blur-xl' 
        : 'border-gray-200 bg-white/90 backdrop-blur-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <FaSearchLocation className="w-6 h-6 text-[#F35B04] group-hover:scale-105 transition-transform" />
            <span className={`font-bold text-xl group-hover:text-gray-900 transition-colors ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
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
                    isActive 
                      ? (isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-50 text-blue-600')
                      : (isDarkMode ? 'text-gray-300 hover:text-blue-400 hover:bg-blue-900/30' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50')
                  }`
                }
                onClick={() => isMobileMenuOpen && toggleMobileMenu()}
              >
                {link.text}
              </NavLink>
            ))}
          </nav>

          {/* Actions - Kept for desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            <Notifications />
            <ProfileMenu />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle className="mr-2" />
            <Notifications />
            <ProfileMenu />
            <button
              onClick={toggleMobileMenu}
              className={`ml-2 p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
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
        <div className={`md:hidden border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={`mobile-${link.to}`}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? (isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700')
                      : (isDarkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900')
                  }`
                }
                onClick={toggleMobileMenu}
              >
                {link.text}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
