// src/pages/MyItemsPage.jsx
import React, { useState } from 'react';
import { FaMobileAlt, FaWallet, FaKey, FaBook, FaPlus, FaEdit, FaCheck, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MyItemsPage = () => {
    const [activeTab, setActiveTab] = useState('lost');
    const [notifications, setNotifications] = useState({
        email: true,
        similarItems: true,
        statusUpdates: true
    });

    // Sample data
    const lostItems = [
        {
            id: 1,
            name: "iPhone 12 Pro Max",
            category: "Electronics",
            location: "UDOM Campus, Dodoma",
            date: "April 12, 2023",
            status: "active",
            icon: <FaMobileAlt className="text-gray-500" />
        },
        {
            id: 2,
            name: "Physics Textbook",
            category: "Books",
            location: "Science Building, Room 105",
            date: "April 5, 2023",
            status: "active",
            icon: <FaBook className="text-gray-500" />
        }
    ];

    const foundItems = [
        {
            id: 3,
            name: "Blue Wallet",
            category: "Wallets & Purses",
            location: "Bus Stop near Main Gate",
            date: "April 16, 2023",
            status: "active",
            icon: <FaWallet className="text-gray-500" />
        }
    ];

    const resolvedItems = [
        {
            id: 4,
            name: "Dorm Keys",
            category: "Keys",
            type: "Lost",
            date: "April 2, 2023",
            resolutionDate: "April 3, 2023",
            icon: <FaKey className="text-gray-500" />
        }
    ];

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        setNotifications(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F8F9FA] to-white">

            <main className="flex-grow py-8">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-bold text-[#212529] mb-6">My Items</h1>

                        {/* Tabs */}
                        <div className="flex border-b border-[#E9ECEF] mb-6">
                            <button
                                onClick={() => setActiveTab('lost')}
                                className={`px-6 py-4 font-medium text-lg ${activeTab === 'lost' ? 'text-[#F35B04] border-b-2 border-[#F35B04]' : 'text-gray-500 hover:text-[#F35B04]'}`}
                            >
                                Items I've Lost ({lostItems.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('found')}
                                className={`px-6 py-4 font-medium text-lg ${activeTab === 'found' ? 'text-[#00AFB9] border-b-2 border-[#00AFB9]' : 'text-gray-500 hover:text-[#00AFB9]'}`}
                            >
                                Items I've Found ({foundItems.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('resolved')}
                                className={`px-6 py-4 font-medium text-lg ${activeTab === 'resolved' ? 'text-[#3D348B] border-b-2 border-[#3D348B]' : 'text-gray-500 hover:text-[#3D348B]'}`}
                            >
                                Resolved ({resolvedItems.length})
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                            {/* Lost Items Tab */}
                            {activeTab === 'lost' && (
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-semibold text-[#212529]">Lost Items</h2>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-4 py-2 bg-[#F35B04] text-white rounded-lg flex items-center"
                                        >
                                            <FaPlus className="mr-2" />
                                            Report New Lost Item
                                        </motion.button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-[#E9ECEF]">
                                            <thead className="bg-[#F8F9FA]">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[#212529] uppercase tracking-wider">Item</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[#212529] uppercase tracking-wider">Location</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[#212529] uppercase tracking-wider">Date Lost</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[#212529] uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[#212529] uppercase tracking-wider">Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-[#E9ECEF]">
                                            {lostItems.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0 bg-[#F8F9FA] rounded-full flex items-center justify-center">
                                                                {item.icon}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-[#212529]">{item.name}</div>
                                                                <div className="text-sm text-gray-500">{item.category}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.location}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.date}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-[#FFBE0B]/20 text-[#FFBE0B]">Active</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-3">
                                                            <button className="text-[#3D348B] hover:text-[#2c2566] flex items-center">
                                                                <FaEdit className="mr-1" /> Edit
                                                            </button>
                                                            <button className="text-[#00AFB9] hover:text-[#0095a0] flex items-center">
                                                                <FaCheck className="mr-1" /> Found
                                                            </button>
                                                            <button className="text-[#F35B04] hover:text-[#d95203] flex items-center">
                                                                <FaTrash className="mr-1" /> Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Found Items Tab */}
                            {activeTab === 'found' && (
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-semibold text-[#212529]">Found Items</h2>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-4 py-2 bg-[#00AFB9] text-white rounded-lg flex items-center"
                                        >
                                            <FaPlus className="mr-2" />
                                            Report New Found Item
                                        </motion.button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-[#E9ECEF]">
                                            <thead className="bg-[#F8F9FA]">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[#212529] uppercase tracking-wider">Item</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[#212529] uppercase tracking-wider">Location</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[#212529] uppercase tracking-wider">Date Found</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[#212529] uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[#212529] uppercase tracking-wider">Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-[#E9ECEF]">
                                            {foundItems.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0 bg-[#F8F9FA] rounded-full flex items-center justify-center">
                                                                {item.icon}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-[#212529]">{item.name}</div>
                                                                <div className="text-sm text-gray-500">{item.category}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.location}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.date}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-[#FFBE0B]/20 text-[#FFBE0B]">Active</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-3">
                                                            <button className="text-[#3D348B] hover:text-[#2c2566] flex items-center">
                                                                <FaEdit className="mr-1" /> Edit
                                                            </button>
                                                            <button className="text-[#00AFB9] hover:text-[#0095a0] flex items-center">
                                                                <FaCheck className="mr-1" /> Returned
                                                            </button>
                                                            <button className="text-[#F35B04] hover:text-[#d95203] flex items-center">
                                                                <FaTrash className="mr-1" /> Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Resolved Items Tab */}
                            {activeTab === 'resolved' && (
                                <div className="p-6">
                                    <h2 className="text-2xl font-semibold text-[#212529] mb-6">Resolved Items</h2>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-[#E9ECEF]">
                                            <thead className="bg-[#F8F9FA]">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[#212529] uppercase tracking-wider">Item</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[#212529] uppercase tracking-wider">Type</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[#212529] uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[#212529] uppercase tracking-wider">Resolution Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[#212529] uppercase tracking-wider">Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-[#E9ECEF]">
                                            {resolvedItems.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0 bg-[#F8F9FA] rounded-full flex items-center justify-center">
                                                                {item.icon}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-[#212529]">{item.name}</div>
                                                                <div className="text-sm text-gray-500">{item.category}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.type}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.date}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.resolutionDate}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-3">
                                                            <button className="text-[#3D348B] hover:text-[#2c2566]">
                                                                View
                                                            </button>
                                                            <button className="text-[#F35B04] hover:text-[#d95203]">
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Notification Settings */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold text-[#212529] mb-6">Notification Settings</h2>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="email-notifications"
                                                name="email"
                                                type="checkbox"
                                                checked={notifications.email}
                                                onChange={handleNotificationChange}
                                                className="h-4 w-4 text-[#3D348B] focus:ring-[#3D348B] border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="email-notifications" className="font-medium text-[#212529]">
                                                Email Notifications
                                            </label>
                                            <p className="text-gray-500">
                                                Receive email notifications when someone contacts you about your items.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="similar-items"
                                                name="similarItems"
                                                type="checkbox"
                                                checked={notifications.similarItems}
                                                onChange={handleNotificationChange}
                                                className="h-4 w-4 text-[#3D348B] focus:ring-[#3D348B] border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="similar-items" className="font-medium text-[#212529]">
                                                Similar Item Alerts
                                            </label>
                                            <p className="text-gray-500">
                                                Get notified when similar items to your lost items are found.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="status-updates"
                                                name="statusUpdates"
                                                type="checkbox"
                                                checked={notifications.statusUpdates}
                                                onChange={handleNotificationChange}
                                                className="h-4 w-4 text-[#3D348B] focus:ring-[#3D348B] border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="status-updates" className="font-medium text-[#212529]">
                                                Status Updates
                                            </label>
                                            <p className="text-gray-500">
                                                Receive notifications about the status of your items.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-4 py-2 bg-[#3D348B] text-white rounded-lg"
                                    >
                                        Save Settings
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

        </div>
    );
};

export default MyItemsPage;