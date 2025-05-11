import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaChevronRight, FaArrowLeft, FaShareAlt, FaFlag, FaBookmark, FaEnvelope } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

// ItemCard Component
const ItemCard = ({ item }) => {
    const { id, title, shortDescription, location, date, status, category, image } = item;
    const isLost = status === 'Lost';
    const navigate = useNavigate();

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="relative group overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm border border-[#E9ECEF] shadow-sm hover:shadow-md transition-all duration-300"
        >
            {/* Image with gradient overlay */}
            <div className="relative h-48 overflow-hidden">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center ${
                        isLost ? 'bg-gradient-to-br from-[#F35B04]/10 to-[#FFBE0B]/10' : 'bg-gradient-to-br from-[#00AFB9]/10 to-[#3D348B]/10'
                    }`}>
                        <div className={`text-4xl ${
                            isLost ? 'text-[#F35B04]' : 'text-[#00AFB9]'
                        }`}>
                            {isLost ? '🔍' : '🔄'}
                        </div>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#212529]/20 to-transparent" />

                {/* Status badge */}
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                    isLost
                        ? 'bg-[#F35B04]/90 text-white'
                        : 'bg-[#00AFB9]/90 text-white'
                }`}>
                    {status}
                </span>
            </div>

            <div className="p-5">
                {/* Category chip */}
                <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-[#E9ECEF] text-[#212529] mb-2">
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

                <p className="text-[#212529] text-sm mb-4 line-clamp-2">
                    {shortDescription}
                </p>

                {/* Metadata */}
                <div className="space-y-2 mb-5">
                    <div className="flex items-center text-sm text-[#212529]/80">
                        <FaMapMarkerAlt className={`w-4 h-4 mr-2 ${
                            isLost ? 'text-[#F35B04]' : 'text-[#00AFB9]'
                        }`} />
                        <span>{location}</span>
                    </div>

                    <div className="flex items-center text-sm text-[#212529]/80">
                        <FaCalendarAlt className={`w-4 h-4 mr-2 ${
                            isLost ? 'text-[#F35B04]' : 'text-[#00AFB9]'
                        }`} />
                        <span>{isLost ? 'Lost' : 'Found'} • {date}</span>
                    </div>
                </div>

                {/* Button with animated arrow */}
                <button
                    onClick={() => navigate(`/item/${id}`)}
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