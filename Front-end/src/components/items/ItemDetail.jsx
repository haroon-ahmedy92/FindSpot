import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaArrowLeft, FaShareAlt, FaFlag, FaEnvelope, FaSpinner } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import ItemService from '../../api/itemService';
import SaveItemButton from './SaveItemButton';
import { useAuth } from '../../contexts/AuthContext';

const ItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { isDarkMode } = useTheme();
    
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
    
    // Define color schemes with theme support
    const colorScheme = isLost ? {
        // Colors for lost items
        primary: '#F35B04',
        primaryHover: '#d95203',
        primaryLight: isDarkMode ? 'rgba(243, 91, 4, 0.2)' : 'rgba(243, 91, 4, 0.1)',
        accent: '#FF6B35',
        background: isDarkMode ? 'from-gray-800 to-gray-900' : 'from-gray-50 to-white',
        border: isDarkMode ? 'border-gray-600' : 'border-gray-200',
        gradient: isDarkMode ? 'from-orange-600 to-red-600' : 'from-gray-100 to-gray-50'
    } : {
        // Colors for found items
        primary: '#00AFB9',
        primaryHover: '#008891',
        primaryLight: isDarkMode ? 'rgba(0, 175, 185, 0.2)' : 'rgba(0, 175, 185, 0.1)',
        accent: '#4ECDC4',
        background: isDarkMode ? 'from-gray-800 to-gray-900' : 'from-cyan-50 to-teal-50',
        border: isDarkMode ? 'border-gray-600' : 'border-cyan-200',
        gradient: isDarkMode ? 'from-cyan-600 to-teal-600' : 'from-cyan-500 to-teal-500'
    };

    // Loading state
    if (loading) {
        return (
            <div className={`min-h-screen py-10 ${
                isDarkMode 
                    ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
                    : `bg-gradient-to-b ${colorScheme.background}`
            }`}>
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center py-20">
                        <FaSpinner className="animate-spin text-3xl" style={{ color: colorScheme.primary }} />
                        <span className={`ml-3 text-lg ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>Loading item details...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={`min-h-screen py-10 ${
                isDarkMode 
                    ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
                    : 'bg-gradient-to-b from-[#F8F9FA] to-white'
            }`}>
                <div className="container mx-auto px-4">
                    <motion.button
                        whileHover={{ x: -5 }}
                        onClick={() => navigate(-1)}
                        className={`flex items-center hover:text-[#F35B04] mb-6 transition-colors duration-200 ${
                            isDarkMode ? 'text-gray-300' : 'text-[#3D348B]'
                        }`}
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Listings
                    </motion.button>
                    <div className={`p-6 rounded-lg border text-center ${
                        isDarkMode 
                            ? 'bg-red-900/30 border-red-600/30 text-red-300' 
                            : 'bg-red-100 text-red-700 border-red-200'
                    }`}>
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
            <div className={`min-h-screen py-10 ${
                isDarkMode 
                    ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
                    : 'bg-gradient-to-b from-[#F8F9FA] to-white'
            }`}>
                <div className="container mx-auto px-4">
                    <motion.button
                        whileHover={{ x: -5 }}
                        onClick={() => navigate(-1)}
                        className={`flex items-center hover:text-[#F35B04] mb-6 transition-colors duration-200 ${
                            isDarkMode ? 'text-gray-300' : 'text-[#3D348B]'
                        }`}
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Listings
                    </motion.button>
                    <div className={`text-center py-10 ${
                        isDarkMode ? 'text-gray-300' : 'text-[#212529]'
                    }`}>
                        <h2 className="text-xl font-semibold mb-2">Item Not Found</h2>
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            The item you're looking for doesn't exist or has been removed.
                        </p>
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
        <div className={`min-h-screen py-10 ${
            isDarkMode 
                ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
                : `bg-gradient-to-b ${colorScheme.background}`
        }`}>
            <div className="container mx-auto px-4">
                {/* Back Button */}
                <motion.button
                    whileHover={{ x: -5 }}
                    onClick={() => navigate(-1)}
                    className={`flex items-center mb-6 transition-colors duration-200 ${
                        isDarkMode 
                            ? 'text-gray-300 hover:text-[#3D348B]' 
                            : 'hover:text-[#3D348B]'
                    }`}
                    style={{ color: isDarkMode ? undefined : colorScheme.primary }}
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Listings
                </motion.button>

                {/* Main Content */}
                <div className={`rounded-lg shadow-lg overflow-hidden border-2 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : `bg-white ${colorScheme.border}`
                }`}>
                    {/* Header with gradient */}
                    <div className={`h-2 bg-gradient-to-r ${colorScheme.gradient}`}></div>
                    
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Image Section */}
                            <div className="md:w-1/3">
                                <div className={`rounded-lg p-3 mb-4 border ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600' 
                                        : `bg-gradient-to-br ${colorScheme.background} ${colorScheme.border}`
                                }`}>
                                    <img
                                        src={mainImage}
                                        alt={item.title}
                                        className="w-full h-64 object-cover rounded-lg shadow-md"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {thumbnailImages.map((img, index) => (
                                        <div key={index} className={`h-20 rounded-lg overflow-hidden border ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600' 
                                                : `bg-gradient-to-br ${colorScheme.background} ${colorScheme.border}`
                                        }`}>
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
                                        <h1 className={`text-3xl font-bold mb-2 ${
                                            isDarkMode ? 'text-white' : 'text-[#212529]'
                                        }`}>{item.title}</h1>
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
                                            <span className={isDarkMode ? 'text-gray-500' : 'text-[#212529]/60'}>|</span>
                                            <span className={`font-medium ${
                                                isDarkMode ? 'text-gray-300' : 'text-[#212529]/80'
                                            }`}>{item.category}</span>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        className={`p-2 rounded-full transition-all duration-200 ${
                                            isDarkMode 
                                                ? 'text-gray-400 hover:text-[#3D348B] hover:bg-gray-700' 
                                                : 'text-[#212529]/60 hover:text-[#3D348B] hover:bg-gray-100'
                                        }`}
                                    >
                                        <FaShareAlt className="text-xl" />
                                    </motion.button>
                                </div>

                                {/* Metadata */}
                                <div className={`border-2 rounded-lg p-4 my-6 ${
                                    isDarkMode 
                                        ? 'border-gray-600 bg-gray-700' 
                                        : `${colorScheme.border} bg-gradient-to-r ${colorScheme.background}`
                                }`}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className={`text-sm mb-1 font-medium ${
                                                isDarkMode ? 'text-gray-400' : 'text-[#212529]/60'
                                            }`}>Location</p>
                                            <p className={`flex items-center font-semibold ${
                                                isDarkMode ? 'text-white' : 'text-[#212529]'
                                            }`}>
                                                <FaMapMarkerAlt className="mr-2" style={{ color: colorScheme.primary }} />
                                                {item.location}
                                            </p>
                                        </div>
                                        <div>
                                            <p className={`text-sm mb-1 font-medium ${
                                                isDarkMode ? 'text-gray-400' : 'text-[#212529]/60'
                                            }`}>{isLost ? 'Date Lost' : 'Date Found'}</p>
                                            <p className={`flex items-center font-semibold ${
                                                isDarkMode ? 'text-white' : 'text-[#212529]'
                                            }`}>
                                                <FaCalendarAlt className="mr-2" style={{ color: colorScheme.primary }} />
                                                {formatDate(item.date)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <h3 className={`text-xl font-semibold mb-3 flex items-center ${
                                        isDarkMode ? 'text-white' : 'text-[#212529]'
                                    }`}>
                                        <div 
                                            className="w-1 h-6 rounded-full mr-3"
                                            style={{ backgroundColor: colorScheme.primary }}
                                        ></div>
                                        Description
                                    </h3>
                                    <p className={`mb-4 leading-relaxed ${
                                        isDarkMode ? 'text-gray-300' : 'text-[#212529]/80'
                                    }`}>{item.fullDescription}</p>
                                    {item.additionalDetails && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {Object.entries(item.additionalDetails).map(([key, value]) => (
                                                <div key={key} className={`p-3 rounded-lg ${
                                                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                                }`}>
                                                    <p className={`text-sm font-medium ${
                                                        isDarkMode ? 'text-gray-400' : 'text-[#212529]/60'
                                                    }`}>{key}</p>
                                                    <p className={`font-semibold ${
                                                        isDarkMode ? 'text-white' : 'text-[#212529]'
                                                    }`}>{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Contact Info */}
                                <div 
                                    className="rounded-lg p-6 mb-6 border-2"
                                    style={{ 
                                        backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : colorScheme.primaryLight,
                                        borderColor: colorScheme.primary + '30'
                                    }}
                                >
                                    <h3 className={`text-xl font-semibold mb-3 flex items-center ${
                                        isDarkMode ? 'text-white' : 'text-[#212529]'
                                    }`}>
                                        <div 
                                            className="w-1 h-6 rounded-full mr-3"
                                            style={{ backgroundColor: colorScheme.primary }}
                                        ></div>
                                        Contact Information
                                    </h3>
                                    <p className={`mb-2 ${
                                        isDarkMode ? 'text-gray-300' : 'text-[#212529]/80'
                                    }`}>
                                        This item was {isLost ? 'reported' : 'found'} by <strong>{isLost ? item.reportedBy : item.foundBy}</strong> on {item.reportedDate}
                                    </p>
                                    <p className={`mb-4 ${
                                        isDarkMode ? 'text-gray-300' : 'text-[#212529]/80'
                                    }`}>{item.contactInfo}</p>
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
                                    <p className={`text-sm text-center mt-2 ${
                                        isDarkMode ? 'text-gray-400' : 'text-[#212529]/60'
                                    }`}>
                                        You must be logged in to contact
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className={`border-t-2 pt-4 ${
                                    isDarkMode ? 'border-gray-600' : colorScheme.border
                                }`}>
                                    <div className="flex flex-wrap gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`px-4 py-2 border-2 rounded-lg flex items-center transition-all duration-200 ${
                                                isDarkMode 
                                                    ? 'text-gray-300 hover:bg-gray-700 border-gray-600' 
                                                    : 'text-[#212529]/80 hover:bg-gray-50'
                                            }`}
                                            style={{ borderColor: isDarkMode ? undefined : colorScheme.primary + '30' }}
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