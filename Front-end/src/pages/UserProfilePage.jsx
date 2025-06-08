import React from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaCog, FaBell, FaEdit, FaSignOutAlt } from 'react-icons/fa';

// Sample User Data - Replace with actual data from your context/API
const userProfile = {
  name: 'Haroon',
  email: 'haroon@example.com',
  phone: '+255 700 000 000',
  joinDate: 'June 1, 2024',
  location: 'Dodoma, Tanzania',
  bio: 'Passionate about connecting people and finding lost treasures. Student at The University of Dodoma.',
  avatarUrl: 'https://via.placeholder.com/150/3D348B/FFFFFF?Text=H', // Placeholder avatar
  stats: {
    reportedLost: 5,
    reportedFound: 3,
    itemsResolved: 8,
  },
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
  }
};

const UserProfilePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-2xl p-8 mb-10 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8"
        >
          <div className="relative">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-32 h-32 rounded-full border-4 border-[#F35B04] shadow-md"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-0 right-0 bg-[#3D348B] text-white p-2 rounded-full shadow-md hover:bg-[#2c2566]"
              title="Change Profile Picture"
            >
              <FaEdit />
            </motion.button>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-[#212529]">{userProfile.name}</h1>
            <p className="text-md text-gray-600 mt-1">{userProfile.bio}</p>
            <div className="mt-4 flex justify-center md:justify-start space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#F35B04] to-[#FFBE0B] text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg flex items-center"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-200 text-[#212529] px-6 py-2 rounded-lg shadow-md hover:bg-gray-300 flex items-center"
              >
                <FaCog className="mr-2" /> Account Settings
              </motion.button>
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: User Info & Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Information */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white shadow-xl rounded-2xl p-8"
            >
              <h2 className="text-2xl font-semibold text-[#212529] mb-6 border-b pb-3 border-gray-200">Personal Information</h2>
              <div className="space-y-5">
                <div className="flex items-center">
                  <FaEnvelope className="text-xl text-[#F35B04] mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-md text-[#212529] font-medium">{userProfile.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaPhone className="text-xl text-[#F35B04] mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-md text-[#212529] font-medium">{userProfile.phone || 'Not Provided'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-xl text-[#F35B04] mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-md text-[#212529] font-medium">{userProfile.location || 'Not Provided'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-xl text-[#F35B04] mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Joined</p>
                    <p className="text-md text-[#212529] font-medium">{userProfile.joinDate}</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Activity Summary */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white shadow-xl rounded-2xl p-8"
            >
              <h2 className="text-2xl font-semibold text-[#212529] mb-6 border-b pb-3 border-gray-200">Activity Snapshot</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="bg-[#F35B04]/10 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-[#F35B04]">{userProfile.stats.reportedLost}</p>
                  <p className="text-sm text-gray-600">Items Reported Lost</p>
                </div>
                <div className="bg-[#00AFB9]/10 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-[#00AFB9]">{userProfile.stats.reportedFound}</p>
                  <p className="text-sm text-gray-600">Items Reported Found</p>
                </div>
                <div className="bg-[#3D348B]/10 p-4 rounded-lg">
                  <p className="text-3xl font-bold text-[#3D348B]">{userProfile.stats.itemsResolved}</p>
                  <p className="text-sm text-gray-600">Items Resolved</p>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Right Column: Settings & Actions */}
          <div className="lg:col-span-1 space-y-8">
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white shadow-xl rounded-2xl p-8"
            >
              <h2 className="text-2xl font-semibold text-[#212529] mb-6 border-b pb-3 border-gray-200">Notification Settings</h2>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaBell className="text-xl text-[#3D348B] mr-3" />
                    <span className="text-md text-[#212529]">Email Notifications</span>
                  </div>
                  <label htmlFor="emailNotifications" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="emailNotifications" className="sr-only peer" defaultChecked={userProfile.preferences.emailNotifications} />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#F35B04] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F35B04]"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaBell className="text-xl text-[#3D348B] mr-3" />
                    <span className="text-md text-[#212529]">Push Notifications</span>
                  </div>
                  <label htmlFor="pushNotifications" className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="pushNotifications" className="sr-only peer" defaultChecked={userProfile.preferences.pushNotifications} />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#F35B04] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F35B04]"></div>
                  </label>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white shadow-xl rounded-2xl p-8"
            >
              <h2 className="text-2xl font-semibold text-[#212529] mb-6 border-b pb-3 border-gray-200">Account Actions</h2>
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(243, 59, 4, 0.1)', color: '#F35B04' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-[#212529] hover:border-[#F35B04] transition-colors"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </motion.button>
                 <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#DC2626' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-red-600 hover:border-red-600 transition-colors"
                >
                  Deactivate Account
                </motion.button>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
