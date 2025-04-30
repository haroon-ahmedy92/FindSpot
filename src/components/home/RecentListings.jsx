import React, { useState } from 'react';
import ItemCard from '../ui/ItemCard';
import { foundItems } from '../../data/foundItems';
import { lostItems } from '../../data/lostItems';

const RecentListings = () => {
  const [activeTab, setActiveTab] = useState('lost-items');


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  

  return (
    <section className="section bg-[#404040] text-white py-16">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-[#F8ACFF]">Recent Listings</h2>
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-full font-medium transition 
                ${
                  activeTab === 'lost-items'
                    ? 'bg-gradient-to-r from-[#696EFF] to-[#F8ACFF] text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:text-white'
                }`}
              onClick={() => handleTabClick('lost-items')}
            >
              Lost Items
            </button>
            <button
              className={`px-4 py-2 rounded-full font-medium transition 
                ${
                  activeTab === 'found-items'
                    ? 'bg-gradient-to-r from-[#696EFF] to-[#F8ACFF] text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:text-white'
                }`}
              onClick={() => handleTabClick('found-items')}
            >
              Found Items
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'lost-items' ? lostItems : foundItems).map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-6 py-2 bg-gradient-to-r from-[#696EFF] to-[#F8ACFF] text-white rounded-lg hover:opacity-90 transition">
            See All {activeTab === 'lost-items' ? 'Lost' : 'Found'} Items
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecentListings;
