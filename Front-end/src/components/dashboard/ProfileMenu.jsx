import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import UserService from '../../api/userService';

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({ name: 'User', initials: 'U' });
  const [loading, setLoading] = useState(true);
  const ref = useRef();
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const userData = await UserService.getUserProfile();
        
        if (userData) {
          // Get user initials from name
          const initials = userData.name
            ? userData.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2)
            : 'U';
            
          setUser({
            name: userData.name || 'User',
            initials
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className={`flex items-center space-x-2 p-2 rounded-full transition-colors duration-200 ${
          isDarkMode 
            ? 'hover:bg-gray-700' 
            : 'hover:bg-gray-100'
        }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
        }`}>
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span className="text-white font-medium">{user.initials}</span>
          )}
        </div>
        <span className={`font-medium ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          {loading ? 'Loading...' : user.name}
        </span>
      </button>
      {open && (
        <div className={`absolute right-0 mt-2 w-48 shadow-lg rounded-lg overflow-hidden z-50 border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-600' 
            : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={() => { navigate('/dashboard/profile'); setOpen(false); }}
            className={`w-full text-left px-4 py-2 transition-colors duration-200 ${
              isDarkMode 
                ? 'text-gray-200 hover:bg-gray-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => { navigate('/dashboard/settings'); setOpen(false); }}
            className={`w-full text-left px-4 py-2 transition-colors duration-200 ${
              isDarkMode 
                ? 'text-gray-200 hover:bg-gray-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Settings
          </button>
          <button
            onClick={handleLogout}
            className={`w-full text-left px-4 py-2 transition-colors duration-200 ${
              isDarkMode 
                ? 'text-gray-200 hover:bg-gray-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
