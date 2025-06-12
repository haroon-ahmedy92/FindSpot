import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaHandshake, FaShieldAlt, FaMapMarkedAlt } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const AboutPage = () => {
    const { isDarkMode } = useTheme();
    
    const features = [
        {
            icon: FaUsers,
            title: "Community-Powered",
            description: "Leveraging the power of community to reunite lost items with their owners",
            color: "#F35B04"
        },
        {
            icon: FaHandshake,
            title: "Easy Connections",
            description: "Simple and secure way to connect with people who have found your items",
            color: "#3D348B"
        },
        {
            icon: FaShieldAlt,
            title: "Safe & Secure",
            description: "Verified users and secure communication channels for your peace of mind",
            color: "#00AFB9"
        },
        {
            icon: FaMapMarkedAlt,
            title: "Location-Based",
            description: "Focused on Dodoma to provide hyper-local lost and found solutions",
            color: "#FFBE0B"
        }
    ];

    const teamMembers = [
        {
            name: "Alex Mwenda",
            role: "Founder & Developer",
            bio: "Passionate about using technology to solve community problems",
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            name: "Sarah Johnson",
            role: "Community Manager",
            bio: "Connecting people and building trust in the community",
            image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            name: "Michael Kato",
            role: "Partnerships",
            bio: "Working with local businesses to expand our reach",
            image: "https://randomuser.me/api/portraits/men/67.jpg"
        }
    ];

    return (
        <div className={`${
            isDarkMode 
                ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
                : 'bg-gradient-to-b from-[#F8F9FA] to-white'
        }`}>
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-b from-[#3D348B] to-[#F35B04] text-white">
                <div className="container max-w-7xl mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                    >
                        About <span className="text-[#FFBE0B]">FindSpot</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-xl max-w-3xl mx-auto opacity-90"
                    >
                        Our mission is to create a trusted community platform that helps reunite lost items with their owners in Dodoma.
                    </motion.p>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="lg:w-1/2"
                        >
                            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                                isDarkMode ? 'text-white' : 'text-[#212529]'
                            }`}>
                                Our <span className="text-[#F35B04]">Story</span>
                            </h2>
                            <p className={`mb-4 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                FindSpot was born out of a personal experience. After losing an important bag on campus and struggling to find it through traditional methods, our founder realized there had to be a better way.
                            </p>
                            <p className={`mb-4 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                In 2022, we launched FindSpot as a small university project focused on helping students reconnect with lost items. The positive response was overwhelming, and we quickly expanded to serve the entire Dodoma community.
                            </p>
                            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                Today, FindSpot has become the go-to platform for lost and found items in Dodoma, with thousands of successful reunions and a growing community of users who believe in helping one another.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className={`lg:w-1/2 p-8 rounded-2xl shadow-lg ${
                                isDarkMode ? 'bg-gray-800' : 'bg-white'
                            }`}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                                alt="Community helping each other"
                                className="w-full h-auto rounded-lg"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className={`py-20 ${
                isDarkMode ? 'bg-gray-900/50' : 'bg-[#F8F9FA]'
            }`}>
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
                            Why <span className="text-[#F35B04]">Choose</span> FindSpot
                        </h2>
                        <p className={`max-w-2xl mx-auto ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            We're different from other lost and found platforms. Here's why our community loves us.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow ${
                                    isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white'
                                }`}
                            >
                                <div
                                    className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-white"
                                    style={{ backgroundColor: feature.color }}
                                >
                                    <feature.icon className="text-2xl" />
                                </div>
                                <h3 className={`text-xl font-bold mb-3 ${
                                    isDarkMode ? 'text-white' : 'text-[#212529]'
                                }`}>
                                    {feature.title}
                                </h3>
                                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20">
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
                            Meet Our <span className="text-[#F35B04]">Team</span>
                        </h2>
                        <p className={`max-w-2xl mx-auto ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            The passionate people working to make Dodoma a better place, one found item at a time.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`rounded-2xl shadow-sm hover:shadow-md overflow-hidden transition-shadow ${
                                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                                }`}
                            >
                                <div className="h-64 overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className={`text-xl font-bold mb-1 ${
                                        isDarkMode ? 'text-white' : 'text-[#212529]'
                                    }`}>
                                        {member.name}
                                    </h3>
                                    <p className="text-[#F35B04] font-medium mb-3">
                                        {member.role}
                                    </p>
                                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                        {member.bio}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-[#3D348B] text-white">
                <div className="container max-w-7xl mx-auto px-4 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-4xl font-bold mb-6"
                    >
                        Ready to Join Our Community?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-xl max-w-2xl mx-auto mb-8 opacity-90"
                    >
                        Whether you've lost something or found an item, you can make a difference today.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row justify-center gap-4"
                    >
                        <button className="px-8 py-4 bg-[#F35B04] hover:bg-[#d95203] rounded-full font-bold text-lg transition-colors">
                            Report a Lost Item
                        </button>
                        <button className="px-8 py-4 bg-[#FFBE0B] hover:bg-[#e6ab00] text-[#212529] rounded-full font-bold text-lg transition-colors">
                            Report a Found Item
                        </button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;