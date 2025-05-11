// src/pages/ReportFoundPage.jsx
import React, { useState } from 'react';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ReportFoundPage = () => {
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.images.length > 3) {
            alert('Maximum 3 images allowed');
            return;
        }
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
        }));
    };

    const removeImage = (index) => {
        const newImages = [...formData.images];
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, 1);
        setFormData(prev => ({
            ...prev,
            images: newImages
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            console.log('Form submitted:', formData);
            // Add API call here
            // await submitFoundItem(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F8F9FA] to-white">

            <main className="flex-grow py-12">
                <div className="container max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                        {/* Form Header */}
                        <div className="bg-[#00AFB9] py-6 px-8 text-white">
                            <h2 className="text-2xl md:text-3xl font-bold text-center">
                                Report Found Item
                            </h2>
                            <p className="text-center opacity-90 mt-2">
                                Help reunite this item with its owner by providing detailed information
                            </p>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="p-6 md:p-8">
                            {/* Item Title */}
                            <div className="mb-6">
                                <label className="block text-[#212529] font-medium mb-2">
                                    Item Title*
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Brief description of the found item"
                                    className="w-full px-4 py-3 rounded-lg border border-[#E9ECEF] focus:border-[#00AFB9] focus:outline-none focus:ring-2 focus:ring-[#00AFB9]/20"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div className="mb-6">
                                <label className="block text-[#212529] font-medium mb-2">
                                    Category*
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-[#E9ECEF] focus:border-[#00AFB9] focus:outline-none focus:ring-2 focus:ring-[#00AFB9]/20 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM3NzgxODIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDEwIDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_1rem]"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="documents">Documents</option>
                                    <option value="wallets">Wallets/Purses</option>
                                    <option value="keys">Keys</option>
                                    <option value="bags">Bags/Backpacks</option>
                                    <option value="jewelry">Jewelry/Accessories</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <label className="block text-[#212529] font-medium mb-2">
                                    Detailed Description*
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Provide specific details about the item (brand, color, distinguishing features, etc.)"
                                    className="w-full px-4 py-3 rounded-lg border border-[#E9ECEF] focus:border-[#00AFB9] focus:outline-none focus:ring-2 focus:ring-[#00AFB9]/20"
                                    required
                                ></textarea>
                            </div>

                            {/* Location & Date */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-[#212529] font-medium mb-2">
                                        Where did you find it?*
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Specific location (e.g., University Library)"
                                        className="w-full px-4 py-3 rounded-lg border border-[#E9ECEF] focus:border-[#00AFB9] focus:outline-none focus:ring-2 focus:ring-[#00AFB9]/20"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#212529] font-medium mb-2">
                                        When did you find it?*
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-[#E9ECEF] focus:border-[#00AFB9] focus:outline-none focus:ring-2 focus:ring-[#00AFB9]/20"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Images */}
                            <div className="mb-6">
                                <label className="block text-[#212529] font-medium mb-2">
                                    Upload Photos (Max 3)
                                </label>
                                <div className="border-2 border-dashed border-[#E9ECEF] rounded-lg p-6 text-center cursor-pointer hover:border-[#00AFB9] transition-colors">
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
                                            <FaCloudUploadAlt className="text-3xl text-[#00AFB9]" />
                                            <p className="text-gray-600">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Upload clear photos of the item (max 3 photos, 5MB each)
                                            </p>
                                        </div>
                                    </label>
                                </div>
                                {formData.images.length > 0 && (
                                    <div className="flex flex-wrap gap-4 mt-4">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                                                <img
                                                    src={img.preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
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

                            {/* Item Status */}
                            <div className="mb-6">
                                <label className="block text-[#212529] font-medium mb-2">
                                    Current Item Status*
                                </label>
                                <div className="space-y-3">
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="with-me"
                                            checked={formData.status === 'with-me'}
                                            onChange={handleChange}
                                            className="h-5 w-5 text-[#00AFB9] focus:ring-[#00AFB9]"
                                        />
                                        <span>I'm keeping it safe</span>
                                    </label>
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="turned-in"
                                            checked={formData.status === 'turned-in'}
                                            onChange={handleChange}
                                            className="h-5 w-5 text-[#00AFB9] focus:ring-[#00AFB9]"
                                        />
                                        <span>Turned in to lost & found office</span>
                                    </label>
                                </div>
                            </div>

                            {/* Contact Preference */}
                            <div className="mb-6">
                                <label className="block text-[#212529] font-medium mb-2">
                                    Contact Preference*
                                </label>
                                <div className="space-y-3">
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name="contactPreference"
                                            value="email"
                                            checked={formData.contactPreference === 'email'}
                                            onChange={handleChange}
                                            className="h-5 w-5 text-[#00AFB9] focus:ring-[#00AFB9]"
                                        />
                                        <span>Email</span>
                                    </label>
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name="contactPreference"
                                            value="phone"
                                            checked={formData.contactPreference === 'phone'}
                                            onChange={handleChange}
                                            className="h-5 w-5 text-[#00AFB9] focus:ring-[#00AFB9]"
                                        />
                                        <span>Phone</span>
                                    </label>
                                    <label className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name="contactPreference"
                                            value="both"
                                            checked={formData.contactPreference === 'both'}
                                            onChange={handleChange}
                                            className="h-5 w-5 text-[#00AFB9] focus:ring-[#00AFB9]"
                                        />
                                        <span>Both</span>
                                    </label>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="mb-8">
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        name="agreedToTerms"
                                        checked={formData.agreedToTerms}
                                        onChange={handleChange}
                                        className="mt-1 h-5 w-5 text-[#00AFB9] focus:ring-[#00AFB9] rounded"
                                        required
                                    />
                                    <span className="ml-3 text-sm text-gray-600">
                    I confirm that all information provided is accurate and I agree to the{' '}
                                        <a href="#" className="text-[#00AFB9] hover:underline">Terms of Service</a> and{' '}
                                        <a href="#" className="text-[#00AFB9] hover:underline">Privacy Policy</a>.
                  </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-between">
                                <motion.button
                                    type="button"
                                    whileHover={{ x: -3 }}
                                    className="px-6 py-3 bg-white border-2 border-[#F35B04] text-[#F35B04] rounded-lg font-medium hover:bg-[#F35B04]/10 transition-colors"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isSubmitting}
                                    className="px-8 py-3 bg-[#00AFB9] hover:bg-[#0095a0] text-white rounded-lg font-bold shadow-md transition-colors duration-300 flex items-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        'Submit Found Item'
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </main>

        </div>
    );
};

export default ReportFoundPage;