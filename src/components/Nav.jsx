import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from './../img/logo.jpg';
import { motion, AnimatePresence } from 'framer-motion';
import { BiLock } from 'react-icons/bi';
import { FaTiktok, FaTelegramPlane, FaTimes } from 'react-icons/fa';

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showTikTokModal, setShowTikTokModal] = useState(false);
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
const ADMIN_PIN = "1234342342434222345673463"; // Replace with your actual PIN


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLockClick = () => {
    setShowPinModal(true);
    setPin('');
    setError('');
  };

  const verifyPin = () => {
    if (pin === ADMIN_PIN) {
      navigate('/admindashboard');
      setShowPinModal(false);
    } else {
      setError('Incorrect PIN. Please try again.');
    }
  };

  const isModalOpen = showPinModal || showTikTokModal || showTelegramModal;

  return (
    <>
      {/* Main Content */}
      <div className={`relative ${isModalOpen ? 'overflow-hidden h-screen' : ''}`}>
        {/* Navbar with Tabs */}
        <div className={`sticky top-0 z-30 ${isModalOpen ? 'filter blur-sm' : ''}`}>
          {/* Navbar */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`navbar bg-gradient-to-r from-gray-900 via-purple-900 to-gray-800 text-white shadow-xl ${scrolled ? 'py-2' : 'py-4'}`}
          >
            <div className="navbar-start">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500/50 shadow-lg">
                  <img 
                    src={logo} 
                    alt="Xeno Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col"
                >
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    XENO
                  </span>
                  <span className="text-xs font-mono tracking-widest text-gray-300">
                    GAMING MARKETPLACE
                  </span>
                </motion.div>
              </motion.div>
            </div>

            <div className="navbar-center hidden lg:flex">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
              >
                Welcome To Xeno Shop
              </motion.h1>
            </div>

            <div className="navbar-end space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowTelegramModal(true)}
                className="btn btn-circle bg-white/10 hover:bg-white/20 transition-all"
              >
                <FaTelegramPlane className="text-xl" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowTikTokModal(true)}
                className="btn btn-circle bg-white/10 hover:bg-white/20 transition-all"
              >
                <FaTiktok className="text-xl" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLockClick}
                className="btn btn-circle bg-white/10 hover:bg-white/20 transition-all"
              >
                <BiLock className="text-xl" />
              </motion.button>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center bg-gray-800/80 border-b border-purple-500/20"
          >
            <div className="tabs tabs-boxed bg-transparent gap-2 p-2 lg:p-3 w-full lg:w-auto">
              <NavLink
                to="/pubgaccount"
                className={({ isActive }) =>
                  `font-mono font-bold px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-[1.02]' 
                      : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                PUBG ACCOUNTS
              </NavLink>
              <NavLink
                to="/uc"
                className={({ isActive }) =>
                  `font-mono font-bold px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-[1.02]' 
                      : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                UC
              </NavLink>
            </div>
          </motion.div>
        </div>

        {/* Your page content goes here */}
        <div className={`${isModalOpen ? 'filter blur-sm' : ''}`}>
          {/* Add your content here */}
        </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => {
              setShowPinModal(false);
              setShowTikTokModal(false);
              setShowTelegramModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {/* PIN Modal */}
        {showPinModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-purple-500/30 w-full max-w-md relative mx-auto">
              <button
                onClick={() => setShowPinModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
              
              <h3 className="text-xl font-bold text-white mb-4">Admin Access</h3>
              <p className="text-gray-300 mb-4">Please enter admin PIN:</p>
              
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter PIN"
                onKeyDown={(e) => e.key === 'Enter' && verifyPin()}
              />
              
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowPinModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyPin}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 transition"
                >
                  Verify
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TikTok Modal */}
        {showTikTokModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-purple-500/30 w-full max-w-md relative mx-auto">
              <button
                onClick={() => setShowTikTokModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
              
              <div className="flex items-center justify-center mb-4">
                <FaTiktok className="text-3xl text-pink-500 mr-3" />
                <h3 className="text-xl font-bold text-white">Our TikTok Profile</h3>
              </div>
              <p className="text-gray-300 mb-4 text-center">Follow us on TikTok for the latest updates!</p>
              
              <div className="bg-gray-700 p-3 rounded-lg mb-4 break-all">
                <p className="text-white font-mono text-sm md:text-base">No Tik Tok account yet..</p>
              </div>
              
              <div className="flex justify-center">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition flex items-center"
                >
                  <FaTiktok className="mr-2" /> Open TikTok
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Telegram Modal */}
        {showTelegramModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-purple-500/30 w-full max-w-md relative mx-auto">
              <button
                onClick={() => setShowTelegramModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
              
              <div className="flex items-center justify-center mb-4">
                <FaTelegramPlane className="text-3xl text-blue-400 mr-3" />
                <h3 className="text-xl font-bold text-white">Our Telegram Channel</h3>
              </div>
              <p className="text-gray-300 mb-4 text-center">Join our Telegram for exclusive offers!</p>
              
              <div className="bg-gray-700 p-3 rounded-lg mb-4 break-all">
                <p className="text-white font-mono text-sm md:text-base">https://t.me/XenoFav_M</p>
              </div>
              
              <div className="flex justify-center">
                <a
                  href="https://t.me/XenoFav_M"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition flex items-center"
                >
                  <FaTelegramPlane className="mr-2" /> Open Telegram
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;