import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ItemCard from '../ui/ItemCard';
import ItemService from '../../api/itemService';
import { FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa';

const RecentListings = () => {
  const [activeTab, setActiveTab] = useState('lost-items');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();

  // Fetch items when tab changes or component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchRecentItems();
    }
  }, [activeTab, isAuthenticated]);

  const fetchRecentItems = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = {
        page: 0,
        limit: 3 // Only fetch 3 recent items for homepage
      };

      let response;
      if (activeTab === 'lost-items') {
        response = await ItemService.getLostItems(params);
        // Tag all items as lost type
        response.content = response.content?.map(item => ({
          ...item,
          itemType: 'lost'
        })) || [];
      } else {
        response = await ItemService.getFoundItems(params);
        // Tag all items as found type
        response.content = response.content?.map(item => ({
          ...item,
          itemType: 'found'
        })) || [];
      }

      setItems(response.content || []);
    } catch (fetchError) {
      setError('Failed to fetch recent items');
      console.error('Error fetching recent items:', fetchError);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <section className={`py-20 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.h2
            className={`text-3xl md:text-4xl font-bold mb-4 md:mb-0 ${
              isDarkMode ? 'text-white' : 'text-[#212529]'
            }`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Recent <span className="text-[#F35B04]">Listings</span>
          </motion.h2>

          <motion.div
            className={`flex p-1 rounded-full ${
              isDarkMode ? 'bg-gray-800' : 'bg-[#F8F9FA]'
            }`}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'lost-items'
                  ? 'bg-[#F35B04] text-white shadow-md'
                  : isDarkMode 
                    ? 'text-gray-300 hover:text-[#F35B04]' 
                    : 'text-gray-600 hover:text-[#F35B04]'
              }`}
              onClick={() => handleTabClick('lost-items')}
            >
              Lost Items
            </button>
            <button
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'found-items'
                  ? 'bg-[#00AFB9] text-white shadow-md'
                  : isDarkMode 
                    ? 'text-gray-300 hover:text-[#00AFB9]' 
                    : 'text-gray-600 hover:text-[#00AFB9]'
              }`}
              onClick={() => handleTabClick('found-items')}
            >
              Found Items
            </button>
          </motion.div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`p-4 rounded-lg mb-6 border text-center ${
            isDarkMode 
              ? 'bg-red-900/30 text-red-300 border-red-600/30' 
              : 'bg-red-100 text-red-700 border-red-200'
          }`}>
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-3xl text-[#F35B04]" />
            <span className={`ml-3 text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Loading recent items...</span>
          </div>
        )}

        {/* Items Grid */}
        {!loading && (
          <>
            {isAuthenticated ? (
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {items.map((itemData) => (
                  <motion.div key={itemData.id} variants={item}>
                    <ItemCard item={itemData} />
                  </motion.div>
                ))}
                {items.length === 0 && !loading && (
                  <div className="col-span-full text-center py-10">
                    <p className={`text-xl mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-[#212529]/60'
                    }`}>No recent {activeTab === 'lost-items' ? 'lost' : 'found'} items</p>
                    <p className={`${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Be the first to report a {activeTab === 'lost-items' ? 'lost' : 'found'} item!
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className={`text-xl mb-4 ${
                  isDarkMode ? 'text-white' : 'text-[#212529]'
                }`}>Log in to view recent listings</p>
                <p className={`mb-6 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Join our community to see the latest lost and found items</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-[#F35B04] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#d95203] transition-colors"
                >
                  Log In
                </button>
              </div>
            )}
          </>
        )}

        {/* View All Button */}
        {!loading && isAuthenticated && items.length > 0 && (
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => navigate('/listings/all')}
              className={`flex items-center px-6 py-3 border-2 border-[#F35B04] text-[#F35B04] rounded-full font-medium hover:bg-[#F35B04] hover:text-white transition-all duration-300 ${
                isDarkMode ? 'bg-gray-900 hover:bg-[#F35B04]' : 'bg-white hover:bg-[#F35B04]'
              }`}
            >
              See All Items
              <FaChevronRight className="ml-2" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default RecentListings;