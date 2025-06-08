import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaSearchLocation } from 'react-icons/fa';
import Notifications from './Notifications';
import ProfileMenu from './ProfileMenu';

const DashboardHeader = () => (
  <header className="glass-effect sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-2 group">
          <FaSearchLocation className="w-6 h-6 text-[#F35B04] group-hover:scale-105 transition-transform" />
          <span className="font-bold text-xl text-gray-800 group-hover:text-gray-900 transition-colors">
            FindSpot
          </span>
        </Link>

        {/* Navigation Links - Centered */}
        <nav className="flex-1 flex justify-center items-center space-x-4 lg:space-x-6">
          <NavLink 
            to="/dashboard" 
            end
            className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/dashboard/browse" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'}`
            }
          >
            Browse Items
          </NavLink>
          <NavLink 
            to="/dashboard/report-lost" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'}`
            }
          >
            Report Lost
          </NavLink>
          <NavLink 
            to="/dashboard/report-found" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'}`
            }
          >
            Report Found
          </NavLink>
          <NavLink 
            to="/dashboard/my-posts" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'}`
            }
          >
            My Posts
          </NavLink>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Notifications />
          <ProfileMenu />
        </div>
      </div>
    </div>
  </header>
);

export default DashboardHeader;
