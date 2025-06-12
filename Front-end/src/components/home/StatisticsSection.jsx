import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

// Example statistics data structure if you're not importing it
// const statistics = [
//   { number: "500+", label: "Items Reunited" },
//   { number: "1.2K", label: "Community Members" },
//   { number: "95%", label: "Success Rate" },
//   { number: "24h", label: "Average Response Time" }
// ];

const StatisticsSection = ({ statistics = [] }) => {
    const { isDarkMode } = useTheme();
    
    // Fallback data in case statistics prop is empty
    const statsData = statistics.length > 0 ? statistics : [
        { number: "500+", label: "Items Reunited" },
        { number: "1.2K", label: "Community Members" },
        { number: "95%", label: "Success Rate" },
        { number: "24h", label: "Average Response Time" }
    ];

    return (
        <section className={`py-20 relative overflow-hidden ${
            isDarkMode 
                ? 'bg-gradient-to-br from-[#3D348B] to-gray-800' 
                : 'bg-gradient-to-br from-[#3D348B] to-[#2a2571]'
        }`}>
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl ${
                    isDarkMode ? 'bg-[#FFBE0B]/10' : 'bg-[#FFBE0B]/20'
                }`}></div>
                <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl ${
                    isDarkMode ? 'bg-[#F35B04]/10' : 'bg-[#F35B04]/20'
                }`}></div>
            </div>

            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
                >
                    Our <span className="text-[#FFBE0B]">Impact</span> So Far
                </motion.h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {statsData.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`p-6 rounded-2xl text-center border transition-all duration-300 ${
                                isDarkMode 
                                    ? 'bg-gray-800/60 border-gray-600/30 hover:bg-gray-700/60' 
                                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                            }`}
                            style={{
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)'
                            }}
                        >
                            <motion.h3
                                initial={{ scale: 0.8 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    type: "spring",
                                    stiffness: 100,
                                    delay: index * 0.1 + 0.2
                                }}
                                className="text-4xl md:text-5xl font-bold text-[#FFBE0B] mb-2"
                            >
                                {stat.number}
                            </motion.h3>
                            <p className={`text-base md:text-lg ${
                                isDarkMode ? 'text-gray-200' : 'text-white'
                            }`}>{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatisticsSection;