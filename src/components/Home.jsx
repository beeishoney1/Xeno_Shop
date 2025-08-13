import React, { useEffect, useState } from 'react';
import { accountAPI } from '../api/api.js';
import { motion } from 'framer-motion';
import AccountModal from './AccountDetailsModal.jsx';
import testimg from './../img/testimg.jpg';

const Home = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await accountAPI.getAllAccounts();
        setAccounts(response.accounts);
        setFilteredAccounts(response.accounts);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    const results = accounts.filter(account =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAccounts(results);
  }, [searchTerm, accounts]);

  const handleImageError = (accountId) => {
    setImageLoadErrors(prev => ({ ...prev, [accountId]: true }));
  };

  // Optimized floating particles
  const particles = Array.from({ length: isMobile ? 8 : 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * (isMobile ? 2 : 3) + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * (isMobile ? 8 : 15) + 5,
    opacity: isMobile ? 0.15 : 0.25
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white overflow-hidden relative">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              opacity: 0,
              x: `${particle.x}%`,
              y: `${particle.y}%`
            }}
            animate={{
              opacity: [0, particle.opacity, 0],
              y: [`${particle.y}%`, `${particle.y + (isMobile ? 15 : 25)}%`],
              x: [`${particle.x}%`, `${particle.x + (Math.random() * 6 - 3)}%`]
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
        <div className={`absolute inset-0 ${isMobile ? 'bg-grid-white/[0.01]' : 'bg-grid-white/[0.02]'}`} />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-screen">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="relative w-20 h-20 mb-6"
            >
              <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 border-r-blue-500 rounded-full"></div>
              <div className="absolute inset-2 border-4 border-transparent border-b-blue-400 border-l-purple-400 rounded-full"></div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
              className="text-lg text-gray-300"
            >
              Loading Premium Accounts...
            </motion.p>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-4 px-2 text-center">
  <p className="text-purple-300 text-sm sm:text-base">
    If you want to buy Account, Please Contact Admin directly
  </p>
</div>
            {/* Search Bar */}
            <div className="mb-8 mx-auto max-w-md">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search accounts..."
                  className="w-full bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </motion.div>
            </div>

            {/* Accounts Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredAccounts.map((account, index) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                  }}
                  className="relative bg-gray-800/80 rounded-xl overflow-hidden shadow-xl backdrop-blur-sm border border-gray-700 hover:border-purple-500 transition-all duration-300"
                >
                  {/* Status Badge */}
                  {account.text && (
                    <div className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg ${
                      account.text.toLowerCase().includes('sold') 
                        ? 'bg-red-500/90 text-white' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    }`}>
                      {account.text.includes('Sold') ? 'SOLD OUT' : 'IN STOCK'}
                    </div>
                  )}

                  {/* Account Image */}
                  <div className="relative h-40 overflow-hidden group">
                    <img 
                      src={imageLoadErrors[account.id] ? testimg : 
                           (account.image ? `https://beeishappy15.pythonanywhere.com${account.image}` : testimg)}
                      alt={account.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                      style={{ objectPosition: 'center top' }}
                      onError={() => handleImageError(account.id)}
                      loading="lazy"
                    />
                    {/* Price Tag */}
                    <div className="absolute bottom-3 left-3 bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm shadow-lg">
                      {account.price?.toFixed(0)} Ks
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 truncate">{account.name}</h3>
                    <p className="text-gray-300 text-xs mb-4 line-clamp-3">{account.description}</p>
                    <motion.button
                      onClick={() => setSelectedAccount(account)}
                      whileHover={{ 
                        scale: 1.03,
                        boxShadow: '0 0 12px rgba(124, 58, 237, 0.5)'
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-2 rounded-lg font-bold text-xs transition-all duration-300 shadow-lg ${
                        account.text?.includes('Sold')
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                      }`}
                      disabled={account.text?.includes('Sold')}
                    >
                      {account.text?.includes('Sold') ? 'SOLD OUT' : 'More Details'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Account Modal */}
      {selectedAccount && (
        <AccountModal 
          account={selectedAccount} 
          onClose={() => setSelectedAccount(null)} 
        />
      )}
    </div>
  );
};

export default Home;