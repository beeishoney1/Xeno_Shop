import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { accountAPI, altImageAPI } from '../api/api.js';
import testimg from '../img/testimg.jpg';

const AccountDetailsModal = ({ account, onClose }) => {
  const [altImages, setAltImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState(new Set());
  const [accountDetails, setAccountDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoadingImages(true);
        setLoadingDetails(true);

        const imagesResponse = await altImageAPI.getAllAltImages();
        const imagesData = imagesResponse?.alt_images || [];
        
        const accountImages = imagesData.filter(img => 
          img?.accountId === account?.id || 
          img?.account_id === account?.id ||
          img?.account === account?.id
        );

        const processedImages = accountImages.map(img => ({
          id: img.id,
          url: img.image_url || img.url || img.image,
          accountId: img.account_id || img.accountId || img.account
        }));

        setAltImages(processedImages);

        const detailsResponse = await accountAPI.getAccountById(account?.id);
        setAccountDetails(detailsResponse?.account || null);

      } catch (error) {
        console.error('Error fetching data:', error);
        setAltImages([]);
        setAccountDetails(null);
      } finally {
        setLoadingImages(false);
        setLoadingDetails(false);
      }
    };

    if (account?.id) {
      fetchAllData();
    }
  }, [account?.id]);

  const handleImageError = (imageId) => {
    setFailedImages(prev => new Set(prev.add(imageId)));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return testimg;
    if (failedImages.has(imagePath)) return testimg;
    return imagePath.startsWith('http') ? imagePath : `https://beeishappy15.pythonanywhere.com${imagePath}`;
  };

  const openImageModal = (image, index = 0) => {
    if (!image) return;
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const navigateImages = (direction) => {
    const images = getAllImages();
    if (images.length === 0) return;
    
    let newIndex = currentImageIndex + direction;
    newIndex = (newIndex < 0) ? images.length - 1 : (newIndex >= images.length) ? 0 : newIndex;
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const getAllImages = () => {
    return [
      account?.image,
      ...altImages.map(img => img?.url)
    ].filter(Boolean);
  };

  const allImages = getAllImages();

  return (
    <>
      {/* Main Modal */}
      <div 
        className="fixed inset-0 z-50 overflow-y-auto bg-cover bg-center bg-[url('/bg.jpg')] lg:bg-[url('/dsbg.jpg')]"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm p-4 flex items-center border-b border-gray-800">
          <button 
            onClick={onClose}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Accounts
          </button>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div 
                className="relative h-80 w-full rounded-xl overflow-hidden cursor-pointer bg-gray-800"
                onClick={() => openImageModal(account?.image, 0)}
              >
                <img 
                  src={getImageUrl(account?.image)}
                  alt={account?.name || 'Account image'}
                  className="w-full h-full object-contain"
                  onError={() => handleImageError(account?.image)}
                  loading="lazy"
                />
                <div className="absolute bottom-3 left-3 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {account?.price?.toFixed(0) || '0.00'} Ks
                </div>
                <div className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full ${
                  account?.text?.toLowerCase()?.includes('sold') 
                    ? 'bg-red-500 text-white' 
                    : 'bg-green-500 text-white'
                }`}>
                  {account?.text?.includes('Sold') ? 'SOLD OUT' : 'IN STOCK'}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">
                  More Images ({altImages.length})
                </h3>
                {loadingImages ? (
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : altImages.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {altImages.map((image, index) => (
                      <motion.div
                        key={image?.id || index}
                        whileHover={{ scale: 1.05 }}
                        className="relative h-20 rounded-lg overflow-hidden cursor-pointer bg-gray-800"
                        onClick={() => openImageModal(image.url, index + 1)}
                      >
                        <img 
                          src={getImageUrl(image.url)}
                          alt={`Additional image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(image.url)}
                          loading="lazy"
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-800/50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-400 text-sm mt-2">No additional images available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{account?.name || 'Unnamed Account'}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-lg font-bold text-purple-400">{account?.price?.toFixed(0) || '0.00'} Ks</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    account?.text?.toLowerCase()?.includes('sold') 
                      ? 'bg-red-500 text-white' 
                      : 'bg-green-500 text-white'
                  }`}>
                    {account?.text?.includes('Sold') ? 'SOLD OUT' : 'IN STOCK'}
                  </span>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4">
                <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
                <p className="text-gray-300 whitespace-pre-line">
                  {account?.description || 'No description available'}
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4">
                <h2 className="text-lg font-semibold text-white mb-2">Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <p className="text-white">{account?.text || 'Available'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Price</p>
                    <p className="text-white">{account?.price?.toFixed(0) || '0.00'} Ks</p>
                  </div>
                  {accountDetails?.extraInfo && (
                    <div className="col-span-2">
                      <p className="text-gray-400 text-sm">Additional Info</p>
                      <p className="text-white">{accountDetails.extraInfo}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <button 
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-white z-10 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {allImages.length > 1 && (
            <>
              <button 
                onClick={() => navigateImages(-1)}
                className="absolute left-4 text-white z-10 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button 
                onClick={() => navigateImages(1)}
                className="absolute right-4 text-white z-10 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className="w-full h-full flex items-center justify-center p-4">
            <img 
              src={getImageUrl(selectedImage)}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain"
              onError={() => handleImageError(selectedImage)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AccountDetailsModal;
