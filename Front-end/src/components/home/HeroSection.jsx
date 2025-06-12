import React, { useState } from 'react';
import { FaSearch, FaHandHolding, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const HeroSection = () => {
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const categories = [
    'Electronics',
    'Documents',
    'Wallets & Purses',
    'Keys',
    'Bags & Backpacks',
    'Accessories',
    'Books',
    'Other',
  ];

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/listings/all?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
      <section className={`relative py-20 ${
        isDarkMode 
          ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
          : 'bg-gradient-to-b from-[#F8F9FA] to-white'
      }`}>
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#FFBE0B]/10 blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-[#F35B04]/10 blur-3xl"></div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <motion.div
                className="lg:w-1/2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className={isDarkMode ? 'text-white' : 'text-[#212529]'}>Find What You've </span>
                <span className="text-[#F35B04]">Lost</span>
                <span className={isDarkMode ? 'text-white' : 'text-[#212529]'}>, Return What You've </span>
                <span className="text-[#3D348B]">Found</span>
              </h1>

              <p className={`text-xl mb-8 max-w-lg ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                A community-driven lost and found platform bringing the Dodoma community together.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                    className="inline-flex items-center px-6 py-3 rounded-full bg-[#F35B04] text-white text-lg font-medium shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/report-lost')}
                >
                  <FaSearch className="mr-2" />
                  I Lost Something
                </motion.button>

                <motion.button
                    className="inline-flex items-center px-6 py-3 rounded-full bg-[#3D348B] text-white text-lg font-medium shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/report-found')}
                >
                  <FaHandHolding className="mr-2" />
                  I Found Something
                </motion.button>
              </div>
            </motion.div>

            {/* Right Search Box */}
            <motion.div
                className="lg:w-1/2 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={`rounded-3xl p-6 shadow-lg transition-all duration-300 ${
                searchFocus ? 'shadow-2xl' : ''
              } ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h2 className={`text-2xl font-bold mb-6 flex items-center ${
                  isDarkMode ? 'text-white' : 'text-[#212529]'
                }`}>
                  <FaMapMarkerAlt className="text-[#F35B04] mr-2" />
                  Find Lost & Found Items
                </h2>

                <div className="relative mb-6">
                  <input
                      type="text"
                      placeholder="What are you looking for?"
                      className={`w-full px-5 py-4 rounded-full border-2 border-transparent focus:border-[#F35B04] focus:outline-none transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 text-white placeholder-gray-400' 
                          : 'bg-[#F8F9FA] text-[#212529] placeholder-gray-400'
                      }`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setSearchFocus(true)}
                      onBlur={() => setSearchFocus(false)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                      className="absolute right-4 top-4 text-[#F35B04] hover:text-[#d95203] transition-colors"
                      onClick={handleSearch}
                  >
                    <FaSearch className="text-xl" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((item, index) => (
                      <motion.span
                          key={item}
                          className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-colors ${
                            isDarkMode
                              ? 'bg-gray-700 text-gray-300 hover:text-[#F35B04]'
                              : 'bg-[#F8F9FA] text-gray-600 hover:text-[#F35B04]'
                          }`}
                          whileHover={{ scale: 1.05, backgroundColor: isDarkMode ? '#374151' : '#FFBE0B20' }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                          onClick={() =>
                              item === 'Other'
                                  ? navigate('/categories')
                                  : navigate(`/listings/all?category=${encodeURIComponent(item)}`)
                          }
                      >
                        {item}
                      </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
  );
};

export default HeroSection;