import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaMapMarkerAlt, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ItemService from '../api/itemService';

const ReportLostPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    images: [],
    additionalDetails: {
      brand: '',
      color: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: { pathname: '/report-lost' },
          message: 'Please log in to report a lost item' 
        } 
      });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccessMessage('');
  };

  const handleAdditionalDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      additionalDetails: {
        ...prev.additionalDetails,
        [name]: value
      }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      setError('Maximum 5 images allowed');
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
    setIsSubmitting(true);

    try {
      // Prepare data for backend
      const lostItemData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        date: formData.date,
        // Convert images to URLs (in production, you'd upload files first)
        images: formData.images.map(img => img.url || img.preview),
        additionalDetails: formData.additionalDetails
      };

      const response = await ItemService.reportLostItem(lostItemData);
      
      setSuccessMessage(`Successfully reported lost item! Item ID: ${response.itemId}`);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        location: '',
        date: '',
        images: [],
        additionalDetails: { brand: '', color: '' }
      });

      // Redirect to dashboard after success
      setTimeout(() => {
        navigate('/dashboard', { 
          state: { 
            message: `Lost item "${response.title}" has been reported successfully!` 
          }
        });
      }, 3000);

    } catch (submitError) {
      setError(submitError.message || 'Failed to report lost item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render form if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className={`py-12 ${
      isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
        : 'bg-gradient-to-b from-[#F8F9FA] to-white'
    }`}>
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl shadow-lg overflow-hidden ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          {/* Form Header */}
          <div className="py-6 px-8 bg-[#F35B04] text-white">
            <h2 className="text-2xl font-bold">Report Lost Item</h2>
            <p className="opacity-90">
              Fill in details about the item you lost to help the community find it
            </p>
          </div>

          {/* Success/Error Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 border-l-4 ${
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
              className={`p-4 border-l-4 ${
                isDarkMode 
                  ? 'bg-green-900/30 border-green-600/30 text-green-300' 
                  : 'bg-green-100 text-green-700 border-green-500'
              }`}
            >
              {successMessage}
            </motion.div>
          )}

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-8">
            {/* Item Title */}
            <div className="mb-6">
              <label className={`block font-medium mb-2 ${
                isDarkMode ? 'text-white' : 'text-[#212529]'
              }`}>
                Item Title*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief description of the lost item"
                className={`w-full px-4 py-3 rounded-lg border focus:border-[#F35B04] focus:outline-none focus:ring-2 focus:ring-[#F35B04]/20 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-[#E9ECEF] text-gray-900 placeholder-gray-500'
                }`}
                required
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className={`block font-medium mb-2 ${
                isDarkMode ? 'text-white' : 'text-[#212529]'
              }`}>
                Detailed Description*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Provide specific details about the item (brand, color, distinguishing features, contents, etc.)"
                className={`w-full px-4 py-3 rounded-lg border focus:border-[#F35B04] focus:outline-none focus:ring-2 focus:ring-[#F35B04]/20 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-[#E9ECEF] text-gray-900 placeholder-gray-500'
                }`}
                required
              ></textarea>
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className={`block font-medium mb-2 ${
                isDarkMode ? 'text-white' : 'text-[#212529]'
              }`}>
                Category*
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border focus:border-[#F35B04] focus:outline-none focus:ring-2 focus:ring-[#F35B04]/20 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM3NzgxODIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDEwIDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_1rem] ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-[#E9ECEF] text-gray-900'
                }`}
                required
              >
                <option value="">Select a category</option>
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

            {/* Location */}
            <div className="mb-6">
              <label className={`block font-medium mb-2 ${
                isDarkMode ? 'text-white' : 'text-[#212529]'
              }`}>
                Where did you lose it?*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} />
                </div>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder='Specific location (e.g. "University Library, Room 203")'
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:border-[#F35B04] focus:outline-none focus:ring-2 focus:ring-[#F35B04]/20 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-[#E9ECEF] text-gray-900 placeholder-gray-500'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div className="mb-6">
              <label className={`block font-medium mb-2 ${
                isDarkMode ? 'text-white' : 'text-[#212529]'
              }`}>
                When did you lose it?*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} />
                </div>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:border-[#F35B04] focus:outline-none focus:ring-2 focus:ring-[#F35B04]/20 appearance-none ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-[#E9ECEF] text-gray-900'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="mb-6">
              <label className={`block font-medium mb-2 ${
                isDarkMode ? 'text-white' : 'text-[#212529]'
              }`}>
                Additional Details
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="brand"
                    value={formData.additionalDetails.brand}
                    onChange={handleAdditionalDetailsChange}
                    placeholder="Brand (optional)"
                    className={`w-full px-4 py-3 rounded-lg border focus:border-[#F35B04] focus:outline-none focus:ring-2 focus:ring-[#F35B04]/20 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-[#E9ECEF] text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="color"
                    value={formData.additionalDetails.color}
                    onChange={handleAdditionalDetailsChange}
                    placeholder="Color (optional)"
                    className={`w-full px-4 py-3 rounded-lg border focus:border-[#F35B04] focus:outline-none focus:ring-2 focus:ring-[#F35B04]/20 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-[#E9ECEF] text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="mb-8">
              <label className={`block font-medium mb-2 ${
                isDarkMode ? 'text-white' : 'text-[#212529]'
              }`}>
                Upload Photos
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDarkMode 
                  ? 'border-gray-600 hover:border-[#F35B04]' 
                  : 'border-[#E9ECEF] hover:border-[#F35B04]'
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
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FaCamera className="text-3xl text-[#F35B04]" />
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      Click to upload or drag and drop
                    </p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Upload clear photos of the item (max 5 photos)
                    </p>
                  </div>
                </label>
              </div>
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <img src={img.preview} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className={`p-4 rounded-lg mb-8 ${
              isDarkMode ? 'bg-gray-700' : 'bg-[#F8F9FA]'
            }`}>
              <div className="flex items-start">
                <FaInfoCircle className="text-[#3D348B] mt-1 mr-3 flex-shrink-0" />
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  For valuable items, we recommend contacting local authorities in addition to posting here. Never share sensitive personal information in public listings.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-lg font-bold text-white bg-[#F35B04] hover:bg-[#d95203] transition-colors duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Reporting Item...
                </>
              ) : (
                'Report Lost Item'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ReportLostPage;
