import React from 'react';
import MapIcon from '../../assets/icons/map.svg';
import CalendarIcon from '../../assets/icons/calendar.svg';

const ItemCard = ({ item }) => {
  const { title, description, location, date, status, category } = item;

  const isLost = status === 'Lost';

  return (
    <div className="bg-[#ffffff0f] text-white rounded-xl shadow-lg overflow-hidden border border-white/10 backdrop-blur-sm transition duration-300 hover:shadow-xl">
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full 
              ${isLost
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                : 'bg-gradient-to-r from-green-500 to-emerald-400 text-white'}
            `}
          >
            {status}
          </span>
        </div>

        <p className="text-gray-300 text-sm">{description}</p>

        <div className="flex items-center text-sm text-gray-400">
        <img src={CalendarIcon} alt="Location" className="w-4 h-4 mr-2" />
          <span>{location}</span>
        </div>

        <div className="flex items-center text-sm text-gray-400">
        <img src={MapIcon} alt="Location" className="w-4 h-4 mr-2" />          
        <span>{isLost ? 'Lost on' : 'Found on'}: {date}</span>
        </div>

        <button  className="w-full py-2 rounded-lg bg-gradient-to-r from-[#696EFF]/30 to-[#F8ACFF]/30 text-white hover:opacity-90 transition">
          View Details
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
