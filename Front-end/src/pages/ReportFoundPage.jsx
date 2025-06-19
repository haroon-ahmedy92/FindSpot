// src/pages/ReportFoundPage.jsx
import React, { useState } from 'react';
import { FaCloudUploadAlt, FaTimes, FaArrowRight, FaInfoCircle, FaMapMarkerAlt, FaCalendarAlt, FaImage, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ItemService from '../api/itemService';

const ReportFoundPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { isDarkMode } = useTheme();
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        location: '',
        date: '',
        images: [],
        status: 'with-me',
        contactPreference: 'email',
        agreedToTerms: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Redirect to login if not authenticated
    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { 
                state: { 
                    from: { pathname: '/report-found' },
                    message: 'Please log in to report a found item' 
                } 
            });
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setError('');
        setSuccessMessage('');
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.images.length > 3) {
            setError('Maximum 3 images allowed');
            return;
        }

        // For demo purposes, we'll use URLs. In production, you'd upload to a service
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            // In production, you'd upload the file and get back a URL
            url: `http://example.com/${file.name}` // Placeholder URL
        }));

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
        }));
    };

    const removeImage = (index) => {
        const newImages = [...formData.images];
        if (newImages[index].preview) {
            URL.revokeObjectURL(newImages[index].preview);
        }
        newImages.splice(index, 1);
        setFormData(prev => ({
            ...prev,
            images: newImages
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.agreedToTerms) {
            setError('Please agree to the terms and conditions');
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare data for backend
            const foundItemData = {
                title: formData.title,
                category: formData.category,
                description: formData.description,
                location: formData.location,
                date: formData.date,
                // Convert images to URLs (in production, you'd upload files first)
                images: formData.images.map(img => img.url || img.preview),
                status: formData.status,
                contactPreference: formData.contactPreference,
                agreedToTerms: formData.agreedToTerms
            };

            const response = await ItemService.reportFoundItem(foundItemData);
            
            setSuccessMessage(`Successfully reported found item! Item ID: ${response.itemId}`);
            
            // Reset form
            setFormData({
                title: '',
                category: '',
                description: '',
                location: '',
                date: '',
                images: [],
                status: 'with-me',
                contactPreference: 'email',
                agreedToTerms: false
            });

            // Redirect to dashboard after success
            setTimeout(() => {
                navigate('/dashboard', { 
                    state: { 
                        message: `Found item "${response.title}" has been reported successfully!` 
                    }
                });
            }, 3000);

        } catch (submitError) {
            setError(submitError.message || 'Failed to report found item. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Don't render form if not authenticated (will redirect)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="container max-w-5xl mx-auto px-4 py-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                >
                    <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Report Found Item
                    </h1>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Help reunite this item with its owner
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Form Fields */}
                    <div className="lg:col-span-2">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className={`rounded-xl shadow-md overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                        >
                            {/* Form Header */}
                            <div className="bg-[#00AFB9] py-3 px-4 text-white">
                                <h2 className="text-lg font-semibold">
                                    Item Details
                                </h2>
                            </div>

                            {/* Success/Error Messages */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-2 border-l-4 text-xs ${
                                        isDarkMode 
                                            ? 'bg-red-900/30 border-red-600/30 text-red-300' 
                                            : 'bg-red-100 text-red-700 border-red-500'
                                    }`}
                                >
                                    {error}
                                </motion.div>
                            )}
                            {successMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-2 border-l-4 text-xs ${
                                        isDarkMode 
                                            ? 'bg-green-900/30 border-green-600/30 text-green-300' 
                                            : 'bg-green-100 text-green-700 border-green-500'
                                    }`}
                                >
                                    {successMessage}
                                </motion.div>
                            )}

                            {/* Form Content */}
                            <form onSubmit={handleSubmit} className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Title */}
                                    <div className="mb-3">
                                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                            Item Title*
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Brief description"
                                            className={`w-full px-3 py-2 text-sm rounded-lg border focus:border-[#00AFB9] focus:outline-none focus:ring-1 focus:ring-[#00AFB9]/20 ${
                                                isDarkMode 
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                    : 'bg-white border-[#E9ECEF] text-gray-900 placeholder-gray-500'
                                            }`}
                                            required
                                        />
                                    </div>

                                    {/* Category */}
                                    <div className="mb-3">
                                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                            Category*
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 text-sm rounded-lg border focus:border-[#00AFB9] focus:outline-none focus:ring-1 focus:ring-[#00AFB9]/20 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM3NzgxODIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDEwIDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_1rem] ${
                                                isDarkMode 
                                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                                    : 'bg-white border-[#E9ECEF] text-gray-900'
                                            }`}
                                            required
                                        >
                                            <option value="">Select category</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Documents">Documents</option>
                                            <option value="Wallet">Wallets/Purses</option>
                                            <option value="Keys">Keys</option>
                                            <option value="Bags">Bags/Backpacks</option>
                                            <option value="Jewelry">Jewelry/Accessories</option>
                                            <option value="Clothing">Clothing</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-3">
                                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        <FaInfoCircle className="inline-block mr-1 text-xs text-[#00AFB9]" /> Description*
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Color, brand, distinguishing features"
                                        className={`w-full px-3 py-2 text-sm rounded-lg border focus:border-[#00AFB9] focus:outline-none focus:ring-1 focus:ring-[#00AFB9]/20 ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                : 'bg-white border-[#E9ECEF] text-gray-900 placeholder-gray-500'
                                        }`}
                                        required
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Location */}
                                    <div className="mb-3">
                                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                            <FaMapMarkerAlt className="inline-block mr-1 text-xs text-[#00AFB9]" /> Location Found*
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="Where did you find it?"
                                            className={`w-full px-3 py-2 text-sm rounded-lg border focus:border-[#00AFB9] focus:outline-none focus:ring-1 focus:ring-[#00AFB9]/20 ${
                                                isDarkMode 
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                    : 'bg-white border-[#E9ECEF] text-gray-900 placeholder-gray-500'
                                            }`}
                                            required
                                        />
                                    </div>

                                    {/* Date */}
                                    <div className="mb-3">
                                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                            <FaCalendarAlt className="inline-block mr-1 text-xs text-[#00AFB9]" /> Date Found*
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 text-sm rounded-lg border focus:border-[#00AFB9] focus:outline-none focus:ring-1 focus:ring-[#00AFB9]/20 ${
                                                isDarkMode 
                                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                                    : 'bg-white border-[#E9ECEF] text-gray-900'
                                            }`}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Status & Contact Preference in one row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                    {/* Current Status */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                            Current Status*
                                        </label>
                                        <div className="space-y-2 text-sm">
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="with-me"
                                                    checked={formData.status === 'with-me'}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-[#00AFB9]"
                                                />
                                                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>I'm keeping it safe</span>
                                            </label>
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="turned-in"
                                                    checked={formData.status === 'turned-in'}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-[#00AFB9]"
                                                />
                                                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Turned in to lost & found</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Contact Preference */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                            Contact Preference
                                        </label>
                                        <select
                                            name="contactPreference"
                                            value={formData.contactPreference}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 text-sm rounded-lg border focus:border-[#00AFB9] focus:outline-none focus:ring-1 focus:ring-[#00AFB9]/20 appearance-none ${
                                                isDarkMode 
                                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                                    : 'bg-white border-[#E9ECEF] text-gray-900'
                                            }`}
                                        >
                                            <option value="email">Email</option>
                                            <option value="phone">Phone</option>
                                            <option value="app">In-App Messages Only</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>

                    {/* Right Column - Images and Submit */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className={`rounded-xl shadow-md overflow-hidden mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                        >
                            <div className="bg-[#00AFB9] py-3 px-4 text-white">
                                <h2 className="text-lg font-semibold flex items-center">
                                    <FaImage className="mr-2" /> Photos
                                </h2>
                            </div>
                            <div className="p-4">
                                <div className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors ${
                                    isDarkMode 
                                        ? 'border-gray-600 hover:border-[#00AFB9]' 
                                        : 'border-[#E9ECEF] hover:border-[#00AFB9]'
                                }`}>
                                    <input
                                        type="file"
                                        id="item-images"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                    />
                                    <label htmlFor="item-images" className="cursor-pointer">
                                        <div className="flex flex-col items-center justify-center py-2">
                                            <FaCloudUploadAlt className="text-2xl text-[#00AFB9]" />
                                            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                Upload Images (Max 3)
                                            </p>
                                        </div>
                                    </label>
                                </div>
                                {formData.images.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className={`relative w-full rounded-lg overflow-hidden border ${
                                                isDarkMode ? 'border-gray-600' : 'border-gray-200'
                                            } mb-2`}>
                                                <img
                                                    src={img.preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-32 object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                >
                                                    <FaTimes className="text-xs" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className={`rounded-xl shadow-md overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                        >
                            <div className="p-4">
                                <label className="flex items-start space-x-2 mb-4 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="agreedToTerms"
                                        checked={formData.agreedToTerms}
                                        onChange={handleChange}
                                        className="mt-0.5 h-4 w-4 text-[#00AFB9] rounded"
                                    />
                                    <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        I confirm this report is accurate and I agree to the <a href="/terms" className="text-[#00AFB9]">Terms of Service</a> and <a href="/privacy" className="text-[#00AFB9]">Privacy Policy</a>.
                                    </span>
                                </label>

                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`w-full py-2 px-4 rounded-lg flex items-center justify-center ${
                                        isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00AFB9] hover:bg-[#009ca5]'
                                    } text-white font-medium transition-colors`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FaCloudUploadAlt className="animate-spin mr-2" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Report 
                                            <FaArrowRight className="ml-2" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportFoundPage;
