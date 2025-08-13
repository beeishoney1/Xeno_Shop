import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const API_BASE_URL = 'https://beeishappy15.pythonanywhere.com';

// Updated API functions
async function fetchAPI(endpoint, method = 'GET', data = null, isFormData = false) {
  const headers = new Headers();
  if (!isFormData) headers.append('Content-Type', 'application/json');

  const requestOptions = {
    method: method.toUpperCase(),
    headers,
    mode: 'cors',
    redirect: 'follow',
    body: data ? (isFormData ? data : JSON.stringify(data)) : null
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    const responseClone = response.clone(); // Clone for error handling
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await responseClone.json();
      } catch {
        errorData = { message: await responseClone.text() || 'Request failed' };
      }
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Network connection failed. Please check your internet connection.');
    }
    throw error;
  }
}

const accountAPI = {
  getAllAccounts: async () => fetchAPI('/api/viewAccount'),
  getAccountById: async (id) => fetchAPI(`/api/viewAccountById/${id}`),
  createAccount: async (accountData) => {
    const isFormData = accountData instanceof FormData;
    return fetchAPI('/api/createAccount', 'POST', accountData, isFormData);
  },
  updateAccount: async (id, updateData) => {
    const isFormData = updateData instanceof FormData;
    return fetchAPI(`/api/editAccount/${id}`, 'PUT', updateData, isFormData);
  },
  deleteAccount: async (id) => fetchAPI(`/api/deleteAccount/${id}`, 'DELETE')
};

const altImageAPI = {
  getAllAltImages: async () => fetchAPI('/api/viewAllAltImages'),
  createAltImage: async (accountId, imageFile) => {
    const formData = new FormData();
    formData.append('account_id', accountId);
    formData.append('image', imageFile);
    return fetchAPI('/api/createAltImage', 'POST', formData, true);
  },
  deleteAltImage: async (id) => fetchAPI(`/api/deleteAltImage/${id}`, 'DELETE')
};

