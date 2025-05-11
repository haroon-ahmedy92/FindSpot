import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ItemCard from '../ui/ItemCard';
import { foundItems } from '../../data/foundItems';
import { lostItems } from '../../data/lostItems';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const RecentListings = () => {
  const [activeTab, setActiveTab] = useState('lost-items');
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const currentItems = activeTab === 'lost-items' ? lostItems : foundItems;
  const displayItems = currentItems.slice(0, 3); // Show only 3 items

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
      <section className="py-20 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <motion.h2
                className="text-3xl md:text-4xl font-bold text-[#212529] mb-4 md:mb-0"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
              Recent <span className="text-[#F35B04]">Listings</span>
            </motion.h2>

            <motion.div
                className="flex p-1 bg-[#F8F9FA] rounded-full"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                      activeTab === 'lost-items'
                          ? 'bg-[#F35B04] text-white shadow-md'
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
                          : 'text-gray-600 hover:text-[#00AFB9]'
                  }`}
                  onClick={() => handleTabClick('found-items')}
              >
                Found Items
              </button>
            </motion.div>
          </div>

          <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayItems.map((item) => (
                <motion.div key={item.id} variants={item}>
                  <ItemCard item={item} />
                </motion.div>
            ))}
          </motion.div>

          <motion.div
              className="flex justify-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
          >
            <button
                onClick={() => navigate(activeTab === 'lost-items' ? '/listings/lost' : '/listings/found')}
                className="flex items-center px-6 py-3 bg-white border-2 border-[#F35B04] text-[#F35B04] rounded-full font-medium hover:bg-[#F35B04] hover:text-white transition-all duration-300"
            >
              {activeTab === 'lost-items' ? 'See All Lost Items' : 'See All Found Items'}
              <FaChevronRight className="ml-2" />
            </button>
          </motion.div>

        </div>
      </section>
  );
};

export default RecentListings;