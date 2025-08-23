import React, { useState, useEffect } from "react";
import { FaTelegram, FaTiktok } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import logo from "./../img/logo.jpg";
import { BiLock } from "react-icons/bi";

export default function Nav() {
  const [modalType, setModalType] = useState(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const openModal = (type) => {
    setModalType(type);
    setError("");
    setPin("");
  };

  const closeModal = () => {
    setModalType(null);
    setError("");
    setPin("");
  };

  useEffect(() => {
    if (modalType) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalType]);

  const handlePinSubmit = () => {
    if (pin === "324823094723094823402348") {
      closeModal();
      navigate("/admindashboard");
    } else {
      setError("❌ Incorrect PIN, try again.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center w-full px-4 py-4 md:px-6 md:py-6 animate-[fadeDown_1s_ease]">
        {/* Logo + Title */}
        <div className="flex items-center gap-3 md:gap-4">
          <img
            src={logo}
            alt="Logo"
            className="w-12 h-12 md:w-16 md:h-16 rounded-md"
          />
          <h2
            className="text-4xl md:text-3xl font-extrabold mb-4 md:mb-6 uppercase
                       bg-gradient-to-b from-yellow-300 to-orange-600 bg-clip-text text-transparent"
          >
            Xeno Shop
          </h2>
        </div>

        {/* Social Icons */}
        <div className="flex gap-3 md:gap-4">
          <div
            onClick={() => openModal("tiktok")}
            className="bg-black/70 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl md:text-2xl hover:scale-110 transition duration-300 cursor-pointer"
          >
            <FaTiktok />
          </div>
          <div
            onClick={() => openModal("telegram")}
            className="bg-black/70 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl md:text-2xl hover:scale-110 transition duration-300 cursor-pointer"
          >
            <FaTelegram />
          </div>
          <div
            onClick={() => openModal("pin")}
            className="bg-black/70 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl md:text-2xl hover:scale-110 transition duration-300 cursor-pointer"
          >
            <BiLock />
          </div>
        </div>
      </div>

      {/* Nav Bar */}
      <div className="bg-black-/50 backdrop-blur-md flex justify-between items-center w-[90%] md:w-[50%] mx-auto px-6 md:px-8 py-2 md:py-3 rounded-lg shadow-md animate-[fadeIn_1.2s_ease]">
        <Link
          to="/home"
          className="bg-black/80 text-white font-bold px-4 md:px-6 py-1.5 md:py-2 rounded-lg hover:bg-black transition"
        >
          Account
        </Link>
        <div className="flex gap-6 md:gap-8 text-xl md:text-2xl"></div>
        <Link
          to=""
          className="bg-black/80 text-white font-bold px-4 md:px-6 py-1.5 md:py-2 rounded-lg hover:bg-black transition"
        >
          UC
        </Link>
      </div>

      {/* Modal */}
      {modalType && modalType !== "pin" && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-black/90 text-white rounded-xl shadow-2xl w-11/12 max-w-md p-6 text-center relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4">
              {modalType === "tiktok" ? "Follow on TikTok" : "Join Telegram"}
            </h3>
            <p className="text-gray-300 mb-6 text-sm">
              {modalType === "tiktok"
                ? "Stay updated with our TikTok videos and offers!"
                : "Get instant updates and support in our Telegram channel."}
            </p>
            <div className="bg-gray-800/80 rounded-lg px-4 py-3 mb-5 text-blue-400 text-sm font-mono">
              {modalType === "tiktok"
                ? "no tik tok yet"
                : "http://t.me/+5e7pujcnTEM2ZTM1"}
            </div>
            <a
              href={
                modalType === "tiktok"
                  ? "no tik tok yet"
                  : "http://t.me/+5e7pujcnTEM2ZTM1"
              }
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full py-3 rounded-lg font-bold text-lg transition ${
                modalType === "tiktok"
                  ? "bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-500 hover:to-purple-600"
                  : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700"
              }`}
            >
              Open {modalType === "tiktok" ? "TikTok" : "Telegram"}
            </a>
          </div>
        </div>
      )}

      {/* 🔑 PIN Modal */}
      {modalType === "pin" && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-black/90 text-white rounded-xl shadow-2xl w-11/12 max-w-md p-6 text-center relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4">Enter Admin PIN</h3>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter PIN"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button
              onClick={handlePinSubmit}
              className="w-full mt-4 py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition"
            >
              Unlock
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
