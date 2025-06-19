import axiosInstance from './axiosInstance';

const UserService = {
  /**
   * Get the current user's profile information
   * 
   * @returns {Promise} User profile data
   */
  getUserProfile: async () => {
    try {
      const response = await axiosInstance.get('/users/profile');
      console.log('Raw user profile response:', response);
      
      // Return the data directly
      return response;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Update the current user's profile information
   * 
   * @param {Object} profileData - User profile data to update
   * @returns {Promise} Updated user profile
   */
  updateUserProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put('/users/profile', profileData);
      console.log('Raw profile update response:', response);
      
      // Return the data directly
      return response;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  /**
   * Update user profile (alias for updateUserProfile for settings page compatibility)
   * 
   * @param {Object} profileData - User profile data to update
   * @returns {Promise} Updated user profile
   */
  updateProfile: async (profileData) => {
    return UserService.updateUserProfile(profileData);
  },

  /**
   * Change user password
   * 
   * @param {Object} passwordData - Object containing currentPassword and newPassword
   * @returns {Promise} Success response
   */
  changePassword: async (passwordData) => {
    try {
      const response = await axiosInstance.put('/users/change-password', passwordData);
      console.log('Password changed successfully');
      return response;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  /**
   * Get user settings (notifications, privacy, display preferences)
   * 
   * @returns {Promise} User settings object
   */
  getUserSettings: async () => {
    try {
      const response = await axiosInstance.get('/users/settings');
      console.log('Raw user settings response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
  },

  /**
   * Get user notification settings
   * 
   * @returns {Promise} User notification settings
   */
  getNotificationSettings: async () => {
    try {
      const response = await axiosInstance.get('/users/settings/notifications');
      console.log('Raw notification settings response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  },

  /**
   * Get user privacy settings
   * 
   * @returns {Promise} User privacy settings
   */
  getPrivacySettings: async () => {
    try {
      const response = await axiosInstance.get('/users/settings/privacy');
      console.log('Raw privacy settings response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
      throw error;
    }
  },

  /**
   * Get user display settings
   * 
   * @returns {Promise} User display settings
   */
  getDisplaySettings: async () => {
    try {
      const response = await axiosInstance.get('/users/settings/display');
      console.log('Raw display settings response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching display settings:', error);
      throw error;
    }
  },

  /**
   * Update notification settings
   * 
   * @param {Object} notificationSettings - Notification preferences
   * @returns {Promise} Updated settings
   */
  updateNotificationSettings: async (notificationSettings) => {
    try {
      const response = await axiosInstance.put('/users/settings/notifications', notificationSettings);
      console.log('Notification settings updated');
      return response;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },

  /**
   * Update privacy settings
   * 
   * @param {Object} privacySettings - Privacy preferences
   * @returns {Promise} Updated settings
   */
  updatePrivacySettings: async (privacySettings) => {
    try {
      const response = await axiosInstance.put('/users/settings/privacy', privacySettings);
      console.log('Privacy settings updated');
      return response;
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      throw error;
    }
  },

  /**
   * Update display settings
   * 
   * @param {Object} displaySettings - Display preferences
   * @returns {Promise} Updated settings
   */
  updateDisplaySettings: async (displaySettings) => {
    try {
      const response = await axiosInstance.put('/users/settings/display', displaySettings);
      console.log('Display settings updated');
      return response;
    } catch (error) {
      console.error('Error updating display settings:', error);
      throw error;
    }
  },

  /**
   * Delete user account
   * 
   * @returns {Promise} Success response
   */
  deleteAccount: async () => {
    try {
      const response = await axiosInstance.delete('/users/account');
      console.log('Account deleted successfully');
      return response;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },

  /**
   * Save/bookmark or unsave an item
   * 
   * @param {number} itemId - ID of the item to save/unsave
   * @returns {Promise} Success message
   */
  saveItem: async (itemId) => {
    try {
      const response = await axiosInstance.post(`/users/items/${itemId}/save`);
      return response;
    } catch (error) {
      console.error(`Error saving item ${itemId}:`, error);
      throw error;
    }
  },

  /**
   * Get user statistics
   * 
   * @returns {Promise} User statistics including active lost/found items and resolved items
   */
  getUserStats: async () => {
    try {
      const response = await axiosInstance.get('/users/stats');
      console.log('Raw user stats response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }
};

export default UserService;