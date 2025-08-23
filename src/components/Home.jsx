import React, { useEffect, useState } from "react";
import { accountAPI } from "../api/api.js";
import { motion } from "framer-motion";
import AccountModal from "./AccountDetailsModal.jsx";
import testimg from "./../img/testimg.jpg";
import { FaSearch } from "react-icons/fa";
import Nav from "./Nav.jsx";

const Home = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await accountAPI.getAllAccounts();
        setAccounts(response.accounts);
        setFilteredAccounts(response.accounts);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    const results = accounts.filter(
      (account) =>
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAccounts(results);
  }, [searchTerm, accounts]);

  const handleImageError = (accountId) => {
    setImageLoadErrors((prev) => ({ ...prev, [accountId]: true }));
  };

  return (
    <div
      className="min-h-screen text-white px-4 py-6 bg-cover bg-center transition-all duration-500
                 bg-[url('/bg.jpg')] md:bg-[url('/dsbg.jpg')]"
    >
      <Nav/>
      {/* Search Bar */}
      <div className="flex items-center bg-black/50 rounded-full px-4 py-3 mb-6 w-full max-w-lg mx-auto backdrop-blur-md">
        <FaSearch className="text-gray-300 mr-3" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-white w-full placeholder-gray-300 text-sm md:text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-[70vh] text-lg text-gray-200">
          Loading accounts...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredAccounts.map((account) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 rounded-2xl shadow-xl overflow-hidden text-white backdrop-blur-md border border-gray-600 hover:border-yellow-400 transition-all duration-300"
            >
              {/* Image Section */}
              <div className="relative grid grid-cols-2 gap-1 p-2">
                {[...Array(4)].map((_, i) => (
                  <img
                    key={i}
                    src={
                      imageLoadErrors[account.id]
                        ? testimg
                        : account.image
                        ? `https://beeishappy15.pythonanywhere.com${account.image}`
                        : testimg
                    }
                    alt={account.name}
                    className="w-full h-16 md:h-20 object-cover rounded-lg"
                    onError={() => handleImageError(account.id)}
                  />
                ))}

                {/* Stock Badge */}
                {account.text && (
                  <span
                    className={`absolute top-2 left-2 text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full shadow-lg ${
                      account.text.toLowerCase().includes("sold")
                        ? "bg-red-600 text-white"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {account.text.includes("Sold") ? "Sold Out" : "On Stock"}
                  </span>
                )}
              </div>

              {/* Content Section */}
              <div className="bg-black/70 text-white px-2 md:px-3 py-3 rounded-b-2xl">
                {/* Title & Price */}
                <div className="flex justify-between items-center bg-gradient-to-r from-gray-800 to-gray-900 px-2 md:px-3 py-1.5 md:py-2 rounded-lg mb-3 shadow-md">
                  <h3 className="text-xs md:text-lg font-extrabold uppercase tracking-wide text-yellow-300 truncate">
                    {account.name}
                  </h3>
                  <span className="text-blue-400 font-bold text-xs md:text-base">
                    {account.price?.toFixed(0)} Ks
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-[11px] md:text-sm mb-4 bg-white/10 px-2 md:px-3 py-1.5 rounded-md line-clamp-2 shadow-inner">
                  {account.description}
                </p>

                {/* More Info Button */}
                <button
                  onClick={() => setSelectedAccount(account)}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-1.5 md:py-2 rounded-full font-semibold hover:from-blue-600 hover:to-blue-800 transition shadow-lg hover:shadow-blue-500/50 text-xs md:text-sm"
                >
                  More Info
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
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
