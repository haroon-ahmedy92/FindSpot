import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, FaHandshake, FaShieldAlt, FaMapMarkedAlt, FaHeart, FaRocket, 
  FaLightbulb, FaGlobe, FaStar, FaSearch, FaCheckCircle, FaQuoteLeft,
  FaArrowRight, FaAward, FaLinkedin, FaTwitter, FaGithub
} from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const AboutPage = () => {
    const { isDarkMode } = useTheme();
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [activeValue, setActiveValue] = useState(null);
    
    // Handle authentication-required actions
    const handleAuthRequiredAction = (action, route) => {
        if (!isAuthenticated) {
            showToast('Please login to access this feature', 'info');
            navigate('/login');
        } else {
            navigate(route);
        }
    };

    // Handle browse items action
    const handleBrowseItems = () => {
        navigate('/listings/all'); // Navigate to browse all items page
    };
    
    const stats = [
        { number: "10,000+", label: "Items Reunited", icon: FaCheckCircle },
        { number: "5,000+", label: "Active Users", icon: FaUsers },
        { number: "95%", label: "Success Rate", icon: FaAward },
        { number: "24/7", label: "Community Support", icon: FaHeart }
    ];

    const values = [
        {
            icon: FaHeart,
            title: "Community First",
            description: "We believe in the power of community to help each other. Every feature we build is designed to strengthen connections between people.",
            color: "from-red-500 to-pink-500"
        },
        {
            icon: FaShieldAlt,
            title: "Trust & Safety",
            description: "Your safety is our priority. We implement robust verification systems and secure communication channels to protect our users.",
            color: "from-blue-500 to-indigo-500"
        },
        {
            icon: FaLightbulb,
            title: "Innovation",
            description: "We constantly innovate to make finding lost items easier. From AI-powered matching to location-based alerts, we're always improving.",
            color: "from-yellow-500 to-orange-500"
        },
        {
            icon: FaGlobe,
            title: "Accessibility",
            description: "Our platform is designed to be accessible to everyone, regardless of technical skill level or device capabilities.",
            color: "from-green-500 to-teal-500"
        }
    ];

    const features = [
        {
            icon: FaSearch,
            title: "Smart Search",
            description: "Advanced search algorithms help match lost items with found items automatically",
            color: "#F35B04"
        },
        {
            icon: FaMapMarkedAlt,
            title: "Location Tracking",
            description: "Precise location data helps narrow down search areas and increase success rates",
            color: "#3D348B"
        },
        {
            icon: FaUsers,
            title: "Community Network",
            description: "Growing network of verified users committed to helping each other",
            color: "#00AFB9"
        },
        {
            icon: FaShieldAlt,
            title: "Secure Platform",
            description: "End-to-end encryption and verified user profiles ensure safe interactions",
            color: "#FFBE0B"
        },
        {
            icon: FaRocket,
            title: "Instant Notifications",
            description: "Real-time alerts when potential matches are found for your lost items",
            color: "#F35B04"
        },
        {
            icon: FaHandshake,
            title: "Easy Returns",
            description: "Streamlined process for arranging safe meetups and item returns",
            color: "#3D348B"
        }
    ];

    const teamMembers = [
        {
            name: "Alex Mwenda",
            role: "Founder & CEO",
            bio: "Passionate about using technology to solve community problems and bring people together",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
            social: {
                linkedin: "#",
                twitter: "#",
                github: "#"
            },
            expertise: ["Product Strategy", "Community Building", "Software Development"]
        },
        {
            name: "Sarah Johnson",
            role: "Head of Community",
            bio: "Building trust and connections within our growing community of users across Dodoma",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
            social: {
                linkedin: "#",
                twitter: "#"
            },
            expertise: ["Community Management", "User Experience", "Customer Success"]
        },
        {
            name: "Michael Kato",
            role: "Head of Partnerships",
            bio: "Expanding our reach through strategic partnerships with local businesses and organizations",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
            social: {
                linkedin: "#",
                twitter: "#"
            },
            expertise: ["Business Development", "Strategic Partnerships", "Market Expansion"]
        },
        {
            name: "Amina Hassan",
            role: "Lead Developer",
            bio: "Creating seamless user experiences through clean code and innovative technical solutions",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
            social: {
                linkedin: "#",
                github: "#"
            },
            expertise: ["Full-Stack Development", "Mobile Development", "System Architecture"]
        }
    ];

    const testimonials = [
        {
            name: "Maria Santos",
            role: "University Student",
            text: "I lost my laptop bag with all my important documents. Thanks to FindSpot, someone found it and returned it to me within 2 days!",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
            rating: 5
        },
        {
            name: "John Doe",
            role: "Local Business Owner",
            text: "FindSpot has become an essential service for our community. The platform is easy to use and has helped reunite so many people with their belongings.",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
            rating: 5
        },
        {
            name: "Grace Mwalimu",
            role: "Teacher",
            text: "The security features give me confidence when using the platform. I've successfully returned three items to their owners!",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
            rating: 5
        }
    ];

    return (
        <div className={`${
            isDarkMode 
                ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
                : 'bg-gradient-to-b from-[#F8F9FA] to-white'
        }`}>
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-r from-[#3D348B] via-[#7209B7] to-[#F35B04] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-white bg-opacity-5 rounded-full"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#FFBE0B] bg-opacity-20 rounded-full"></div>
                
                <div className="container max-w-7xl mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mb-8"
                    >
                        <div className="w-24 h-24 mx-auto mb-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white border-opacity-30 shadow-lg">
                            <FaSearch className="text-3xl text-white" />
                        </div>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                    >
                        About <span className="text-[#FFBE0B] drop-shadow-lg">FindSpot</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl max-w-3xl mx-auto opacity-90 leading-relaxed"
                    >
                        Connecting hearts through lost treasures. Our mission is to create a trusted community platform that helps reunite lost items with their owners in Dodoma and beyond.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <button 
                            onClick={handleBrowseItems}
                            className="bg-white text-[#3D348B] px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Browse Lost & Found Items <FaArrowRight className="inline ml-2" />
                        </button>
                        <button 
                            onClick={() => navigate('/contact')}
                            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-[#3D348B] transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Get In Touch
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} relative`}>
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="mb-4">
                                    <stat.icon className="text-4xl text-[#F35B04] mx-auto" />
                                </div>
                                <div className={`text-3xl md:text-4xl font-bold mb-2 ${
                                    isDarkMode ? 'text-white' : 'text-[#212529]'
                                }`}>
                                    {stat.number}
                                </div>
                                <div className={`text-sm md:text-base ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2"
                        >
                            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                                isDarkMode ? 'text-white' : 'text-[#212529]'
                            }`}>
                                Our <span className="text-[#F35B04]">Journey</span>
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-3 h-3 bg-[#F35B04] rounded-full mt-2 flex-shrink-0"></div>
                                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                        <span className="font-semibold text-[#F35B04]">2022:</span> FindSpot was born from a personal experience of losing an important bag on campus and struggling to find it through traditional methods.
                                    </p>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-3 h-3 bg-[#3D348B] rounded-full mt-2 flex-shrink-0"></div>
                                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                        <span className="font-semibold text-[#3D348B]">Early Days:</span> Started as a small university project focused on helping students reconnect with lost items. The positive response was overwhelming.
                                    </p>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-3 h-3 bg-[#FFBE0B] rounded-full mt-2 flex-shrink-0"></div>
                                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                        <span className="font-semibold text-[#FFBE0B]">Today:</span> FindSpot has become the go-to platform for lost and found items in Dodoma, with thousands of successful reunions and a growing community.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-8">
                                <button 
                                    onClick={() => navigate('/contact')}
                                    className="bg-[#F35B04] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#d95203] transition-colors"
                                >
                                    Join Our Story
                                </button>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:w-1/2"
                        >
                            <div className={`p-8 rounded-2xl shadow-xl ${
                                isDarkMode ? 'bg-gray-800' : 'bg-white'
                            }`}>
                                <img
                                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                                    alt="Community helping each other"
                                    className="w-full h-auto rounded-lg shadow-lg"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className={`py-20 ${
                isDarkMode ? 'bg-gray-900/50' : 'bg-[#F8F9FA]'
            }`}>
                <div className="container max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                            isDarkMode ? 'text-white' : 'text-[#212529]'
                        }`}>
                            Our <span className="text-[#F35B04]">Values</span>
                        </h2>
                        <p className={`max-w-2xl mx-auto ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            These principles guide everything we do and shape our community's experience.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                                    isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white'
                                } ${activeValue === index ? 'ring-2 ring-[#F35B04]' : ''}`}
                                onClick={() => setActiveValue(activeValue === index ? null : index)}
                            >
                                <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-r ${value.color}`}>
                                    <value.icon className="text-2xl text-white" />
                                </div>
                                <h3 className={`text-xl font-bold mb-3 ${
                                    isDarkMode ? 'text-white' : 'text-[#212529]'
                                }`}>
                                    {value.title}
                                </h3>
                                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20">
                <div className="container max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                            isDarkMode ? 'text-white' : 'text-[#212529]'
                        }`}>
                            What Makes Us <span className="text-[#F35B04]">Special</span>
                        </h2>
                        <p className={`max-w-2xl mx-auto ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Innovative features designed to make finding lost items easier and more secure.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                                }`}
                            >
                                <div
                                    className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-white shadow-lg"
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
            <section className={`py-20 ${
                isDarkMode ? 'bg-gray-900/50' : 'bg-[#F8F9FA]'
            }`}>
                <div className="container max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className={`rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                                }`}
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
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
                                    <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {member.bio}
                                    </p>
                                    {member.expertise && (
                                        <div className="mb-4">
                                            <p className={`text-xs font-semibold mb-2 tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                SKILLS & EXPERTISE
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {member.expertise.map((skill, skillIndex) => (
                                                    <span
                                                        key={skillIndex}
                                                        className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all duration-200 ${
                                                            isDarkMode 
                                                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white border border-gray-600' 
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-200'
                                                        }`}
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {member.social && (
                                        <div className="flex space-x-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                                            {member.social.linkedin && (
                                                <a
                                                    href={member.social.linkedin}
                                                    className={`p-2 rounded-full transition-all hover:scale-110 ${
                                                        isDarkMode 
                                                            ? 'text-gray-400 hover:text-[#F35B04] hover:bg-[#F35B04] hover:bg-opacity-10' 
                                                            : 'text-gray-500 hover:text-[#F35B04] hover:bg-[#F35B04] hover:bg-opacity-10'
                                                    }`}
                                                    title="LinkedIn"
                                                >
                                                    <FaLinkedin className="text-lg" />
                                                </a>
                                            )}
                                            {member.social.twitter && (
                                                <a
                                                    href={member.social.twitter}
                                                    className={`p-2 rounded-full transition-all hover:scale-110 ${
                                                        isDarkMode 
                                                            ? 'text-gray-400 hover:text-[#F35B04] hover:bg-[#F35B04] hover:bg-opacity-10' 
                                                            : 'text-gray-500 hover:text-[#F35B04] hover:bg-[#F35B04] hover:bg-opacity-10'
                                                    }`}
                                                    title="Twitter"
                                                >
                                                    <FaTwitter className="text-lg" />
                                                </a>
                                            )}
                                            {member.social.github && (
                                                <a
                                                    href={member.social.github}
                                                    className={`p-2 rounded-full transition-all hover:scale-110 ${
                                                        isDarkMode 
                                                            ? 'text-gray-400 hover:text-[#F35B04] hover:bg-[#F35B04] hover:bg-opacity-10' 
                                                            : 'text-gray-500 hover:text-[#F35B04] hover:bg-[#F35B04] hover:bg-opacity-10'
                                                    }`}
                                                    title="GitHub"
                                                >
                                                    <FaGithub className="text-lg" />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20">
                <div className="container max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                            isDarkMode ? 'text-white' : 'text-[#212529]'
                        }`}>
                            What Our <span className="text-[#F35B04]">Community</span> Says
                        </h2>
                        <p className={`max-w-2xl mx-auto ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Real stories from real people who found their lost treasures through FindSpot.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                                }`}
                            >
                                <FaQuoteLeft className="text-2xl text-[#F35B04] mb-4" />
                                <p className={`mb-6 italic ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    "{testimonial.text}"
                                </p>
                                <div className="flex items-center">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full mr-4 object-cover"
                                    />
                                    <div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#212529]'}`}>
                                            {testimonial.name}
                                        </h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <FaStar key={i} className="text-yellow-400" />
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-[#3D348B] via-[#7209B7] to-[#F35B04] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                <div className="container max-w-7xl mx-auto px-4 text-center relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl md:text-4xl font-bold mb-6"
                    >
                        Ready to Join Our Community?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-xl max-w-2xl mx-auto mb-8 opacity-90"
                    >
                        Whether you've lost something precious or found an item that needs returning, you can make a difference today.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col sm:flex-row justify-center gap-4"
                    >
                        <button 
                            onClick={() => handleAuthRequiredAction('Report Lost Item', '/report-lost')}
                            className="px-8 py-4 bg-white text-[#3D348B] rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            Report a Lost Item
                            {!isAuthenticated && <span className="text-sm opacity-75">(Login Required)</span>}
                        </button>
                        <button 
                            onClick={() => handleAuthRequiredAction('Report Found Item', '/report-found')}
                            className="px-8 py-4 bg-[#FFBE0B] hover:bg-[#e6ab00] text-[#212529] rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            Report a Found Item
                            {!isAuthenticated && <span className="text-sm opacity-75">(Login Required)</span>}
                        </button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;