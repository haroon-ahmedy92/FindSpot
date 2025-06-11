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