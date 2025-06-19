import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlusCircle, FaEye, FaBoxOpen, FaCheckCircle, FaHistory, FaQuestionCircle, FaChevronRight, FaBookmark, FaClipboardList } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
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
  const { isDarkMode } = useTheme();

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

  // Fetch user's items using separate endpoints like in AllListings
  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        setLoading(true);
        
        // Fetch lost and found items separately to ensure proper itemType mapping
        const [lostResponse, foundResponse] = await Promise.all([
          ItemService.getMyLostItems({ page: 0, limit: 10 }),
          ItemService.getMyFoundItems({ page: 0, limit: 10 })
        ]);
        
        console.log('Lost items response:', lostResponse);
        console.log('Found items response:', foundResponse);
        
        // Extract items from responses
        const lostItems = (lostResponse?.content || []).map(item => ({
          ...item,
          itemType: 'lost' // Explicitly set itemType for lost items
        }));
        
        const foundItems = (foundResponse?.content || []).map(item => ({
          ...item,
          itemType: 'found' // Explicitly set itemType for found items
        }));
        
        // Combine and sort by date
        const allItems = [...lostItems, ...foundItems];
        allItems.sort((a, b) => new Date(b.reportedDate || b.createdAt || 0) - new Date(a.reportedDate || a.createdAt || 0));
        
        // Process items for display
        const processedItems = allItems.map(item => ({
          id: item.id || item.itemId,
          title: item.title,
          category: item.category || '',
          date: item.reportedDate || item.createdAt || item.date,
          status: item.status || 'ACTIVE',
          itemType: item.itemType, // Use the explicitly set itemType
          location: item.location || '',
          imageUrl: item.images?.[0] || `https://via.placeholder.com/150/${item.itemType === 'lost' ? 'F35B04' : '00AFB9'}/FFFFFF?Text=${item.category}`
        }));
        
        console.log('Processed items with correct itemType:', processedItems);
        
        setUserItems(processedItems);
        
        // Calculate stats from the fetched items if needed
        if (statsError) {
          const activeFound = foundItems.filter(item => item.status === 'ACTIVE').length;
          const activeLost = lostItems.filter(item => item.status === 'ACTIVE').length;
          const resolved = allItems.filter(item => item.status === 'RESOLVED' || item.status === 'CLAIMED' || item.status === 'CLOSED').length;
          
          setStats({
            activeFound,
            activeLost,
            resolved,
            total: allItems.length
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
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${
      isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
        : 'bg-gradient-to-b from-[#F8F9FA] to-white'
    }`}>
      <div className="max-w-7xl mx-auto">

        {/* Welcome and Quick Actions */}
        <section className="mb-12">
          <h1 className={`text-4xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-[#212529]'
          }`}>Welcome back, {userName}!</h1>
          <p className={`text-lg mb-8 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Let's help you find what's lost or report what you've found.</p>
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
          <h2 className={`text-2xl font-semibold mb-6 ${
            isDarkMode ? 'text-white' : 'text-[#212529]'
          }`}>Your Activity Snapshot</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className={`p-4 rounded-xl shadow-lg flex items-center space-x-3 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <FaBoxOpen className="text-3xl text-[#F35B04]" />
              <div>
                {statsLoading ? (
                  <div className={`h-8 w-8 animate-pulse rounded ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                ) : (
                  <p className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-[#212529]'
                  }`}>{stats.activeLost}</p>
                )}
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-[#212529]/80'
                }`}>Lost Items</p>
              </div>
            </div>
            <div className={`p-4 rounded-xl shadow-lg flex items-center space-x-3 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <FaPlusCircle className="text-3xl text-[#00AFB9]" />
              <div>
                {statsLoading ? (
                  <div className={`h-8 w-8 animate-pulse rounded ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                ) : (
                  <p className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-[#212529]'
                  }`}>{stats.activeFound}</p>
                )}
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-[#212529]/80'
                }`}>Found Items</p>
              </div>
            </div>
            <div className={`p-4 rounded-xl shadow-lg flex items-center space-x-3 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <FaHistory className="text-3xl text-[#3D348B]" />
              <div>
                {statsLoading ? (
                  <div className={`h-8 w-8 animate-pulse rounded ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                ) : (
                  <p className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-[#212529]'
                  }`}>{stats.resolved}</p>
                )}
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-[#212529]/80'
                }`}>Resolved</p>
              </div>
            </div>
            <div className={`p-4 rounded-xl shadow-lg flex items-center space-x-3 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <FaBookmark className="text-3xl text-[#FFBE0B]" />
              <div>
                {statsLoading ? (
                  <div className={`h-8 w-8 animate-pulse rounded ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                ) : (
                  <p className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-[#212529]'
                  }`}>{stats.saved}</p>
                )}
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-[#212529]/80'
                }`}>Saved Items</p>
              </div>
            </div>
            <div className={`p-4 rounded-xl shadow-lg flex items-center space-x-3 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <FaClipboardList className="text-3xl text-gray-600" />
              <div>
                {statsLoading ? (
                  <div className={`h-8 w-8 animate-pulse rounded ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                ) : (
                  <p className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-[#212529]'
                  }`}>{stats.total}</p>
                )}
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-[#212529]/80'
                }`}>Total Items</p>
              </div>
            </div>
          </div>
        </section>

        {/* Your Recent Posts */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-[#212529]'
            }`}>Your Recent Posts</h2>
            <Link to="/dashboard/my-posts" className="text-[#F35B04] hover:text-[#d95203] font-medium flex items-center">
              View All <FaChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D348B]"></div>
            </div>
          ) : error ? (
            <div className={`border rounded-lg p-4 ${
              isDarkMode 
                ? 'bg-red-900/30 border-red-600/30 text-red-300' 
                : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              <p>{error}</p>
            </div>
          ) : userItems.length === 0 ? (
            <div className={`border rounded-lg p-8 text-center ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <p className={`mb-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>You haven't posted any items yet.</p>
              <div className="inline-flex space-x-4">
                <Link to="/dashboard/report-lost" className="px-4 py-2 bg-[#F35B04] text-white rounded-lg">Report Lost Item</Link>
                <Link to="/dashboard/report-found" className="px-4 py-2 bg-[#00AFB9] text-white rounded-lg">Report Found Item</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userItems.slice(0, 3).map(item => (
                <ItemCard key={item.id} item={item} isDashboard={true} />
              ))}
            </div>
          )}
        </section>

        {/* Latest on FindSpot */}
        <section className="mb-12">
          <h2 className={`text-2xl font-semibold mb-6 ${
            isDarkMode ? 'text-white' : 'text-[#212529]'
          }`}>Latest on FindSpot</h2>
          <div className={`rounded-xl shadow-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <ul className={`divide-y ${
              isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
            }`}>
              {siteActivity.map(activity => (
                <li key={activity.id} className={`p-4 transition-colors duration-150 ${
                  isDarkMode 
                    ? 'hover:bg-[#F35B04]/20' 
                    : 'hover:bg-[#F35B04]/10'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                      activity.type === 'new_lost' ? 'bg-[#F35B04]/20' : activity.type === 'new_found' ? 'bg-[#00AFB9]/20' : 'bg-[#3D348B]/20'
                    }`}>
                      {React.cloneElement(activity.icon, { className: `${
                        activity.type === 'new_lost' ? 'text-[#F35B04]' : activity.type === 'new_found' ? 'text-[#00AFB9]' : 'text-[#3D348B]'
                      }` })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${
                        isDarkMode ? 'text-white' : 'text-[#212529]'
                      }`}>{activity.description}</p>
                      <p className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>{activity.time}</p>
                    </div>
                    <FaChevronRight className={`h-5 w-5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-400'
                    }`} />
                  </div>
                </li>
              ))}
            </ul>
            <div className={`p-4 text-center border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
                <Link to="/dashboard/browse" className="text-[#3D348B] hover:text-[#2c2566] font-medium">
                    Browse All Items
                </Link>
            </div>
          </div>
        </section>

        {/* Helpful Resources */}
        <section>
          <h2 className={`text-2xl font-semibold mb-6 ${
            isDarkMode ? 'text-white' : 'text-[#212529]'
          }`}>Helpful Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/faq" className={`group p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <FaQuestionCircle className="text-3xl text-[#FFBE0B]" />
              <div>
                <h3 className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-[#212529]'
                }`}>FAQ & Guides</h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Find answers to common questions.</p>
              </div>
            </Link>
            <Link to="/contact" className={`group p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <FaPlusCircle className="text-3xl text-[#3D348B]" />
              <div>
                <h3 className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-[#212529]'
                }`}>Contact Support</h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Need help? Get in touch with us.</p>
              </div>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default DashboardPage;
