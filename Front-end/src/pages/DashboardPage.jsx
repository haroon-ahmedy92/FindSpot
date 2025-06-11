import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlusCircle, FaEye, FaBoxOpen, FaCheckCircle, FaHistory, FaQuestionCircle, FaChevronRight, FaBookmark, FaClipboardList } from 'react-icons/fa';
import ItemCard from '../components/ui/ItemCard';
import ItemService from '../api/itemService';
import UserService from '../api/userService';

const siteActivity = [
  { id: 1, type: 'new_lost', description: 'A new "Lost Keys" report was posted near Downtown.', time: '10m ago', icon: <FaSearch className="text-red-500" /> },
  { id:2, type: 'new_found', description: 'A "Found Backpack" was reported in Central Mall.', time: '45m ago', icon: <FaBoxOpen className="text-green-500" /> },
  { id: 3, type: 'resolved', description: 'Item "Lost Cat" was marked as resolved by its owner.', time: '2h ago', icon: <FaCheckCircle className="text-blue-500" /> },
];

const DashboardPage = () => {
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsError, setStatsError] = useState(null);
  const [stats, setStats] = useState({
    activeLost: 0,
    activeFound: 0,
    resolved: 0,
    saved: 0,
    total: 0
  });
  const [userName, setUserName] = useState('');

  // Fetch user profile to get name
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await UserService.getUserProfile();
        if (userData && userData.name) {
          setUserName(userData.name);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        // Don't set an error state here - we can continue with default name
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch user statistics
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setStatsLoading(true);
        const statsData = await UserService.getUserStats();
        console.log('User stats response:', statsData);
        
        if (statsData) {
          setStats({
            activeLost: statsData.activeLostItems || 0,
            activeFound: statsData.activeFoundItems || 0,
            resolved: statsData.resolvedItems || 0,
            saved: statsData.savedItems || 0,
            total: statsData.totalItems || 0
          });
        }
      } catch (err) {
        console.error('Error fetching user statistics:', err);
        setStatsError('Failed to load statistics. Please try again later.');
      } finally {
        setStatsLoading(false);
      }
    };
    
    fetchUserStats();
  }, []);

  // Fetch user's items
  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        setLoading(true);
        // Fetch all user items
        const response = await ItemService.getUserItems();
        console.log('User items response:', response);
        
        let items = [];
        if (response && response.content) {
          items = response.content;
        } else if (Array.isArray(response)) {
          items = response;
        }
        
        // Process items for display
        const processedItems = items.map(item => ({
          id: item.id || item.itemId,
          title: item.title,
          category: item.category || '',
          date: item.reportedDate || item.createdAt || item.date,
          status: item.type?.toLowerCase() || 'lost',
          location: item.location || '',
          imageUrl: item.images?.[0] || `https://via.placeholder.com/150/${item.type === 'LOST' ? 'F35B04' : '00AFB9'}/FFFFFF?Text=${item.category}`
        }));
        
        setUserItems(processedItems);
        
        // If we couldn't get stats from the API, calculate them from items
        if (statsError) {
          const activeFound = items.filter(item => item.type === 'FOUND' && item.status === 'ACTIVE').length;
          const activeLost = items.filter(item => item.type === 'LOST' && item.status === 'ACTIVE').length;
          const resolved = items.filter(item => item.status === 'RESOLVED' || item.status === 'CLAIMED' || item.status === 'CLOSED').length;
          
          setStats({
            activeFound,
            activeLost,
            resolved
          });
        }
      } catch (err) {
        console.error('Error fetching user items:', err);
        setError('Failed to load your items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserItems();
  }, [statsError]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Welcome and Quick Actions */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-[#212529] mb-2">Welcome back, {userName}!</h1>
          <p className="text-lg text-gray-600 mb-8">Let's help you find what's lost or report what you've found.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/dashboard/report-lost" className="group bg-gradient-to-r from-[#F35B04] to-[#FFBE0B] text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Report a Lost Item</h2>
                <p className="text-sm opacity-90">Help us find your missing item.</p>
              </div>
              <FaSearch className="text-3xl text-white opacity-70 group-hover:scale-110 transition-transform" />
            </Link>
            <Link to="/dashboard/report-found" className="group bg-gradient-to-r from-[#00AFB9] to-[#3D348B] text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Report a Found Item</h2>
                <p className="text-sm opacity-90">You found something? Report it here.</p>
              </div>
              <FaPlusCircle className="text-3xl text-white opacity-70 group-hover:scale-110 transition-transform" />
            </Link>
            <Link to="/dashboard/my-posts" className="group bg-gradient-to-r from-[#3D348B] to-[#4d41a9] text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">View My Posts</h2>
                <p className="text-sm opacity-90">Check the status of your items.</p>
              </div>
              <FaEye className="text-3xl text-white opacity-70 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Your Activity Snapshot */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-[#212529] mb-6">Your Activity Snapshot</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3">
              <FaBoxOpen className="text-3xl text-[#F35B04]" />
              <div>
                {statsLoading ? (
                  <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-[#212529]">{stats.activeLost}</p>
                )}
                <p className="text-sm text-[#212529]/80">Lost Items</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3">
              <FaPlusCircle className="text-3xl text-[#00AFB9]" />
              <div>
                {statsLoading ? (
                  <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-[#212529]">{stats.activeFound}</p>
                )}
                <p className="text-sm text-[#212529]/80">Found Items</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3">
              <FaHistory className="text-3xl text-[#3D348B]" />
              <div>
                {statsLoading ? (
                  <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-[#212529]">{stats.resolved}</p>
                )}
                <p className="text-sm text-[#212529]/80">Resolved</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3">
              <FaBookmark className="text-3xl text-[#FFBE0B]" />
              <div>
                {statsLoading ? (
                  <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-[#212529]">{stats.saved}</p>
                )}
                <p className="text-sm text-[#212529]/80">Saved Items</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg flex items-center space-x-3">
              <FaClipboardList className="text-3xl text-gray-600" />
              <div>
                {statsLoading ? (
                  <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-[#212529]">{stats.total}</p>
                )}
                <p className="text-sm text-[#212529]/80">Total Items</p>
              </div>
            </div>
          </div>
        </section>

        {/* Your Recent Posts */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#212529]">Your Recent Posts</h2>
            <Link to="/dashboard/my-posts" className="text-[#F35B04] hover:text-[#d95203] font-medium flex items-center">
              View All <FaChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D348B]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          ) : userItems.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">You haven't posted any items yet.</p>
              <div className="inline-flex space-x-4">
                <Link to="/dashboard/report-lost" className="px-4 py-2 bg-[#F35B04] text-white rounded-lg">Report Lost Item</Link>
                <Link to="/dashboard/report-found" className="px-4 py-2 bg-[#00AFB9] text-white rounded-lg">Report Found Item</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userItems.slice(0, 3).map(item => (
                <ItemCard key={item.id} item={item} type={item.status} isDashboard={true} />
              ))}
            </div>
          )}
        </section>

        {/* Latest on FindSpot */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-[#212529] mb-6">Latest on FindSpot</h2>
          <div className="bg-white rounded-xl shadow-lg">
            <ul className="divide-y divide-gray-200">
              {siteActivity.map(activity => (
                <li key={activity.id} className="p-4 hover:bg-[#F35B04]/10 transition-colors duration-150">
                  <div className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                      activity.type === 'new_lost' ? 'bg-[#F35B04]/20' : activity.type === 'new_found' ? 'bg-[#00AFB9]/20' : 'bg-[#3D348B]/20'
                    }`}>
                      {React.cloneElement(activity.icon, { className: `${
                        activity.type === 'new_lost' ? 'text-[#F35B04]' : activity.type === 'new_found' ? 'text-[#00AFB9]' : 'text-[#3D348B]'
                      }` })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#212529]">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <FaChevronRight className="text-gray-400 h-5 w-5" />
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-4 text-center border-t border-gray-200">
                <Link to="/dashboard/browse" className="text-[#3D348B] hover:text-[#2c2566] font-medium">
                    Browse All Items
                </Link>
            </div>
          </div>
        </section>

        {/* Helpful Resources */}
        <section>
          <h2 className="text-2xl font-semibold text-[#212529] mb-6">Helpful Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/faq" className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4">
              <FaQuestionCircle className="text-3xl text-[#FFBE0B]" />
              <div>
                <h3 className="font-semibold text-[#212529]">FAQ & Guides</h3>
                <p className="text-sm text-gray-600">Find answers to common questions.</p>
              </div>
            </Link>
            <Link to="/contact" className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4">
              <FaPlusCircle className="text-3xl text-[#3D348B]" />
              <div>
                <h3 className="font-semibold text-[#212529]">Contact Support</h3>
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