const AdminComponent = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    text: 'In Stock',
    imageFile: null,
    imagePreview: '',
    altImages: []
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const fileInputRef = useRef(null);
  const altFileInputRef = useRef(null);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => { fetchAccounts(); }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountAPI.getAllAccounts();
      setAccounts(response.accounts || []);
      setApiError(null);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setApiError(error.message || 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAltImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const newAltImages = await Promise.all(
        files.map(file => new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({
            file,
            preview: reader.result,
            isNew: true
          });
          reader.readAsDataURL(file);
        }))
      );

      setFormData(prev => ({
        ...prev,
        altImages: [...prev.altImages, ...newAltImages]
      }));
    } catch (error) {
      console.error('Error processing alt images:', error);
    }
  };

  const removeAltImage = (index) => {
    setFormData(prev => ({
      ...prev,
      altImages: prev.altImages.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.price || isNaN(formData.price)) errors.price = 'Valid price is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setApiError(null);
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', parseFloat(formData.price).toFixed(2));
      formDataToSend.append('text', formData.text);
      
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      } else if (editingId && formData.imagePreview) {
        formDataToSend.append('image_url', formData.imagePreview);
      }

      let accountId;
      if (editingId) {
        await accountAPI.updateAccount(editingId, formDataToSend);
        accountId = editingId;
      } else {
        const response = await accountAPI.createAccount(formDataToSend);
        accountId = response.account.id;
      }

      // Upload alt images sequentially
      for (const img of formData.altImages.filter(img => img.isNew)) {
        try {
          await altImageAPI.createAltImage(accountId, img.file);
        } catch (error) {
          console.error('Error uploading alt image:', error);
        }
      }

      resetForm();
      await fetchAccounts();
    } catch (error) {
      console.error('Error saving account:', error);
      setApiError(error.message || 'Failed to save account');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormErrors({});
    setFormData({
      name: '',
      description: '',
      price: '',
      text: 'In Stock',
      imageFile: null,
      imagePreview: '',
      altImages: []
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (altFileInputRef.current) altFileInputRef.current.value = '';
  };

  const handleEdit = async (account) => {
    try {
      setLoading(true);
      const altImagesResponse = await altImageAPI.getAllAltImages();
      const accountAltImages = altImagesResponse.alt_images?.filter(img => img.account_id === account.id) || [];
      
      setFormData({
        name: account.name || '',
        description: account.description || '',
        price: account.price || '',
        text: account.text || 'In Stock',
        imageFile: null,
        imagePreview: account.image || '',
        altImages: accountAltImages.map(img => ({
          id: img.id,
          preview: img.image,
          isNew: false
        }))
        
      });

      
      setEditingId(account.id);
      setShowForm(true);
    } catch (error) {
      console.error('Error loading alt images:', error);
      setApiError('Failed to load additional images');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await accountAPI.deleteAccount(id);
        await fetchAccounts();
        window.alert('Account deleted successfully');
      } catch (error) {
        console.error('Error deleting account:', error);
        setApiError(error.message || 'Failed to delete account');
      }
    }
  };

  const handleDeleteAltImage = async (imageId) => {
    try {
      await altImageAPI.deleteAltImage(imageId);
      setFormData(prev => ({
        ...prev,
        altImages: prev.altImages.filter(img => img.id !== imageId)
      }));
    } catch (error) {
      console.error('Error deleting alt image:', error);
      setApiError('Failed to delete additional image');
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.style.display = 'none';
    const parent = e.target.parentElement;
    parent.classList.add('bg-gray-700', 'flex', 'items-center', 'justify-center');
    parent.innerHTML = '<span class="text-gray-400 text-sm">No Image Available</span>';
  };

  const particles = Array.from({ length: isMobile ? 6 : 12 }).map((_, i) => ({
    id: i,
    size: Math.random() * (isMobile ? 2 : 3) + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * (isMobile ? 6 : 12) + 5,
    opacity: isMobile ? 0.1 : 0.2
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white overflow-hidden relative">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none backdrop-blur-sm">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, x: `${particle.x}%`, y: `${particle.y}%` }}
            animate={{
              opacity: [0, particle.opacity, 0],
              y: [`${particle.y}%`, `${particle.y + (isMobile ? 10 : 20)}%`],
              x: [`${particle.x}%`, `${particle.x + (Math.random() * 4 - 2)}%`]
            }}
            transition={{
              delay: particle.delay,
              duration: particle.duration,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear"
            }}
            className="absolute rounded-full bg-purple-400/20"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-screen">
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="relative w-16 h-16 mb-4"
            >
              <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 border-r-blue-500 rounded-full" />
            </motion.div>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-gray-300"
            >
              Loading...
            </motion.p>
          </div>
        ) : (
          <div className="container mx-auto px-3 py-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mb-6 px-2"
            >
              <h1 className="text-xl sm:text-2xl font-bold">Account Manager</h1>
              <motion.button
                onClick={() => setShowForm(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm"
              >
                + New Account
              </motion.button>
            </motion.div>

            {/* API Error Message */}
            {apiError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                <p className="text-red-300 text-xs sm:text-sm">{apiError}</p>
              </div>
            )}

            {/* Account Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 sm:p-5 w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-700"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg sm:text-xl font-bold">
                      {editingId ? 'Edit Account' : 'New Account'}
                    </h2>
                    <button 
                      onClick={resetForm}
                      className="text-gray-400 hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    {/* Main Image Upload */}
                    <div>
                      <label className="block text-xs sm:text-sm mb-1">Main Image</label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="w-full text-xs sm:text-sm text-gray-300"
                      />
                      {formData.imagePreview && (
                        <div className="mt-2 w-full h-24 sm:h-32 bg-gray-700/50 rounded-lg overflow-hidden">
                          <img
                            src={formData.imagePreview.startsWith('blob:') 
                                 ? formData.imagePreview 
                                 : `https://beeishappy15.pythonanywhere.com${formData.imagePreview}`}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Alt Images Section */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs sm:text-sm">Additional Images ({formData.altImages.length})</label>
                        <button
                          type="button"
                          onClick={() => altFileInputRef.current.click()}
                          className="text-xs sm:text-sm bg-blue-600/80 hover:bg-blue-500 px-2 py-1 rounded"
                        >
                          + Add Images
                        </button>
                        <input
                          type="file"
                          ref={altFileInputRef}
                          onChange={handleAltImageChange}
                          accept="image/*"
                          multiple
                          className="hidden"
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                        {formData.altImages.map((img, index) => (
                          <div key={img.id || index} className="relative group">
                            <div className="aspect-square bg-gray-700 rounded overflow-hidden">
                              <img
                                src={img.preview.startsWith('blob:') 
                                     ? img.preview 
                                     : `https://beeishappy15.pythonanywhere.com${img.preview}`}
                                alt={`Additional ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => img.id ? handleDeleteAltImage(img.id) : removeAltImage(index)}
                              className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-400 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Name Field */}
                    <div>
                      <label className="block text-xs sm:text-sm mb-1">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full bg-gray-700/70 rounded-lg p-2 text-xs sm:text-sm border ${formErrors.name ? 'border-red-500' : 'border-gray-600'}`}
                        required
                      />
                      {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
                    </div>

                    {/* Description Field */}
                    <div>
                      <label className="block text-xs sm:text-sm mb-1">Description *</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className={`w-full bg-gray-700/70 rounded-lg p-2 text-xs sm:text-sm border ${formErrors.description ? 'border-red-500' : 'border-gray-600'}`}
                        rows="3"
                        required
                      />
                      {formErrors.description && <p className="text-red-400 text-xs mt-1">{formErrors.description}</p>}
                    </div>

                    {/* Price and Status Fields */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm mb-1">Price *</label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price || ''}
                          onChange={handleInputChange}
                          className={`w-full bg-gray-700/70 rounded-lg p-2 text-xs sm:text-sm border ${formErrors.price ? 'border-red-500' : 'border-gray-600'}`}
                          min="0"
                          step="0.01"
                          required
                        />
                        {formErrors.price && <p className="text-red-400 text-xs mt-1">{formErrors.price}</p>}
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm mb-1">Status</label>
                        <select
                          name="text"
                          value={formData.text}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700/70 rounded-lg p-2 text-xs sm:text-sm border border-gray-600"
                        >
                          <option value="In Stock">In Stock</option>
                          <option value="Sold Out">Sold Out</option>
                        </select>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-2 pt-3">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gray-600/80 text-xs sm:text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-xs sm:text-sm"
                      >
                        {editingId ? 'Update' : 'Create'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {/* Accounts Grid */}
            <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'} gap-4 px-2`}>
              {accounts.map((account) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800/70 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700"
                >
                  <div className="relative h-32 w-full overflow-hidden">
                    {account.image ? (
                      <img
                        src={`https://beeishappy15.pythonanywhere.com${account.image}`}
                        alt={account.name}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {account.price?.toFixed(0)} Ks
                    </div>
                    <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${
                      account.text?.includes('Sold') ? 'bg-red-500/90' : 'bg-green-500/90'
                    }`}>
                      {account.text || 'In Stock'}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm mb-1 truncate">{account.name}</h3>
                    <p className="text-gray-300 text-xs mb-3 line-clamp-2">{account.description}</p>
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={() => handleEdit(account)}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 py-1.5 rounded-lg bg-blue-600/90 text-white text-xs"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(account.id)}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 py-1.5 rounded-lg bg-red-600/90 text-white text-xs"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComponent;

