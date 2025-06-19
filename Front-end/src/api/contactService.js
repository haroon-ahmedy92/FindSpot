import axiosInstance from './axiosInstance';

const ContactService = {
  // Submit contact form
  submitContactForm: async (formData) => {
    try {
      const response = await axiosInstance.post('/contact', formData);
      return response;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },

  // Get contact information
  getContactInfo: async () => {
    try {
      const response = await axiosInstance.get('/contact/info');
      return response;
    } catch (error) {
      console.error('Error fetching contact info:', error);
      throw error;
    }
  },

  // Subscribe to newsletter
  subscribeNewsletter: async (email) => {
    try {
      const response = await axiosInstance.post('/contact/newsletter', { email });
      return response;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  }
};

export default ContactService;
