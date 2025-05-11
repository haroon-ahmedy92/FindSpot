import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaArrowLeft, FaShareAlt, FaFlag, FaBookmark, FaEnvelope } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

const ItemDetail = ({ items }) => {
    const { id } = useParams(); // Changed from itemId to id
    const navigate = useNavigate();
    const item = items?.find(i => i.id === parseInt(id)); // Added optional chaining for safety

    if (!items || !item) return <div className="text-center py-10 text-[#212529]">Item not found</div>;

    const isLost = item.status === 'Lost';
    const mainImage = item.images?.[0] || '/images/placeholder.jpg';
    const thumbnailImages = item.images?.slice(1) || [];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-white py-10">
            <div className="container mx-auto px-4">
                {/* Back Button */}
                <motion.button
                    whileHover={{ x: -5 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center text-[#3D348B] hover:text-[#F35B04] mb-6 transition-colors duration-200"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Listings
                </motion.button>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-[#E9ECEF]">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Image Section */}
                            <div className="md:w-1/3">
                                <div className="bg-[#E9ECEF] rounded-lg p-2 mb-4">
                                    <img
                                        src={mainImage}
                                        alt={item.title}
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {thumbnailImages.map((img, index) => (
                                        <div key={index} className="bg-[#E9ECEF] h-20 rounded-lg overflow-hidden">
                                            <img
                                                src={img}
                                                alt={`${item.title} thumbnail ${index + 1}`}
                                                className="w-full h colormap-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="md:w-2/3">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-[#212529] mb-2">{item.title}</h1>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                                                isLost ? 'bg-[#F35B04]/10 text-[#F35B04]' : 'bg-[#00AFB9]/10 text-[#00AFB9]'
                                            }`}>
                                                {item.status}
                                            </span>
                                            <span className="text-[#212529]/60">|</span>
                                            <span className="text-[#212529]/80">{item.category}</span>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        className="text-[#212529]/60 hover:text-[#3D348B]"
                                    >
                                        <FaShareAlt className="text-xl" />
                                    </motion.button>
                                </div>

                                {/* Metadata */}
                                <div className="border-t border-b border-[#E9ECEF] py-4 my-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[#212529]/60 text-sm mb-1">Location</p>
                                            <p className="flex items-center font-medium text-[#212529]">
                                                <FaMapMarkerAlt className={`mr-2 ${isLost ? 'text-[#F35B04]' : 'text-[#00AFB9]'}`} />
                                                {item.location}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[#212529]/60 text-sm mb-1">{isLost ? 'Date Lost' : 'Date Found'}</p>
                                            <p className="flex items-center font-medium text-[#212529]">
                                                <FaCalendarAlt className={`mr-2 ${isLost ? 'text-[#F35B04]' : 'text-[#00AFB9]'}`} />
                                                {item.date}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold text-[#212529] mb-3">Description</h3>
                                    <p className="text-[#212529]/80 mb-4">{item.fullDescription}</p>
                                    {item.additionalDetails && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {Object.entries(item.additionalDetails).map(([key, value]) => (
                                                <div key={key}>
                                                    <p className="text-[#212529]/60 text-sm">{key}</p>
                                                    <p className="text-[#212529] font-medium">{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Contact Info */}
                                <div className="bg-[#3D348B]/5 rounded-lg p-6 mb-6">
                                    <h3 className="text-xl font-semibold text-[#212529] mb-3">Contact Information</h3>
                                    <p className="text-[#212529]/80 mb-2">
                                        This item was {isLost ? 'reported' : 'found'} by <strong>{isLost ? item.reportedBy : item.foundBy}</strong> on {item.reportedDate}
                                    </p>
                                    <p className="text-[#212529]/80 mb-4">{item.contactInfo}</p>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        className="w-full py-3 bg-[#3D348B] text-white rounded-lg hover:bg-[#3D348B]/90 flex items-center justify-center"
                                    >
                                        <FaEnvelope className="mr-2" />
                                        Contact
                                    </motion.button>
                                    <p className="text-sm text-center text-[#212529]/60 mt-2">
                                        You must be logged in to contact
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="border-t border-[#E9ECEF] pt-4">
                                    <div className="flex flex-wrap gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            className="px-4 py-2 border border-[#E9ECEF] rounded-lg text-[#212529]/80 hover:bg-[#E9ECEF] flex items-center"
                                        >
                                            <FaFlag className="mr-2" />
                                            Report
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            className="px-4 py-2 border border-[#E9ECEF] rounded-lg text-[#212529]/80 hover:bg-[#E9ECEF] flex items-center"
                                        >
                                            <FaBookmark className="mr-2" />
                                            Save
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetail;