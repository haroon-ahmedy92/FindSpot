import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaMobileAlt, FaFileAlt, FaWallet, FaKey, FaShoppingBag, FaGlasses, FaBook, FaBox } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const CategoriesSection = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const categories = [
    { icon: FaMobileAlt, label: 'Electronics' },
    { icon: FaFileAlt, label: 'Documents' },
    { icon: FaWallet, label: 'Wallets & Purses' },
    { icon: FaKey, label: 'Keys' },
    { icon: FaShoppingBag, label: 'Bags & Backpacks' },
    { icon: FaGlasses, label: 'Accessories' },
    { icon: FaBook, label: 'Books' },
    { icon: FaBox, label: 'Other' },
  ];

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
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
      <section className={`py-20 ${
        isDarkMode ? 'bg-gray-800' : 'bg-[#F8F9FA]'
      }`}>
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-[#212529]'
            }`}>
              Browse by <span className="text-[#F35B04]">Category</span>
            </h2>
            <p className={`max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Looking for something specific? Browse through our categories to find what you've lost or see if someone found your item.
            </p>
          </motion.div>

          <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {categories.map((category, index) => (
                <motion.div
                    key={index}
                    variants={item}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/listings/all?category=${encodeURIComponent(category.label)}`)}
                >
                  <div className={`flex flex-col items-center p-6 rounded-2xl shadow-sm group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-white'
                  }`}>
                    <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-[#F35B04] to-[#FFBE0B] text-white group-hover:scale-110 transition-transform duration-300">
                      <category.icon className="w-8 h-8" />
                    </div>
                    <span className={`font-medium group-hover:text-[#F35B04] transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-[#212529]'
                    }`}>
                      {category.label}
                    </span>
                  </div>
                </motion.div>
            ))}
          </motion.div>

          <div className="flex justify-center mt-12">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 border-2 border-[#F35B04] text-[#F35B04] rounded-full font-medium hover:bg-[#F35B04] hover:text-white transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
                onClick={() => navigate('/categories')}
            >
              See All Categories
            </motion.button>
          </div>
        </div>
      </section>
  );
};

export default CategoriesSection;