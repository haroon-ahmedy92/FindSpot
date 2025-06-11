import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaArrowLeft, FaShareAlt, FaFlag, FaEnvelope, FaSpinner } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import ItemService from '../../api/itemService';
import SaveItemButton from './SaveItemButton';
import { useAuth } from '../../contexts/AuthContext';

const ItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            if (!isAuthenticated) {
                setError('Please log in to view item details');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError('');
                const response = await ItemService.getItemById(id);
                setItem(response);
            } catch (fetchError) {
                console.error('Error fetching item:', fetchError);
                setError(fetchError.message || 'Failed to load item details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchItem();
        }
    }, [id, isAuthenticated]);

    // Determine if item is lost or found based on type field
    const isLost = item ? (item.type?.toLowerCase() === 'lost') : false;
    
    // Define color schemes - enhanced colors only for found items, neutral for lost items
    const colorScheme = isLost ? {
        // Neutral colors for lost items (original styling)
        primary: '#F35B04',
        primaryHover: '#d95203',
        primaryLight: 'rgba(243, 91, 4, 0.1)',
        accent: '#FF6B35',
        background: 'from-gray-50 to-white', // Neutral background
        border: 'border-gray-200', // Neutral border
        gradient: 'from-gray-100 to-gray-50' // Neutral gradient
    } : {
        // Enhanced colors for found items only
        primary: '#00AFB9',
        primaryHover: '#008891',
        primaryLight: 'rgba(0, 175, 185, 0.1)',
        accent: '#4ECDC4',
        background: 'from-cyan-50 to-teal-50',
        border: 'border-cyan-200',
        gradient: 'from-cyan-500 to-teal-500'
    };

    // Loading state
    if (loading) {
        return (
            <div className={`min-h-screen bg-gradient-to-b ${colorScheme.background} py-10`}>
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center py-20">
                        <FaSpinner className="animate-spin text-3xl" style={{ color: colorScheme.primary }} />
                        <span className="ml-3 text-lg text-gray-600">Loading item details...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-white py-10">
                <div className="container mx-auto px-4">
                    <motion.button
                        whileHover={{ x: -5 }}
                        onClick={() => navigate(-1)}
                        className="flex items-center text-[#3D348B] hover:text-[#F35B04] mb-6 transition-colors duration-200"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Listings
                    </motion.button>
                    <div className="bg-red-100 text-red-700 p-6 rounded-lg border border-red-200 text-center">
                        <h2 className="text-xl font-semibold mb-2">Error Loading Item</h2>
                        <p>{error}</p>
                        {!isAuthenticated && (
                            <button 
                                onClick={() => navigate('/login')}
                                className="mt-4 bg-[#F35B04] text-white px-6 py-2 rounded-lg hover:bg-[#d95203] transition-colors"
                            >
                                Log In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Item not found state
    if (!item) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-white py-10">
                <div className="container mx-auto px-4">
                    <motion.button
                        whileHover={{ x: -5 }}
                        onClick={() => navigate(-1)}
                        className="flex items-center text-[#3D348B] hover:text-[#F35B04] mb-6 transition-colors duration-200"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Listings
                    </motion.button>
                    <div className="text-center py-10 text-[#212529]">
                        <h2 className="text-xl font-semibold mb-2">Item Not Found</h2>
                        <p className="text-gray-600">The item you're looking for doesn't exist or has been removed.</p>
                    </div>
                </div>
            </div>
        );
    }

    const mainImage = item.images?.[0] || '/images/placeholder.jpg';
    const thumbnailImages = item.images?.slice(1) || [];

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return dateString;
        }
    };

    return (
        <div className={`min-h-screen bg-gradient-to-b ${colorScheme.background} py-10`}>
            <div className="container mx-auto px-4">
                {/* Back Button */}
                <motion.button
                    whileHover={{ x: -5 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center hover:text-[#3D348B] mb-6 transition-colors duration-200"
                    style={{ color: colorScheme.primary }}
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Listings
                </motion.button>

                {/* Main Content */}
                <div className={`bg-white rounded-lg shadow-lg overflow-hidden border-2 ${colorScheme.border}`}>
                    {/* Header with gradient */}
                    <div className={`h-2 bg-gradient-to-r ${colorScheme.gradient}`}></div>
                    
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Image Section */}
                            <div className="md:w-1/3">
                                <div className={`bg-gradient-to-br ${colorScheme.background} rounded-lg p-3 mb-4 border ${colorScheme.border}`}>
                                    <img
                                        src={mainImage}
                                        alt={item.title}
                                        className="w-full h-64 object-cover rounded-lg shadow-md"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {thumbnailImages.map((img, index) => (
                                        <div key={index} className={`bg-gradient-to-br ${colorScheme.background} h-20 rounded-lg overflow-hidden border ${colorScheme.border}`}>
                                            <img
                                                src={img}
                                                alt={`${item.title} thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
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
                                            <span 
                                                className="text-sm font-semibold px-4 py-2 rounded-full shadow-sm"
                                                style={{ 
                                                    backgroundColor: colorScheme.primaryLight,
                                                    color: colorScheme.primary,
                                                    border: `1px solid ${colorScheme.primary}30`
                                                }}
                                            >
                                                {item.status}
                                            </span>
                                            <span className="text-[#212529]/60">|</span>
                                            <span className="text-[#212529]/80 font-medium">{item.category}</span>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        className="text-[#212529]/60 hover:text-[#3D348B] p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                                    >
                                        <FaShareAlt className="text-xl" />
                                    </motion.button>
                                </div>

                                {/* Metadata */}
                                <div className={`border-2 ${colorScheme.border} rounded-lg p-4 my-6 bg-gradient-to-r ${colorScheme.background}`}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[#212529]/60 text-sm mb-1 font-medium">Location</p>
                                            <p className="flex items-center font-semibold text-[#212529]">
                                                <FaMapMarkerAlt className="mr-2" style={{ color: colorScheme.primary }} />
                                                {item.location}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[#212529]/60 text-sm mb-1 font-medium">{isLost ? 'Date Lost' : 'Date Found'}</p>
                                            <p className="flex items-center font-semibold text-[#212529]">
                                                <FaCalendarAlt className="mr-2" style={{ color: colorScheme.primary }} />
                                                {formatDate(item.date)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold text-[#212529] mb-3 flex items-center">
                                        <div 
                                            className="w-1 h-6 rounded-full mr-3"
                                            style={{ backgroundColor: colorScheme.primary }}
                                        ></div>
                                        Description
                                    </h3>
                                    <p className="text-[#212529]/80 mb-4 leading-relaxed">{item.fullDescription}</p>
                                    {item.additionalDetails && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {Object.entries(item.additionalDetails).map(([key, value]) => (
                                                <div key={key} className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-[#212529]/60 text-sm font-medium">{key}</p>
                                                    <p className="text-[#212529] font-semibold">{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Contact Info */}
                                <div 
                                    className="rounded-lg p-6 mb-6 border-2"
                                    style={{ 
                                        backgroundColor: colorScheme.primaryLight,
                                        borderColor: colorScheme.primary + '30'
                                    }}
                                >
                                    <h3 className="text-xl font-semibold text-[#212529] mb-3 flex items-center">
                                        <div 
                                            className="w-1 h-6 rounded-full mr-3"
                                            style={{ backgroundColor: colorScheme.primary }}
                                        ></div>
                                        Contact Information
                                    </h3>
                                    <p className="text-[#212529]/80 mb-2">
                                        This item was {isLost ? 'reported' : 'found'} by <strong>{isLost ? item.reportedBy : item.foundBy}</strong> on {item.reportedDate}
                                    </p>
                                    <p className="text-[#212529]/80 mb-4">{item.contactInfo}</p>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-3 text-white rounded-lg font-semibold flex items-center justify-center shadow-lg transition-all duration-200"
                                        style={{ 
                                            backgroundColor: colorScheme.primary,
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = colorScheme.primaryHover}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = colorScheme.primary}
                                    >
                                        <FaEnvelope className="mr-2" />
                                        Contact {isLost ? 'Owner' : 'Finder'}
                                    </motion.button>
                                    <p className="text-sm text-center text-[#212529]/60 mt-2">
                                        You must be logged in to contact
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className={`border-t-2 ${colorScheme.border} pt-4`}>
                                    <div className="flex flex-wrap gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-4 py-2 border-2 rounded-lg text-[#212529]/80 hover:bg-gray-50 flex items-center transition-all duration-200"
                                            style={{ borderColor: colorScheme.primary + '30' }}
                                        >
                                            <FaFlag className="mr-2" style={{ color: colorScheme.primary }} />
                                            Report
                                        </motion.button>
                                        <SaveItemButton itemId={item.id} />
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