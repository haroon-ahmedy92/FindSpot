import axiosInstance from './axiosInstance';

const ItemService = {
  // Get lost items with optional filtering and pagination
  getLostItems: async (params = {}) => {
    try {
      // Backend expects query parameters: category, location, page, limit
      const lostItems = await axiosInstance.get('/items/lost', { params });
      return lostItems; // Returns paginated response with content, totalPages, etc.
    } catch (error) {
      console.error('Error fetching lost items:', error);
      throw error;
    }
  },

  // Get found items with optional filtering and pagination
  getFoundItems: async (params = {}) => {
    try {
      // Backend expects query parameters: category, location, page, limit
      const foundItems = await axiosInstance.get('/items/found', { params });
      return foundItems; // Returns paginated response with content, totalPages, etc.
    } catch (error) {
      console.error('Error fetching found items:', error);
      throw error;
    }
  },

  // Get all items (both lost and found) - if your backend supports it
  getAllItems: async (params = {}) => {
    try {
      const items = await axiosInstance.get('/items', { params });
      return items;
    } catch (error) {
      console.error('Error fetching all items:', error);
      throw error;
    }
  },

  // Get a single item by its ID
  getItemById: async (itemId) => {
    try {
      const item = await axiosInstance.get(`/items/${itemId}`);
      return item;
    } catch (error) {
      console.error(`Error fetching item ${itemId}:`, error);
      throw error;
    }
  },

  // Report a lost item
  reportLostItem: async (itemData) => {
    try {
      // Backend expects: { title, description, category, location, date, images, additionalDetails }
      const reportedItem = await axiosInstance.post('/items/lost', itemData);
      return reportedItem; // Returns: { itemId, title, status }
    } catch (error) {
      console.error('Error reporting lost item:', error);
      throw error;
    }
  },

  // Report a found item
  reportFoundItem: async (itemData) => {
    try {
      // Backend expects: { title, category, description, location, date, images, status, contactPreference, agreedToTerms }
      const reportedItem = await axiosInstance.post('/items/found', itemData);
      return reportedItem; // Returns: { itemId, title, status }
    } catch (error) {
      console.error('Error reporting found item:', error);
      throw error;
    }
  },

  // Create a new item (generic endpoint if available)
  createItem: async (itemData) => {
    try {
      const newItem = await axiosInstance.post('/items', itemData);
      return newItem;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },

  // Update an existing item
  updateItem: async (itemId, itemData) => {
    try {
      // PUT request to update only the fields that changed
      // URL: http://localhost:8080/api/items/{itemId}
      // Only sends fields that need to be updated (title, location, additionalDetails)
      const updatedItem = await axiosInstance.put(`/items/${itemId}`, itemData);
      return updatedItem;
    } catch (error) {
      console.error(`Error updating item ${itemId}:`, error);
      throw error;
    }
  },

  // Delete an item
  deleteItem: async (itemId) => {
    try {
      await axiosInstance.delete(`/items/${itemId}`);
    } catch (error) {
      console.error(`Error deleting item ${itemId}:`, error);
      throw error;
    }
  },

  // Get items created by the current user (all of the user's items)
  getUserItems: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/items/my-items', { params });
      console.log('Raw API response from getUserItems:', response);
      // Normalize response format
      if (response && !response.content && Array.isArray(response)) {
        return { content: response };
      }
      return response;
    } catch (error) {
      console.error('Error fetching user items:', error);
      throw error;
    }
  },

  // Get items created by the current user (lost items)
  getMyLostItems: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/items/my-lost', { params });
      console.log('Raw API response from getMyLostItems:', response);
      // Normalize response format
      if (response && !response.content && Array.isArray(response)) {
        return { content: response };
      }
      return response;
    } catch (error) {
      console.error('Error fetching my lost items:', error);
      throw error;
    }
  },

  // Get items created by the current user (found items)
  getMyFoundItems: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/items/my-found', { params });
      console.log('Raw API response from getMyFoundItems:', response);
      // Normalize response format
      if (response && !response.content && Array.isArray(response)) {
        return { content: response };
      }
      return response;
    } catch (error) {
      console.error('Error fetching my found items:', error);
      throw error;
    }
  },

  // Get resolved items by the current user
  getMyResolvedItems: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/items/my-resolved', { params });
      console.log('Raw API response from getMyResolvedItems:', response);
      // Normalize response format
      if (response && !response.content && Array.isArray(response)) {
        return { content: response };
      }
      return response;
    } catch (error) {
      console.error('Error fetching my resolved items:', error);
      throw error;
    }
  },

  // Mark a lost item as found/resolved
  markItemAsFound: async (itemId) => {
    try {
      const result = await axiosInstance.patch(`/items/${itemId}/mark-found`);
      return result;
    } catch (error) {
      console.error(`Error marking item ${itemId} as found:`, error);
      throw error;
    }
  },

  // Mark a found item as returned/resolved
  markItemAsReturned: async (itemId) => {
    try {
      const result = await axiosInstance.patch(`/items/${itemId}/mark-returned`);
      return result;
    } catch (error) {
      console.error(`Error marking item ${itemId} as returned:`, error);
      throw error;
    }
  },

  // Update item status (e.g., CLAIMED, ACTIVE, etc.)
  updateItemStatus: async (itemId, status) => {
    try {
      const result = await axiosInstance.post(`/items/${itemId}/status`, { status });
      return result;
    } catch (error) {
      console.error(`Error updating item ${itemId} status:`, error);
      throw error;
    }
  }
};

export default ItemService;
