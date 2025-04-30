// src/components/home/HeroSection.jsx

import React from 'react';
import { FaSearch, FaHandHolding } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section className="bg-[#404040] text-white">
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#696EFF] to-[#F8ACFF] bg-clip-text text-transparent">Find What You've Lost, Return What You've Found</h1>
            <p className="text-xl mb-8">A community-driven lost and found platform for Dodoma</p>
            <div className="flex gap-3">
              {/* First Button */}
              <button className="inline-flex items-center px-4 py-2 rounded-md bg-[#696EFF] text-white text-sm font-medium shadow-sm hover:bg-[#7C7EFF] transition duration-200">
                <FaSearch className="mr-2 text-base" />
                I Lost Something
              </button>

              {/* Second Button with gradient border */}
              <button className="inline-flex items-center px-4 py-2 rounded-md bg-[#404040] text-white text-sm font-medium shadow-sm border-2 border-transparent bg-clip-padding hover:bg-[#505050] transition duration-200" style={{
                borderImage: 'linear-gradient(to right, #696EFF, #F8ACFF)',
                borderImageSlice: 1
              }}>
                <FaHandHolding className="mr-2 text-base" />
                I Found Something
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl w-full max-w-md">
              <h2 className="text-white text-2xl font-semibold mb-4">
                Search Lost & Found Items
              </h2>

              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="w-full rounded-lg px-4 py-3 bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-[#696EFF] backdrop-blur-md"
                />
                <button className="absolute right-3 top-3 text-[#696EFF] hover:text-[#F8ACFF] transition">
                  <FaSearch className="text-lg" />
                </button>
              </div>

              {/* Category Tags */}
              <div className="mt-4">
                <div className="flex flex-wrap">
                  {["Electronics", "Documents", "Wallets", "Keys", "More..."].map((item) => (
                    <span
                      key={item}
                      className="m-1 px-3 py-1 bg-gradient-to-r from-[#696EFF]/30 to-[#F8ACFF]/30 text-white rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
            {/* Horizontal Line */}
            {/* <div className="w-full border-b border-gray-300" /> */}
    </section>
  );
};

export default HeroSection;