import React from 'react';
import { motion } from 'framer-motion';

export default function Uc() {
  const particles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 12 + 5,
    opacity: 0.2
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
              y: [`${particle.y}%`, `${particle.y + 20}%`],
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
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/70 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 p-8 mx-4 max-w-md w-full"
        >
          <div className="text-center">
            <div className="mb-6">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 mx-auto text-purple-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Coming Soon</h1>
         
            
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" 
                style={{ width: '65%' }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">Development in progress - 65% complete</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}