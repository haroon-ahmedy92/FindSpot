import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FaUser, 
    FaBell, 
    FaShieldAlt, 
    FaPalette, 
    FaEye, 
    FaEyeSlash,
    FaSave,
    FaSpinner,
    FaExclamationTriangle
} from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import UserService from '../api/userService';

const SettingsPage = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { showToast } = useToast();
    
    // Form states
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Account Settings
    const [accountSettings, setAccountSettings] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: ''
    });
    
    // Password Change
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        itemMatchAlerts: true,
        weeklyDigest: true,
        marketingEmails: false,
        securityAlerts: true
    });
    
    // Privacy Settings
    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: 'public', // public, private, friends
        showEmail: false,
        showPhone: false,
        showLocation: true,
        allowMessages: true,
        showOnlineStatus: true
    });
    
    // Theme & Display Settings
    const [displaySettings, setDisplaySettings] = useState({
        theme: isDarkMode ? 'dark' : 'light',
        language: 'en',
        timezone: 'UTC',
        itemsPerPage: 12,
        defaultView: 'grid' // grid, list
    });

    // Load user settings on component mount
    useEffect(() => {
        loadUserSettings();
    }, []);

    const loadUserSettings = async () => {
        try {
            setLoading(true);
            
            // Load user profile
            const profile = await UserService.getUserProfile();
            if (profile) {
                setAccountSettings({
                    name: profile.name || '',
                    email: profile.email || '',
                    phone: profile.phone || '',
                    location: profile.location || '',
                    bio: profile.bio || ''
                });
            }
            
            // Load user settings
            const settings = await UserService.getUserSettings();
            if (settings) {
                setNotificationSettings(settings.notifications || notificationSettings);
                setPrivacySettings(settings.privacy || privacySettings);
                setDisplaySettings({
                    ...displaySettings,
                    ...settings.display,
                    theme: isDarkMode ? 'dark' : 'light'
                });
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            showToast('Failed to load settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAccountUpdate = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await UserService.updateProfile(accountSettings);
            showToast('Account settings updated successfully', 'success');
        } catch (error) {
            console.error('Error updating account:', error);
            showToast('Failed to update account settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast('New passwords do not match', 'error');
            return;
        }
        
        if (passwordData.newPassword.length < 8) {
            showToast('Password must be at least 8 characters long', 'error');
            return;
        }
        
        try {
            setSaving(true);
            await UserService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
            showToast('Password changed successfully', 'success');
        } catch (error) {
            console.error('Error changing password:', error);
            showToast('Failed to change password', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleNotificationUpdate = async () => {
        try {
            setSaving(true);
            await UserService.updateNotificationSettings(notificationSettings);
            showToast('Notification settings updated', 'success');
        } catch (error) {
            console.error('Error updating notifications:', error);
            showToast('Failed to update notification settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handlePrivacyUpdate = async () => {
        try {
            setSaving(true);
            await UserService.updatePrivacySettings(privacySettings);
            showToast('Privacy settings updated', 'success');
        } catch (error) {
            console.error('Error updating privacy:', error);
            showToast('Failed to update privacy settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDisplayUpdate = async () => {
        try {
            setSaving(true);
            
            // Handle theme change
            if (displaySettings.theme !== (isDarkMode ? 'dark' : 'light')) {
                toggleTheme();
            }
            
            await UserService.updateDisplaySettings(displaySettings);
            showToast('Display settings updated', 'success');
        } catch (error) {
            console.error('Error updating display:', error);
            showToast('Failed to update display settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                setSaving(true);
                await UserService.deleteAccount();
                showToast('Account deleted successfully', 'success');
                // Redirect to login or home page
                window.location.href = '/';
            } catch (error) {
                console.error('Error deleting account:', error);
                showToast('Failed to delete account', 'error');
            } finally {
                setSaving(false);
            }
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-4xl text-blue-500" />
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="container max-w-4xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Settings
                    </h1>

                    {/* Account Settings */}
                    <div className={`rounded-lg shadow-sm mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center">
                                <FaUser className={`mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Account Settings
                                </h2>
                            </div>
                        </div>
                        <form onSubmit={handleAccountUpdate} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={accountSettings.name}
                                        onChange={(e) => setAccountSettings({...accountSettings, name: e.target.value})}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={accountSettings.email}
                                        onChange={(e) => setAccountSettings({...accountSettings, email: e.target.value})}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={accountSettings.phone}
                                        onChange={(e) => setAccountSettings({...accountSettings, phone: e.target.value})}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={accountSettings.location}
                                        onChange={(e) => setAccountSettings({...accountSettings, location: e.target.value})}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    />
                                </div>
                            </div>
                            <div className="mt-6">
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Bio
                                </label>
                                <textarea
                                    rows="3"
                                    value={accountSettings.bio}
                                    onChange={(e) => setAccountSettings({...accountSettings, bio: e.target.value})}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        isDarkMode 
                                            ? 'bg-gray-700 border-gray-600 text-white' 
                                            : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {saving ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Password Change */}
                    <div className={`rounded-lg shadow-sm mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center">
                                <FaShieldAlt className={`mr-3 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Change Password
                                </h2>
                            </div>
                        </div>
                        <form onSubmit={handlePasswordChange} className="p-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                            className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                isDarkMode 
                                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                                    : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                                        >
                                            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                            className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                isDarkMode 
                                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                                    : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                            required
                                            minLength="8"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                                        >
                                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                            className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                isDarkMode 
                                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                                    : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                            required
                                            minLength="8"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {saving ? <FaSpinner className="animate-spin mr-2" /> : <FaShieldAlt className="mr-2" />}
                                    {saving ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Notification Settings */}
                    <div className={`rounded-lg shadow-sm mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FaBell className={`mr-3 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                                    <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Notification Settings
                                    </h2>
                                </div>
                                <button
                                    onClick={handleNotificationUpdate}
                                    disabled={saving}
                                    className="text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {Object.entries({
                                    emailNotifications: 'Email Notifications',
                                    smsNotifications: 'SMS Notifications',
                                    pushNotifications: 'Push Notifications',
                                    itemMatchAlerts: 'Item Match Alerts',
                                    weeklyDigest: 'Weekly Digest',
                                    marketingEmails: 'Marketing Emails',
                                    securityAlerts: 'Security Alerts'
                                }).map(([key, label]) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {label}
                                        </span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={notificationSettings[key]}
                                                onChange={(e) => setNotificationSettings({
                                                    ...notificationSettings,
                                                    [key]: e.target.checked
                                                })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className={`rounded-lg shadow-sm mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FaShieldAlt className={`mr-3 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                                    <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Privacy Settings
                                    </h2>
                                </div>
                                <button
                                    onClick={handlePrivacyUpdate}
                                    disabled={saving}
                                    className="text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Profile Visibility
                                    </label>
                                    <select
                                        value={privacySettings.profileVisibility}
                                        onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                        <option value="friends">Friends Only</option>
                                    </select>
                                </div>
                                
                                <div className="space-y-4">
                                    {Object.entries({
                                        showEmail: 'Show Email Address',
                                        showPhone: 'Show Phone Number',
                                        showLocation: 'Show Location',
                                        allowMessages: 'Allow Direct Messages',
                                        showOnlineStatus: 'Show Online Status'
                                    }).map(([key, label]) => (
                                        <div key={key} className="flex items-center justify-between">
                                            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {label}
                                            </span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={privacySettings[key]}
                                                    onChange={(e) => setPrivacySettings({
                                                        ...privacySettings,
                                                        [key]: e.target.checked
                                                    })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Display Settings */}
                    <div className={`rounded-lg shadow-sm mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FaPalette className={`mr-3 ${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`} />
                                    <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Display & Theme
                                    </h2>
                                </div>
                                <button
                                    onClick={handleDisplayUpdate}
                                    disabled={saving}
                                    className="text-sm px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Theme
                                    </label>
                                    <select
                                        value={displaySettings.theme}
                                        onChange={(e) => setDisplaySettings({...displaySettings, theme: e.target.value})}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    >
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                        <option value="system">System</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Language
                                    </label>
                                    <select
                                        value={displaySettings.language}
                                        onChange={(e) => setDisplaySettings({...displaySettings, language: e.target.value})}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    >
                                        <option value="en">English</option>
                                        <option value="sw">Swahili</option>
                                        <option value="fr">French</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Items Per Page
                                    </label>
                                    <select
                                        value={displaySettings.itemsPerPage}
                                        onChange={(e) => setDisplaySettings({...displaySettings, itemsPerPage: parseInt(e.target.value)})}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    >
                                        <option value="6">6</option>
                                        <option value="12">12</option>
                                        <option value="24">24</option>
                                        <option value="48">48</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Default View
                                    </label>
                                    <select
                                        value={displaySettings.defaultView}
                                        onChange={(e) => setDisplaySettings({...displaySettings, defaultView: e.target.value})}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    >
                                        <option value="grid">Grid</option>
                                        <option value="list">List</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className={`rounded-lg shadow-sm border-2 border-red-500 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className={`px-6 py-4 border-b border-red-500 bg-red-50 dark:bg-red-900/20`}>
                            <div className="flex items-center">
                                <FaExclamationTriangle className="text-red-500 mr-3" />
                                <h2 className={`text-xl font-semibold text-red-600 dark:text-red-400`}>
                                    Danger Zone
                                </h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Delete Account
                                    </h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Once you delete your account, there is no going back. Please be certain.
                                    </p>
                                </div>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={saving}
                                    className="mt-4 sm:mt-0 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
                                >
                                    {saving ? <FaSpinner className="animate-spin mr-2" /> : <FaExclamationTriangle className="mr-2" />}
                                    {saving ? 'Deleting...' : 'Delete Account'}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SettingsPage;