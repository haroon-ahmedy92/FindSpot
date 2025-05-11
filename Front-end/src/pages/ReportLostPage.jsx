import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaMapMarkerAlt, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';


const ReportForm = ({ type = "lost" }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    images: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    // Handle image upload logic
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
      <section className="py-12 bg-gradient-to-b from-[#F8F9FA] to-white">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Form Header */}
            <div
                className={`py-6 px-8 ${
                    type === "lost" ? "bg-[#F35B04]" : "bg-[#00AFB9]"
                } text-white`}
            >
              <h2 className="text-2xl font-bold">
                Report {type === "lost" ? "Lost" : "Found"} Item
              </h2>
              <p className="opacity-90">
                {type === "lost"
                    ? "Fill in details about the item you lost to help the community find it"
                    : "Provide information about the item you found to help return it"}
              </p>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-8">
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
                    placeholder={`Brief description of the ${type === "lost" ? "lost" : "found"} item`}
                    className="w-full px-4 py-3 rounded-lg border border-[#E9ECEF] focus:border-[#F35B04] focus:outline-none focus:ring-2 focus:ring-[#F35B04]/20"
                    required
                />
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
                    placeholder={`Provide specific details about the item (brand, color, distinguishing features, contents, etc.)`}
                    className="w-full px-4 py-3 rounded-lg border border-[#E9ECEF] focus:border-[#F35B04] focus:outline-none focus:ring-2 focus:ring-[#F35B04]/20"
                    required
                ></textarea>
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
                    className="w-full px-4 py-3 rounded-lg border border-[#E9ECEF] focus:border-[#F35B04] focus:outline-none focus:ring-2 focus:ring-[#F35B04]/20 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM3NzgxODIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDEwIDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_1rem]"
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

              {/* Location */}
              <div className="mb-6">
                <label className="block text-[#212529] font-medium mb-2">
                  {type === "lost" ? "Where did you lose it?" : "Where did you find it?"}*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder={`Specific location (e.g. "University Library, Room 203")`}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#E9ECEF] focus:border-[#F35B04] focus:outline-none focus:ring-2 focus:ring-[#F35B04]/20"
                      required
                  />
                </div>
              </div>

              {/* Date */}
              <div className="mb-6">
                <label className="block text-[#212529] font-medium mb-2">
                  {type === "lost" ? "When did you lose it?" : "When did you find it?"}*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#E9ECEF] focus:border-[#F35B04] focus:outline-none focus:ring-2 focus:ring-[#F35B04]/20 appearance-none"
                      required
                  />
                </div>
              </div>

              {/* Images */}
              <div className="mb-8">
                <label className="block text-[#212529] font-medium mb-2">
                  Upload Photos
                </label>
                <div className="border-2 border-dashed border-[#E9ECEF] rounded-lg p-6 text-center cursor-pointer hover:border-[#F35B04] transition-colors">
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
                      <p className="text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
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
              <div className="bg-[#F8F9FA] p-4 rounded-lg mb-8">
                <div className="flex items-start">
                  <FaInfoCircle className="text-[#3D348B] mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">
                    {type === "lost"
                        ? "For valuable items, we recommend contacting local authorities in addition to posting here. Never share sensitive personal information in public listings."
                        : "If you found identification documents, consider also contacting the issuing authority. For valuable items, you may want to verify ownership with specific details only the owner would know."}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-lg font-bold text-white ${
                      type === "lost" ? "bg-[#F35B04] hover:bg-[#d95203]" : "bg-[#00AFB9] hover:bg-[#0095a0]"
                  } transition-colors duration-300 shadow-md`}
              >
                {type === "lost" ? "Report Lost Item" : "Report Found Item"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
  );
};



export default ReportForm;
