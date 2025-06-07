import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearchLocation, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Report Lost', path: '/report-lost' },
    { name: 'Report Found', path: '/report-found' },
    { name: 'My Items', path: '/my-items' },
    { name: 'About', path: '/about' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center mr-4">
            <FaSearchLocation className={`w-6 h-6 mr-2 ${scrolled ? 'text-[#F35B04]' : 'text-[#F35B04]'}`} />
            <span className={`font-bold text-xl ${scrolled ? 'text-[#212529]' : 'text-[#212529]'}`}>FindSpot</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
                <Link
                    key={link.path}
                    to={link.path}
                    className={`font-medium transition-all duration-300 relative hover:text-[#F35B04] ${
                        scrolled ? 'text-[#212529]' : 'text-[#212529]'
                    }`}
                    onClick={closeMobileMenu}
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F35B04] transition-all duration-300 group-hover:w-full"></span>
                </Link>
            ))}
          </nav>

          {/* Right Side: Authentication Links */}
          <div className="flex items-center space-x-3">
            <Link
                to="/login"
                className={`px-4 py-2 rounded-full border-2 font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md ${
                    scrolled
                        ? 'border-[#F35B04] text-[#F35B04] hover:bg-[#F35B04] hover:text-white'
                        : 'border-[#F35B04] text-[#F35B04] hover:bg-[#F35B04] hover:text-white'
                }`}
            >
              Login
            </Link>
            <Link
                to="/register"
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                    scrolled ? 'bg-[#F35B04] text-white hover:bg-[#d95203]' : 'bg-[#F35B04] text-white hover:bg-[#d95203]'
                }`}
            >
              Register
            </Link>

            {/* Mobile Menu Button */}
            <button className="md:hidden ml-4 text-[#212529]" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="md:hidden bg-white shadow-lg rounded-b-2xl overflow-hidden animate-slideDown">
              <nav className="flex flex-col p-4 space-y-3">
                {navLinks.map((link) => (
                    <Link
                        key={`mobile-${link.path}`}
                        to={link.path}
                        className="text-[#212529] hover:text-[#F35B04] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                        onClick={closeMobileMenu}
                    >
                      {link.name}
                    </Link>
                ))}
                <Link
                    to="/login"
                    className="text-[#212529] hover:text-[#F35B04] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                    to="/register"
                    className="text-[#212529] hover:text-[#F35B04] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </nav>
            </div>
        )}
      </header>
  );
};

export default Header;


