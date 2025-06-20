import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaChevronRight, FaUser, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

// ItemCard Component
const ItemCard = ({ item, isDashboard }) => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    
    // Handle both old data structure (from local data) and new API structure
    const {
        id,
        title,
        shortDescription,
        fullDescription,
        location,
        date,
        status,
        category,
        image,
        images = [],
        reportedBy,
        reportedDate,
        contactInfo,
        itemType // New field to distinguish lost vs found items
    } = item;

    // Determine if it's a lost item based on the itemType field from API
    const isLost = itemType === 'lost';
    
    // Get the first image from the images array if available
    const itemImage = image || (images && images.length > 0 ? images[0] : null);
    
    // Format date to be more readable
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Format reported date for display
    const formatReportedDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const handleNavigate = () => {
        if (isDashboard) {
            navigate(`/dashboard/item/${id}`);
        } else {
            navigate(`/item/${id}`);
        }
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className={`relative group overflow-hidden rounded-xl backdrop-blur-sm border shadow-sm hover:shadow-md transition-all duration-300 ${
                isDarkMode 
                    ? 'bg-gray-800/80 border-gray-700' 
                    : 'bg-white/80 border-[#E9ECEF]'
            }`}
        >
            {/* Image with gradient overlay */}
            <div className="relative h-48 overflow-hidden">
                {itemImage ? (
                    <img
                        src={itemImage}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                            // Fallback if image fails to load
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                
                {/* Fallback placeholder */}
                <div 
                    className={`w-full h-full flex items-center justify-center ${
                        isLost ? 'bg-gradient-to-br from-[#F35B04]/10 to-[#FFBE0B]/10' : 'bg-gradient-to-br from-[#00AFB9]/10 to-[#3D348B]/10'
                    } ${itemImage ? 'hidden' : 'flex'}`}
                >
                    <div className={`text-4xl ${
                        isLost ? 'text-[#F35B04]' : 'text-[#00AFB9]'
                    }`}>
                        {isLost ? '🔍' : '🔄'}
                    </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#212529]/20 to-transparent" />

                {/* Status badge */}
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                    status === 'ACTIVE'
                        ? isLost 
                            ? 'bg-[#F35B04]/90 text-white' 
                            : 'bg-[#00AFB9]/90 text-white'
                        : 'bg-gray-500/90 text-white'
                }`}>
                    {status === 'ACTIVE' ? (isLost ? 'Lost' : 'Found') : status}
                </span>
            </div>

            <div className="p-5">
                {/* Category chip */}
                <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full mb-2 ${
                    isDarkMode 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-[#E9ECEF] text-[#212529]'
                }`}>
                    {category}
                </span>

                {/* Title with gradient text */}
                <h3 className={`text-xl font-bold mb-2 bg-clip-text text-transparent ${
                    isLost
                        ? 'bg-gradient-to-r from-[#F35B04] to-[#FFBE0B]'
                        : 'bg-gradient-to-r from-[#00AFB9] to-[#3D348B]'
                }`}>
                    {title}
                </h3>

                <p className={`text-sm mb-4 line-clamp-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-[#212529]'
                }`}>
                    {shortDescription || fullDescription || 'No description available'}
                </p>

                {/* Metadata */}
                <div className="space-y-2 mb-4">
                    <div className={`flex items-center text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-[#212529]/80'
                    }`}>
                        <FaMapMarkerAlt className={`w-4 h-4 mr-2 ${
                            isLost ? 'text-[#F35B04]' : 'text-[#00AFB9]'
                        }`} />
                        <span className="truncate">{location}</span>
                    </div>

                    <div className={`flex items-center text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-[#212529]/80'
                    }`}>
                        <FaCalendarAlt className={`w-4 h-4 mr-2 ${
                            isLost ? 'text-[#F35B04]' : 'text-[#00AFB9]'
                        }`} />
                        <span>{isLost ? 'Lost' : 'Found'} • {formatDate(date)}</span>
                    </div>

                    {/* Additional info for API data */}
                    {reportedBy && (
                        <div className={`flex items-center text-sm ${
                            isDarkMode ? 'text-gray-500' : 'text-[#212529]/60'
                        }`}>
                            <FaUser className="w-3 h-3 mr-2" />
                            <span className="truncate">By {reportedBy}</span>
                        </div>
                    )}

                    {reportedDate && (
                        <div className={`flex items-center text-sm ${
                            isDarkMode ? 'text-gray-500' : 'text-[#212529]/60'
                        }`}>
                            <FaClock className="w-3 h-3 mr-2" />
                            <span>Reported {formatReportedDate(reportedDate)}</span>
                        </div>
                    )}
                </div>

                {/* Button with animated arrow */}
                <button
                    onClick={handleNavigate}
                    className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center transition-all duration-300 ${
                        isLost
                            ? 'bg-gradient-to-r from-[#F35B04] to-[#FFBE0B] hover:from-[#F35B04]/90 hover:to-[#FFBE0B]/90 text-white'
                            : 'bg-gradient-to-r from-[#00AFB9] to-[#3D348B] hover:from-[#00AFB9]/90 hover:to-[#3D348B]/90 text-white'
                    }`}
                >
                    <span>View Details</span>
                    <FaChevronRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                </button>
            </div>

            {/* Subtle corner accent */}
            <div className={`absolute top-0 left-0 w-16 h-16 -mt-8 -ml-8 rounded-full opacity-10 ${
                isLost ? 'bg-[#F35B04]' : 'bg-[#00AFB9]'
            }`} />
        </motion.div>
    );
};

export default ItemCard;