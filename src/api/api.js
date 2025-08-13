import axios from "axios";

const API_BASE_URL = 'https://beeishappy15.pythonanywhere.com';

/**
 * Universal API fetch handler with proper CORS and error handling
 * @param {string} endpoint - API endpoint
 * @param {string} [method='GET'] - HTTP method
 * @param {Object|FormData} [data=null] - Request payload
 * @param {boolean} [isFormData=false] - Whether data is FormData
 * @returns {Promise<Object>} - Parsed JSON response
 * @throws {Error} - Custom error with status and message
 */
async function fetchAPI(endpoint, method = 'GET', data = null, isFormData = false) {
  // Configure headers
  const headers = new Headers();
  if (!isFormData) {
    headers.append('Content-Type', 'application/json');
  }

  // Configure request options
  const requestOptions = {
    method: method.toUpperCase(),
    headers,
    mode: 'cors', // Essential for CORS requests
    redirect: 'follow'
  };

  // Add body if present
  if (data) {
    requestOptions.body = isFormData ? data : JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
       
    // Handle HTTP errors
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: await response.text() || 'Request failed' };
      }

      const error = new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // Parse successful response
    return await response.json();
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    
    // Enhance network errors
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Network connection failed. Please check your internet connection.');
    }

    throw error;
  }
}

// Account API Methods
export const accountAPI = {
  /**
   * Get all accounts
   * @returns {Promise<{accounts: Array}>}
   */
  getAllAccounts: async () => {
    return fetchAPI('/api/viewAccount');
  },

  /**
   * Get account by ID
   * @param {number|string} id - Account ID
   * @returns {Promise<{account: Object}>}
   */
  getAccountById: async (id) => {

    return fetchAPI(`/api/viewAccountById/${id}`);
  },

  /**
   * Create new account
   * @param {Object|FormData} accountData - Account data
   * @returns {Promise<{account: Object}>}
   */
  createAccount: async (accountData) => {
    const isFormData = accountData instanceof FormData;
    return fetchAPI('/api/createAccount', 'POST', accountData, isFormData);
  },

  /**
   * Update existing account
   * @param {number|string} id - Account ID
   * @param {Object|FormData} updateData - Update data
   * @returns {Promise<{account: Object}>}
   */
  updateAccount: async (id, updateData) => {
    const isFormData = updateData instanceof FormData;
    return fetchAPI(`/api/editAccount/${id}`, 'PUT', updateData, isFormData);
  },

  /**
   * Delete account
   * @param {number|string} id - Account ID
   * @returns {Promise<{message: string}>}
   */
  deleteAccount: async (id) => {
    return fetchAPI(`/api/deleteAccount/${id}`, 'DELETE');
  }
};

// AltImage API Methods
export const altImageAPI = {
  getAllAltImages: async () => {
    return fetchAPI('/api/viewAllAltImages');
  },

  getAltImageById: async (id) => {
    return fetchAPI(`/api/viewAltImage/${id}`);
  },

  createAltImage: async (imageData) => {
    const isFormData = imageData instanceof FormData;
    return fetchAPI('/api/createAltImage', 'POST', imageData, isFormData);
  },

  updateAltImage: async (id, updateData) => {
    const isFormData = updateData instanceof FormData;
    return fetchAPI(`/api/editAltImage/${id}`, 'PUT', updateData, isFormData);
  },

  deleteAltImage: async (id) => {
    return fetchAPI(`/api/deleteAltImage/${id}`, 'DELETE');
  }
};
