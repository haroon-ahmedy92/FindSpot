import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaCog, FaBell, FaEdit, FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import UserService from '../api/userService';
import { useAuth } from '../contexts/AuthContext';

const UserProfilePage = () => {
  const { isDarkMode } = useTheme();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { logout } = useAuth();

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // The response is already the data object due to axios interceptor
        const userData = await UserService.getUserProfile();
        console.log('User profile data:', userData);
        
        setUserProfile(userData);
        setUpdatedProfile(userData); // Initialize edit form with current values
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Failed to load your profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested preferences properties
    if (name.startsWith('preferences.')) {
      const prefName = name.split('.')[1];
      setUpdatedProfile({
        ...updatedProfile,
        preferences: {
          ...updatedProfile.preferences,
          [prefName]: e.target.checked
        }
      });
    } else {
      setUpdatedProfile({
        ...updatedProfile,
        [name]: value
      });
    }
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setSuccessMessage('');
    
    try {
      // Only send fields that can be updated
      const profileToUpdate = {
        name: updatedProfile.name,
        phone: updatedProfile.phone,
        location: updatedProfile.location,
        bio: updatedProfile.bio,
        avatarUrl: updatedProfile.avatarUrl,
        preferences: updatedProfile.preferences
      };
      
      const updatedUserProfile = await UserService.updateUserProfile(profileToUpdate);
      setUserProfile(updatedUserProfile);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setUpdateError('Failed to update profile. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${
        isDarkMode 
          ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
          : 'bg-gradient-to-b from-[#F8F9FA] to-white'
      }`}>
        <FaSpinner className="text-[#3D348B] text-4xl animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${
        isDarkMode 
          ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
          : 'bg-gradient-to-b from-[#F8F9FA] to-white'
      }`}>
        <div className={`p-6 rounded-lg border max-w-md ${
          isDarkMode 
            ? 'bg-red-900/30 border-red-600/30 text-red-300' 
            : 'bg-red-50 border-red-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-2 ${
            isDarkMode ? 'text-red-300' : 'text-red-700'
          }`}>Error</h2>
          <p className={isDarkMode ? 'text-red-400' : 'text-red-600'}>{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-[#3D348B] text-white rounded-lg hover:bg-[#2c2566] transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Add null check for userProfile
  if (!userProfile) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${
        isDarkMode 
          ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
          : 'bg-gradient-to-b from-[#F8F9FA] to-white'
      }`}>
        <div className={`text-center ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <h2 className="text-xl font-semibold mb-2">No Profile Data</h2>
          <p>Unable to load profile information.</p>
          <button 
            className="mt-4 px-4 py-2 bg-[#3D348B] text-white rounded-lg hover:bg-[#2c2566] transition-colors"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${
      isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
        : 'bg-gradient-to-b from-[#F8F9FA] to-white'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        {successMessage && (
          <div className={`border px-4 py-3 rounded-lg mb-6 flex justify-between ${
            isDarkMode 
              ? 'bg-green-900/30 border-green-600/30 text-green-300' 
              : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            {successMessage}
            <button 
              onClick={() => setSuccessMessage('')}
              className={`text-lg font-bold ${
                isDarkMode ? 'text-green-300 hover:text-green-200' : 'text-green-700 hover:text-green-600'
              }`}
            >
              &times;
            </button>
          </div>
        )}

        {/* Profile Header */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`shadow-xl rounded-2xl p-8 mb-10 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <div className="relative">
            <img
              src={userProfile.avatarUrl || `https://via.placeholder.com/150/3D348B/FFFFFF?Text=${userProfile.name?.charAt(0)}`}
              alt={userProfile.name}
              className="w-32 h-32 rounded-full border-4 border-[#F35B04] shadow-md object-cover"
            />
            {isEditing ? (
              <div className="mt-2">
                <input 
                  type="text" 
                  name="avatarUrl"
                  value={updatedProfile.avatarUrl || ''}
                  onChange={handleInputChange}
                  placeholder="Avatar URL"
                  className={`w-full text-sm border rounded px-2 py-1 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                />
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 bg-[#3D348B] text-white p-2 rounded-full shadow-md hover:bg-[#2c2566] transition-colors"
                title="Change Profile Picture"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit />
              </motion.button>
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={updatedProfile.name || ''}
                onChange={handleInputChange}
                className={`text-2xl font-bold border-b py-1 px-2 w-full ${
                  isDarkMode 
                    ? 'border-gray-600 bg-transparent text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-transparent text-gray-900'
                }`}
                placeholder="Your Name"
              />
            ) : (
              <h1 className={`text-4xl font-bold ${
                isDarkMode ? 'text-white' : 'text-[#212529]'
              }`}>{userProfile.name}</h1>
            )}
            
            {isEditing ? (
              <textarea
                name="bio"
                value={updatedProfile.bio || ''}
                onChange={handleInputChange}
                className={`text-md border rounded py-1 px-2 w-full mt-2 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
                placeholder="Brief bio"
                rows={2}
              />
            ) : (
              <p className={`text-md mt-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>{userProfile.bio || 'No bio provided'}</p>
            )}
            
            <div className="mt-4 flex justify-center md:justify-start space-x-3">
              {isEditing ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-[#00AFB9] to-[#3D348B] text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg flex items-center transition-all"
                    onClick={handleUpdateProfile}
                    disabled={updateLoading}
                  >
                    {updateLoading ? (
                      <><FaSpinner className="mr-2 animate-spin" /> Saving...</>
                    ) : (
                      <><FaEdit className="mr-2" /> Save Changes</>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-2 rounded-lg shadow-md flex items-center transition-all ${
                      isDarkMode 
                        ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' 
                        : 'bg-gray-200 text-[#212529] hover:bg-gray-300'
                    }`}
                    onClick={() => {
                      setIsEditing(false);
                      setUpdatedProfile(userProfile);
                    }}
                    disabled={updateLoading}
                  >
                    Cancel
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-[#F35B04] to-[#FFBE0B] text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg flex items-center transition-all"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit className="mr-2" /> Edit Profile
                </motion.button>
              )}
            </div>
            
            {updateError && (
              <div className={`mt-3 text-sm ${
                isDarkMode ? 'text-red-400' : 'text-red-600'
              }`}>{updateError}</div>
            )}
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
              className={`shadow-xl rounded-2xl p-8 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h2 className={`text-2xl font-semibold mb-6 border-b pb-3 ${
                isDarkMode 
                  ? 'text-white border-gray-700' 
                  : 'text-[#212529] border-gray-200'
              }`}>Personal Information</h2>
              <div className="space-y-5">
                <div className="flex items-center">
                  <FaEnvelope className="text-xl text-[#F35B04] mr-4" />
                  <div>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Email</p>
                    <p className={`text-md font-medium ${
                      isDarkMode ? 'text-white' : 'text-[#212529]'
                    }`}>{userProfile.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaPhone className="text-xl text-[#F35B04] mr-4" />
                  <div className="flex-1">
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Phone</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={updatedProfile.phone || ''}
                        onChange={handleInputChange}
                        className={`border rounded py-1 px-2 w-full ${
                          isDarkMode 
                            ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                            : 'border-gray-300 bg-white text-gray-900'
                        }`}
                        placeholder="Your Phone Number"
                      />
                    ) : (
                      <p className={`text-md font-medium ${
                        isDarkMode ? 'text-white' : 'text-[#212529]'
                      }`}>{userProfile.phone || 'Not Provided'}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-xl text-[#F35B04] mr-4" />
                  <div className="flex-1">
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Location</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={updatedProfile.location || ''}
                        onChange={handleInputChange}
                        className={`border rounded py-1 px-2 w-full ${
                          isDarkMode 
                            ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                            : 'border-gray-300 bg-white text-gray-900'
                        }`}
                        placeholder="Your Location"
                      />
                    ) : (
                      <p className={`text-md font-medium ${
                        isDarkMode ? 'text-white' : 'text-[#212529]'
                      }`}>{userProfile.location || 'Not Provided'}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-xl text-[#F35B04] mr-4" />
                  <div>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Joined</p>
                    <p className={`text-md font-medium ${
                      isDarkMode ? 'text-white' : 'text-[#212529]'
                    }`}>{formatDate(userProfile.joinDate)}</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Activity Summary */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`shadow-xl rounded-2xl p-8 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h2 className={`text-2xl font-semibold mb-6 border-b pb-3 ${
                isDarkMode 
                  ? 'text-white border-gray-700' 
                  : 'text-[#212529] border-gray-200'
              }`}>Activity Snapshot</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-orange-900/20' : 'bg-[#F35B04]/10'
                }`}>
                  <p className="text-3xl font-bold text-[#F35B04]">{userProfile.stats?.reportedLost || 0}</p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Items Reported Lost</p>
                </div>
                <div className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-cyan-900/20' : 'bg-[#00AFB9]/10'
                }`}>
                  <p className="text-3xl font-bold text-[#00AFB9]">{userProfile.stats?.reportedFound || 0}</p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Items Reported Found</p>
                </div>
                <div className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-purple-900/20' : 'bg-[#3D348B]/10'
                }`}>
                  <p className="text-3xl font-bold text-[#3D348B]">{userProfile.stats?.itemsResolved || 0}</p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Items Resolved</p>
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
              className={`shadow-xl rounded-2xl p-8 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h2 className={`text-2xl font-semibold mb-6 border-b pb-3 ${
                isDarkMode 
                  ? 'text-white border-gray-700' 
                  : 'text-[#212529] border-gray-200'
              }`}>Notification Settings</h2>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaBell className="text-xl text-[#3D348B] mr-3" />
                    <span className={`text-md ${
                      isDarkMode ? 'text-white' : 'text-[#212529]'
                    }`}>Email Notifications</span>
                  </div>
                  <label htmlFor="emailNotifications" className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      id="emailNotifications" 
                      name="preferences.emailNotifications"
                      className="sr-only peer" 
                      checked={updatedProfile.preferences?.emailNotifications || false}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    <div className={`w-11 h-6 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#F35B04] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F35B04] ${
                      isDarkMode ? 'bg-gray-600 after:border-gray-500' : 'bg-gray-200 after:border-gray-300'
                    }`}></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaBell className="text-xl text-[#3D348B] mr-3" />
                    <span className={`text-md ${
                      isDarkMode ? 'text-white' : 'text-[#212529]'
                    }`}>Push Notifications</span>
                  </div>
                  <label htmlFor="pushNotifications" className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      id="pushNotifications" 
                      name="preferences.pushNotifications"
                      className="sr-only peer" 
                      checked={updatedProfile.preferences?.pushNotifications || false}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    <div className={`w-11 h-6 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#F35B04] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F35B04] ${
                      isDarkMode ? 'bg-gray-600 after:border-gray-500' : 'bg-gray-200 after:border-gray-300'
                    }`}></div>
                  </label>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className={`shadow-xl rounded-2xl p-8 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h2 className={`text-2xl font-semibold mb-6 border-b pb-3 ${
                isDarkMode 
                  ? 'text-white border-gray-700' 
                  : 'text-[#212529] border-gray-200'
              }`}>Account Actions</h2>
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(243, 59, 4, 0.1)', color: '#F35B04' }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-center px-4 py-3 border rounded-lg hover:border-[#F35B04] transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-200' 
                      : 'border-gray-300 text-[#212529]'
                  }`}
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#DC2626' }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-center px-4 py-3 border rounded-lg hover:border-red-600 transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-red-400' 
                      : 'border-gray-300 text-red-600'
                  }`}
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
