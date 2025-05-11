import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaMobileAlt, FaFileAlt, FaWallet, FaKey, FaShoppingBag, FaGlasses, FaBook, FaBox } from 'react-icons/fa';

const CategoriesPage = () => {
    const navigate = useNavigate();

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
        <section className="py-20 bg-[#F8F9FA] min-h-screen">
            <div className="container max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[#212529] mb-4">
                        All <span className="text-[#F35B04]">Categories</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore all categories to find lost or found items that match your needs.
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
                >
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            className="group cursor-pointer"
                            onClick={() => navigate(`/listings/all?category=${encodeURIComponent(category.label)}`)}
                        >
                            <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                                <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-[#F35B04] to-[#FFBE0B] text-white group-hover:scale-110 transition-transform duration-300">
                                    <category.icon className="w-8 h-8" />
                                </div>
                                <span className="text-[#212529] font-medium group-hover:text-[#F35B04] transition-colors duration-300">
                  {category.label}
                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default CategoriesPage;