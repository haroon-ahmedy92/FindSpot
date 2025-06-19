import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearchLocation, FaBars, FaTimes } from 'react-icons/fa';
import ThemeToggle from '../ui/ThemeToggle';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Items', path: '/listings/all' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled 
          ? `${isDarkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-xl border-b ${isDarkMode ? 'border-gray-700/20' : 'border-gray-200/20'} shadow-sm` 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group" onClick={closeMobileMenu}>
            <div className="relative">
              <FaSearchLocation 
                className={`w-7 h-7 transition-all duration-300 ${
                  scrolled ? 'text-[#F35B04]' : 'text-[#F35B04]'
                } group-hover:scale-110`} 
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F35B04] to-[#FFBE0B] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
            </div>
            <span 
              className={`font-bold text-2xl tracking-tight transition-all duration-300 ${
                scrolled ? (isDarkMode ? 'text-white' : 'text-gray-900') : (isDarkMode ? 'text-white' : 'text-gray-900')
              }`}
            >
              FindSpot
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  isDarkMode ? 'hover:bg-gray-800/80' : 'hover:bg-gray-100/80'
                } hover:backdrop-blur-sm ${
                  scrolled ? (isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900') : (isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900')
                }`}
                onClick={closeMobileMenu}
              >
                {link.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#F35B04] to-[#FFBE0B] transform scale-x-0 origin-left transition-transform duration-300 hover:scale-x-100"></span>
              </Link>
            ))}
          </nav>

          {/* Auth Buttons and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            <Link
              to="/login"
              className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${
                scrolled 
                  ? (isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800/80' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80')
                  : (isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800/80' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80')
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#F35B04] to-[#FFBE0B] rounded-full transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-500/25 relative overflow-hidden group"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFBE0B] to-[#F35B04] transform scale-x-0 origin-right transition-transform duration-300 group-hover:scale-x-100"></div>
            </Link>
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button 
              className={`p-2 rounded-full transition-all duration-200 ${
                isDarkMode ? 'hover:bg-gray-800/80' : 'hover:bg-gray-100/80'
              } active:scale-95`}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-0' : ''}`}>
                  {isMobileMenuOpen ? (
                    <FaTimes className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                  ) : (
                    <FaBars className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                  )}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className={`${isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl border-t ${isDarkMode ? 'border-gray-700/20' : 'border-gray-200/20'} shadow-lg`}>
          <nav className="px-6 py-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={`mobile-${link.path}`}
                to={link.path}
                className={`block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 active:scale-95 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-800/80 hover:text-white' 
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
                onClick={closeMobileMenu}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile Auth Buttons */}
            <div className={`pt-4 space-y-3 border-t ${isDarkMode ? 'border-gray-700/30' : 'border-gray-200/30'}`}>
              <Link
                to="/login"
                className={`block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 active:scale-95 ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-800/80 hover:text-white' 
                    : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block px-4 py-3 text-base font-medium text-white bg-gradient-to-r from-[#F35B04] to-[#FFBE0B] rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-center"
                onClick={closeMobileMenu}
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;


