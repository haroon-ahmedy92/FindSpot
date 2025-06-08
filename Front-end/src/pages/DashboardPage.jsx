import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlusCircle, FaEye, FaBoxOpen, FaCheckCircle, FaHistory, FaQuestionCircle, FaChevronRight } from 'react-icons/fa';
import ItemCard from '../components/ui/ItemCard'; // Assuming ItemCard is in ui

// Sample data - replace with actual user data
const currentUser = {
  name: 'Haroon',
  stats: {
    activeLost: 2,
    activeFound: 1,
    resolved: 5,
  },
  recentItems: [
    { id: 'L1', title: 'Lost: Black Leather Wallet', category: 'Wallets', date: '2025-06-05', status: 'lost', location: 'City Park', imageUrl: 'https://via.placeholder.com/150/F35B04/FFFFFF?Text=Wallet' },
    { id: 'F1', title: 'Found: iPhone 14 Pro', category: 'Electronics', date: '2025-06-03', status: 'found', location: 'University Library', imageUrl: 'https://via.placeholder.com/150/00AFB9/FFFFFF?Text=Phone' },
    { id: 'L2', title: 'Lost: University ID Card', category: 'Documents', date: '2025-06-01', status: 'lost', location: 'Cafeteria', imageUrl: 'https://via.placeholder.com/150/FFBE0B/000000?Text=ID+Card' },
  ],
};

const siteActivity = [
  { id: 1, type: 'new_lost', description: 'A new "Lost Keys" report was posted near Downtown.', time: '10m ago', icon: <FaSearch className="text-red-500" /> },
  { id:2, type: 'new_found', description: 'A "Found Backpack" was reported in Central Mall.', time: '45m ago', icon: <FaBoxOpen className="text-green-500" /> },
  { id: 3, type: 'resolved', description: 'Item "Lost Cat" was marked as resolved by its owner.', time: '2h ago', icon: <FaCheckCircle className="text-blue-500" /> },
];

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Welcome and Quick Actions */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome back, {currentUser.name}!</h1>
          <p className="text-lg text-gray-600 mb-8">Let's help you find what's lost or report what you've found.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/dashboard/report-lost" className="group bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Report a Lost Item</h2>
                <p className="text-sm opacity-90">Help us find your missing item.</p>
              </div>
              <FaSearch className="text-3xl opacity-70 group-hover:scale-110 transition-transform" />
            </Link>
            <Link to="/dashboard/report-found" className="group bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Report a Found Item</h2>
                <p className="text-sm opacity-90">You found something? Report it here.</p>
              </div>
              <FaPlusCircle className="text-3xl opacity-70 group-hover:scale-110 transition-transform" />
            </Link>
            <Link to="/dashboard/my-posts" className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">View My Posts</h2>
                <p className="text-sm opacity-90">Check the status of your items.</p>
              </div>
              <FaEye className="text-3xl opacity-70 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Your Activity Snapshot */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Your Activity Snapshot</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
              <FaBoxOpen className="text-4xl text-red-500" />
              <div>
                <p className="text-3xl font-bold text-gray-800">{currentUser.stats.activeLost}</p>
                <p className="text-gray-600">Active Lost Items</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
              <FaCheckCircle className="text-4xl text-green-500" />
              <div>
                <p className="text-3xl font-bold text-gray-800">{currentUser.stats.activeFound}</p>
                <p className="text-gray-600">Active Found Items</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
              <FaHistory className="text-4xl text-blue-500" />
              <div>
                <p className="text-3xl font-bold text-gray-800">{currentUser.stats.resolved}</p>
                <p className="text-gray-600">Items Resolved</p>
              </div>
            </div>
          </div>
        </section>

        {/* Your Recent Posts */}
        {currentUser.recentItems && currentUser.recentItems.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-700">Your Recent Posts</h2>
              <Link to="/dashboard/my-posts" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                View All <FaChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentUser.recentItems.slice(0, 3).map(item => (
                <ItemCard key={item.id} item={item} type={item.status} isDashboard={true} />
              ))}
            </div>
          </section>
        )}

        {/* Latest on FindSpot */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Latest on FindSpot</h2>
          <div className="bg-white rounded-xl shadow-lg">
            <ul className="divide-y divide-gray-200">
              {siteActivity.map(activity => (
                <li key={activity.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <FaChevronRight className="text-gray-400 h-5 w-5" />
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-4 text-center border-t border-gray-200">
                <Link to="/dashboard/browse" className="text-blue-600 hover:text-blue-700 font-medium">
                    Browse All Items
                </Link>
            </div>
          </div>
        </section>

        {/* Helpful Resources */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Helpful Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/faq" className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4">
              <FaQuestionCircle className="text-3xl text-yellow-500" />
              <div>
                <h3 className="font-semibold text-gray-800">FAQ & Guides</h3>
                <p className="text-sm text-gray-600">Find answers to common questions.</p>
              </div>
            </Link>
            <Link to="/contact" className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4">
              <FaPlusCircle className="text-3xl text-purple-500" /> {/* Placeholder icon */}
              <div>
                <h3 className="font-semibold text-gray-800">Contact Support</h3>
                <p className="text-sm text-gray-600">Need help? Get in touch with us.</p>
              </div>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default DashboardPage;
