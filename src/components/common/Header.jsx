import { useState } from "react";
import { FaSearchLocation, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", target: "home" },
    { name: "Report Lost", target: "report-lost" },
    { name: "Report Found", target: "report-found" },
    { name: "My Items", target: "my-items" },
    { name: "About", target: "about" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#404040] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between">
        {/* Center: Logo and Navigation */}
        <div className="flex-1 flex items-center justify-start">
          {/* Logo */}
          <div className="flex items-center mr-4">
            <FaSearchLocation className="text-white w-4 h-4 mr-2" />
            <span className="text-white font-bold text-xs">FindSpot</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <a
                key={link.target}
                href={`#${link.target}`}
                className="text-white hover:bg-white/10 px-2 py-1 rounded transition-colors text-xs"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Side: Authentication Buttons */}
        <div className="flex items-center">
          <button className="mx-1 px-2 py-1 rounded border border-white text-white hover:bg-white/10 transition-colors text-xs">
            Login
          </button>
          <button className="mx-1 px-2 py-1 rounded bg-white text-gray-800 hover:bg-gray-100 transition-colors text-xs">
            Register
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden ml-4 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {/* Horizontal Line */}
      <div className="w-full border-t border-white/20" />

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 pb-2 px-4">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={`mobile-${link.target}`}
                href={`#${link.target}`}
                className="text-white hover:bg-white/10 px-2 py-1 rounded transition-colors text-xs"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;