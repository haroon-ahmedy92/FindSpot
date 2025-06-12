import React from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaBullhorn, FaHandshake, FaBell } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const steps = [
    {
        icon: FaSearch,
        title: "Report Your Item",
        description: "Quickly report a lost or found item with details and photos",
        color: "#F35B04"
    },
    {
        icon: FaBullhorn,
        title: "We Notify the Community",
        description: "Your listing is shared with nearby users and local businesses",
        color: "#3D348B"
    },
    {
        icon: FaHandshake,
        title: "Match & Connect",
        description: "We help match your report with similar listings and connect you",
        color: "#00AFB9"
    },
    {
        icon: FaBell,
        title: "Get Notified",
        description: "Receive alerts when there's a potential match for your item",
        color: "#FFBE0B"
    }
];

const HowItWorks = () => {
    const { isDarkMode } = useTheme();
    
    return (
        <section className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="container max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                        isDarkMode ? 'text-white' : 'text-[#212529]'
                    }`}>
                        How <span className="text-[#F35B04]">FindSpot</span> Works
                    </h2>
                    <p className={`max-w-2xl mx-auto ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Our simple 4-step process makes it easy to report and recover lost items.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div
                                className="w-20 h-20 rounded-2xl mb-6 flex items-center justify-center text-white"
                                style={{ backgroundColor: step.color }}
                            >
                                <step.icon className="w-8 h-8" />
                            </div>
                            <h3 className={`text-xl font-bold mb-2 ${
                                isDarkMode ? 'text-white' : 'text-[#212529]'
                            }`}>{step.title}</h3>
                            <p className={`${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>{step.description}</p>

                            {/* Step number */}
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mt-6"
                                style={{ backgroundColor: step.color }}
                            >
                                {index + 1}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
