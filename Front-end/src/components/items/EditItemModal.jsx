import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const EditItemModal = ({ item, isOpen, onClose, onSave }) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    category: '',
    additionalDetails: {}
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item && isOpen) {
      setFormData({
        title: item.title || '',
        location: item.location || '',
        description: item.description || '',
        category: item.category || '',
        additionalDetails: item.additionalDetails || {}
      });
      setErrors({});
    }
  }, [item, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('additionalDetails.')) {
      const key = name.replace('additionalDetails.', '');
      setFormData(prev => ({
        ...prev,
        additionalDetails: {
          ...prev.additionalDetails,
          [key]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Only send fields that have actually changed
      const updatedFields = {};
      if (formData.title !== item.title) updatedFields.title = formData.title;
      if (formData.location !== item.location) updatedFields.location = formData.location;
      if (formData.description !== item.description) updatedFields.description = formData.description;
      if (formData.category !== item.category) updatedFields.category = formData.category;
      
      // Check if additionalDetails changed
      const originalDetails = item.additionalDetails || {};
      const newDetails = formData.additionalDetails || {};
      if (JSON.stringify(originalDetails) !== JSON.stringify(newDetails)) {
        updatedFields.additionalDetails = newDetails;
      }
      
      await onSave(item.itemId, updatedFields);
      onClose();
    } catch (error) {
      console.error('Error updating item:', error);
      setErrors({ submit: 'Failed to update item. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Electronics',
    'Clothing',
    'Accessories',
    'Documents',
    'Keys',
    'Bags',
    'Books',
    'Sports Equipment',
    'Jewelry',
    'Other'
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Blurred backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        ></div>
        
        {/* Modal content - solid, not blurred */}
        <motion.div
          className={`rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto z-10 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Edit Item</h2>
              <button
                onClick={onClose}
                className={`transition-colors ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-200' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                disabled={loading}
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-400 focus:border-blue-400'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                  } ${
                    errors.title 
                      ? 'border-red-500' 
                      : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-400 focus:border-blue-400'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                  } ${
                    errors.location 
                      ? 'border-red-500' 
                      : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-400 focus:border-blue-400'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                  } ${
                    errors.category 
                      ? 'border-red-500' 
                      : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-400 focus:border-blue-400'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  disabled={loading}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Additional Details (Color, Brand, etc.)
                </label>
                <input
                  type="text"
                  name="additionalDetails.color"
                  value={formData.additionalDetails.color || ''}
                  onChange={handleInputChange}
                  placeholder="Color"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 mb-2 transition-colors ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  disabled={loading}
                />
                <input
                  type="text"
                  name="additionalDetails.brand"
                  value={formData.additionalDetails.brand || ''}
                  onChange={handleInputChange}
                  placeholder="Brand"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  disabled={loading}
                />
              </div>

              {errors.submit && (
                <div className={`border rounded-lg p-3 ${
                  isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
                }`}>
                  <p className="text-red-500 text-sm">{errors.submit}</p>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                    isDarkMode
                      ? 'border-gray-600 text-gray-200 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditItemModal;