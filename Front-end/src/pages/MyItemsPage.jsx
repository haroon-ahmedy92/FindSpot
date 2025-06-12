// src/pages/MyItemsPage.jsx
import React, { useState, useEffect } from 'react';
import { FaMobileAlt, FaWallet, FaKey, FaBook, FaPlus, FaEdit, FaCheck, FaTrash, FaChevronLeft, FaChevronRight, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import EditItemModal from '../components/items/EditItemModal';
import ItemService from '../api/itemService';
import Loading from '../components/ui/Loading';
import { useToast } from '../contexts/ToastContext';
import ConfirmModal from '../components/ui/ConfirmModal';

// Mock data for testing

const MyItemsPage = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const [activeTab, setActiveTab] = useState('lost');
    const [notifications, setNotifications] = useState({
        email: true,
        similarItems: true,
        statusUpdates: true
    });
    
    // Real data state
    const [lostItems, setLostItems] = useState([]);
    const [foundItems, setFoundItems] = useState([]);
    const [resolvedItems, setResolvedItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [processingItemId, setProcessingItemId] = useState(null);
    
    // Edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    // Confirm modal state
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmItemId, setConfirmItemId] = useState(null);

    // Toast context
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        fetchItems();
    }, [activeTab]);

    const fetchItems = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const params = {
                sortBy: 'reportedDate',
                sortDir: 'DESC',
                page: 0,
                limit: 10
            };
            
            if (activeTab === 'lost') {
                const response = await ItemService.getMyLostItems(params);
                console.log('Lost items API response:', response);
                if (response && response.content && response.content.length > 0) {
                    // Map response to match component expectations
                    const mappedItems = response.content.map(item => ({
                        itemId: item.id,
                        title: item.title,
                        category: item.category,
                        location: item.location,
                        description: item.fullDescription || item.shortDescription,
                        createdAt: item.reportedDate || item.date,
                        status: item.status || 'ACTIVE',
                        additionalDetails: item.additionalDetails || {}
                    }));
                    setLostItems(mappedItems);
                } else {
                    // Use mock data if API returns empty results
                    console.log('Using mock lost items data - no items returned from API');
                    setLostItems(MOCK_LOST_ITEMS);
                }
            } else if (activeTab === 'found') {
                const response = await ItemService.getMyFoundItems(params);
                console.log('Found items API response:', response);
                if (response && response.content && response.content.length > 0) {
                    // Map response to match component expectations
                    const mappedItems = response.content.map(item => ({
                        itemId: item.id,
                        title: item.title,
                        category: item.category,
                        location: item.location,
                        description: item.fullDescription || item.shortDescription,
                        createdAt: item.reportedDate || item.date,
                        status: item.status || 'ACTIVE',
                        additionalDetails: item.additionalDetails || {}
                    }));
                    setFoundItems(mappedItems);
                } else {
                    // Use mock data if API returns empty results
                    console.log('Using mock found items data - no items returned from API');
                    setFoundItems(MOCK_FOUND_ITEMS);
                }
            } else if (activeTab === 'resolved') {
                const response = await ItemService.getMyResolvedItems(params);
                console.log('Resolved items API response:', response);
                if (response && response.content && response.content.length > 0) {
                    // Map response to match component expectations
                    const mappedItems = response.content.map(item => ({
                        itemId: item.id,
                        title: item.title,
                        category: item.category,
                        location: item.location,
                        description: item.fullDescription || item.shortDescription,
                        createdAt: item.reportedDate || item.date,
                        resolvedAt: item.resolvedDate,
                        itemType: item.type,
                        status: item.status || 'RESOLVED',
                        additionalDetails: item.additionalDetails || {}
                    }));
                    setResolvedItems(mappedItems);
                } else {
                    // Use mock data if API returns empty results
                    console.log('Using mock resolved items data - no items returned from API');
                    setResolvedItems(MOCK_RESOLVED_ITEMS);
                }
            }
        } catch (err) {
            console.error('Error fetching items:', err);
            
            // Use mock data as fallback on error
            if (activeTab === 'lost') {
                console.log('Using mock lost items data due to error');
                setLostItems(MOCK_LOST_ITEMS);
            } else if (activeTab === 'found') {
                console.log('Using mock found items data due to error');
                setFoundItems(MOCK_FOUND_ITEMS);
            } else if (activeTab === 'resolved') {
                console.log('Using mock resolved items data due to error');
                setResolvedItems(MOCK_RESOLVED_ITEMS);
            }
            
            setError('Failed to load items from API. Showing sample data instead.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (item) => {
        setCurrentItem(item);
        setIsEditModalOpen(true);
    };

    const handleUpdateItem = async (itemId, updatedData) => {
        setActionLoading(true);
        setProcessingItemId(itemId);
        
        try {
            const response = await ItemService.updateItem(itemId, updatedData);
            
            // Update the item in the state
            if (activeTab === 'lost') {
                setLostItems(prevItems => 
                    prevItems.map(item => 
                        item.itemId === itemId ? { ...item, ...updatedData } : item
                    )
                );
            } else if (activeTab === 'found') {
                setFoundItems(prevItems => 
                    prevItems.map(item => 
                        item.itemId === itemId ? { ...item, ...updatedData } : item
                    )
                );
            }
            
            showSuccess('Item updated successfully');
            return response;
        } catch (err) {
            console.error('Error updating item:', err);
            showError('Failed to update item. Please try again.');
            throw err;
        } finally {
            setActionLoading(false);
            setProcessingItemId(null);
        }
    };

    // Handle item deletion with toast notifications instead of browser alerts
    const handleDeleteItem = async (itemId) => {
        if (!itemId) {
            showError('Invalid item ID. Cannot delete this item.');
            return;
        }
        
        setConfirmItemId(itemId);
        setConfirmAction(() => () => performDeleteItem(itemId));
        setIsConfirmModalOpen(true);
    };

    const performDeleteItem = async (itemId) => {
        setActionLoading(true);
        setProcessingItemId(itemId);
        try {
            console.log(`Attempting to delete item with ID: ${itemId}`);
            await ItemService.deleteItem(itemId);
            
            // Remove the item from the state regardless of the active tab
            if (activeTab === 'lost') {
                setLostItems(prevItems =>
                    prevItems.filter(item => item.itemId !== itemId)
                );
            } else if (activeTab === 'found') {
                setFoundItems(prevItems =>
                    prevItems.filter(item => item.itemId !== itemId)
                );
            } else if (activeTab === 'resolved') {
                setResolvedItems(prevItems =>
                    prevItems.filter(item => item.itemId !== itemId)
                );
            }
            
            // Show success message using toast
            showSuccess('Item deleted successfully');
        } catch (err) {
            console.error('Error deleting item:', err);
            
            // Force remove from UI if backend error but we still want to remove it visually
            const forceRemove = confirm('Error communicating with server. Remove item from your list anyway?');
            if (forceRemove) {
                if (activeTab === 'lost') {
                    setLostItems(prevItems =>
                        prevItems.filter(item => item.itemId !== itemId)
                    );
                } else if (activeTab === 'found') {
                    setFoundItems(prevItems =>
                        prevItems.filter(item => item.itemId !== itemId)
                    );
                } else if (activeTab === 'resolved') {
                    setResolvedItems(prevItems =>
                        prevItems.filter(item => item.itemId !== itemId)
                    );
                }
                showInfo('Item removed from your list.');
            } else {
                showError('Failed to delete item. Please try again.');
            }
        } finally {
            setActionLoading(false);
            setProcessingItemId(null);
        }
    };

    // Handle item status update with toast notifications
    const handleUpdateStatus = async (itemId, newStatus) => {
        setActionLoading(true);
        setProcessingItemId(itemId);
        
        try {
            const response = await ItemService.updateItemStatus(itemId, newStatus);
            
            // Update the item in the state
            const updatedItem = {
                ...response,
                status: newStatus
            };
            
            // If status is changed to a resolved status, move it to resolved tab
            if (newStatus === 'CLAIMED' || newStatus === 'CLOSED' || newStatus === 'RESOLVED') {
                // Remove from current tab
                if (activeTab === 'lost') {
                    setLostItems(prevItems => 
                        prevItems.filter(item => item.itemId !== itemId)
                    );
                } else if (activeTab === 'found') {
                    setFoundItems(prevItems => 
                        prevItems.filter(item => item.itemId !== itemId)
                    );
                }
                
                // Add to resolved items
                setResolvedItems(prevItems => [
                    { 
                        ...prevItems.find(item => item.itemId === itemId) || updatedItem,
                        status: newStatus,
                        resolvedAt: new Date().toISOString()
                    },
                    ...prevItems
                ]);
                
                showSuccess('Item has been marked as resolved');
            } else {
                // Just update the status in the current tab
                if (activeTab === 'lost') {
                    setLostItems(prevItems => 
                        prevItems.map(item => 
                            item.itemId === itemId ? { ...item, status: newStatus } : item
                        )
                    );
                } else if (activeTab === 'found') {
                    setFoundItems(prevItems => 
                        prevItems.map(item => 
                            item.itemId === itemId ? { ...item, status: newStatus } : item
                        )
                    );
                }
                
                showSuccess(`Item status updated to ${newStatus}`);
            }
            
            return response;
        } catch (err) {
            console.error('Error updating item status:', err);
            showError('Failed to update item status. Please try again.');
            throw err;
        } finally {
            setActionLoading(false);
            setProcessingItemId(null);
        }
    };

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        setNotifications(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    // Add handler for saving notification settings
    const handleSaveSettings = () => {
        // In a real application, you would save these settings to the backend
        // For now, we'll just show a success toast
        setActionLoading(true);
        
        // Simulate API call with timeout
        setTimeout(() => {
            showSuccess('Notification settings saved successfully!');
            setActionLoading(false);
        }, 800);
    };

    // Handle viewing item details
    const handleViewItem = (itemId) => {
        navigate(`/dashboard/item/${itemId}`);
    };

    return (
        <div className={`min-h-screen flex flex-col ${
            isDarkMode 
                ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
                : 'bg-gradient-to-b from-[#F8F9FA] to-white'
        }`}>
            {actionLoading && processingItemId === null && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
                    <div className={`p-5 rounded-lg flex flex-col items-center ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <Loading size="lg" color="#3D348B" />
                        <p className={`mt-4 font-medium ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>Processing...</p>
                    </div>
                </div>
            )}

            <main className="flex-grow py-8">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className={`text-3xl font-bold mb-6 ${
                            isDarkMode ? 'text-white' : 'text-[#212529]'
                        }`}>My Items</h1>

                        {/* Tabs */}
                        <div className={`flex border-b mb-6 ${
                            isDarkMode ? 'border-gray-700' : 'border-[#E9ECEF]'
                        }`}>
                            <button
                                onClick={() => setActiveTab('lost')}
                                className={`px-6 py-4 font-medium text-lg ${
                                    activeTab === 'lost' 
                                        ? 'text-[#F35B04] border-b-2 border-[#F35B04]' 
                                        : isDarkMode 
                                            ? 'text-gray-400 hover:text-[#F35B04]' 
                                            : 'text-gray-500 hover:text-[#F35B04]'
                                }`}
                            >
                                Items I've Lost ({lostItems.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('found')}
                                className={`px-6 py-4 font-medium text-lg ${
                                    activeTab === 'found' 
                                        ? 'text-[#00AFB9] border-b-2 border-[#00AFB9]' 
                                        : isDarkMode 
                                            ? 'text-gray-400 hover:text-[#00AFB9]' 
                                            : 'text-gray-500 hover:text-[#00AFB9]'
                                }`}
                            >
                                Items I've Found ({foundItems.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('resolved')}
                                className={`px-6 py-4 font-medium text-lg ${
                                    activeTab === 'resolved' 
                                        ? 'text-[#3D348B] border-b-2 border-[#3D348B]' 
                                        : isDarkMode 
                                            ? 'text-gray-400 hover:text-[#3D348B]' 
                                            : 'text-gray-500 hover:text-[#3D348B]'
                                }`}
                            >
                                Resolved ({resolvedItems.length})
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className={`rounded-xl shadow-lg overflow-hidden mb-8 ${
                            isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                            {/* Lost Items Tab */}
                            {activeTab === 'lost' && (
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className={`text-2xl font-semibold ${
                                            isDarkMode ? 'text-white' : 'text-[#212529]'
                                        }`}>Lost Items</h2>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-4 py-2 bg-[#F35B04] text-white rounded-lg flex items-center"
                                            onClick={() => navigate('/dashboard/report-lost')}
                                        >
                                            <FaPlus className="mr-2" />
                                            Report New Lost Item
                                        </motion.button>
                                    </div>

                                    {loading ? (
                                        <div className="flex justify-center py-8">
                                            <Loading size="lg" color="#F35B04" />
                                        </div>
                                    ) : error ? (
                                        <div className={`border rounded-lg p-4 my-4 ${
                                            isDarkMode 
                                                ? 'bg-red-900/30 border-red-600/30 text-red-300' 
                                                : 'bg-red-50 border-red-200 text-red-700'
                                        }`}>
                                            <p>{error}</p>
                                        </div>
                                    ) : lostItems.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                                                You haven't reported any lost items yet.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className={`min-w-full divide-y ${
                                                isDarkMode ? 'divide-gray-700' : 'divide-[#E9ECEF]'
                                            }`}>
                                                <thead className={isDarkMode ? 'bg-gray-700' : 'bg-[#F8F9FA]'}>
                                                <tr>
                                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                        isDarkMode ? 'text-gray-300' : 'text-[#212529]'
                                                    }`}>Item</th>
                                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                        isDarkMode ? 'text-gray-300' : 'text-[#212529]'
                                                    }`}>Location</th>
                                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                        isDarkMode ? 'text-gray-300' : 'text-[#212529]'
                                                    }`}>Date Lost</th>
                                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                        isDarkMode ? 'text-gray-300' : 'text-[#212529]'
                                                    }`}>Status</th>
                                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                        isDarkMode ? 'text-gray-300' : 'text-[#212529]'
                                                    }`}>Actions</th>
                                                </tr>
                                                </thead>
                                                <tbody className={`divide-y ${
                                                    isDarkMode 
                                                        ? 'bg-gray-800 divide-gray-700' 
                                                        : 'bg-white divide-[#E9ECEF]'
                                                }`}>
                                                {lostItems.map((item) => (
                                                    <tr key={item.itemId}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center ${
                                                                    isDarkMode ? 'bg-gray-700' : 'bg-[#F8F9FA]'
                                                                }`}>
                                                                    {item.category === 'Keys' && <FaKey className="text-[#F35B04]" />}
                                                                    {item.category === 'Wallet' && <FaWallet className="text-[#F35B04]" />}
                                                                    {item.category === 'Electronics' && <FaMobileAlt className="text-[#F35B04]" />}
                                                                    {item.category === 'Books' && <FaBook className="text-[#F35B04]" />}
                                                                    {!['Keys', 'Wallet', 'Electronics', 'Books'].includes(item.category) && 
                                                                        <div className="text-[#F35B04] font-bold">{item.category?.charAt(0)}</div>}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className={`text-sm font-medium ${
                                                                        isDarkMode ? 'text-white' : 'text-[#212529]'
                                                                    }`}>{item.title}</div>
                                                                    <div className={`text-sm ${
                                                                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                                    }`}>{item.category}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                                                            isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                                        }`}>
                                                            {item.location}
                                                        </td>
                                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                                                            isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                                        }`}>
                                                            {new Date(item.createdAt || item.date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                                item.status === 'ACTIVE' ? 'bg-[#FFBE0B]/20 text-[#FFBE0B]' :
                                                                item.status === 'RESOLVED' ? 'bg-[#00AFB9]/20 text-[#00AFB9]' :
                                                                'bg-gray-200 text-gray-600'
                                                            }`}>
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex space-x-3">
                                                                <button 
                                                                    className="text-[#3D348B] hover:text-[#2c2566] flex items-center" 
                                                                    onClick={() => handleEditClick(item)}
                                                                >
                                                                    <FaEdit className="mr-1" /> Edit
                                                                </button>
                                                                <button 
                                                                    className="text-[#00AFB9] hover:text-[#0095a0] flex items-center"
                                                                    onClick={() => handleUpdateStatus(item.itemId, 'CLAIMED')}
                                                                >
                                                                    <FaCheck className="mr-1" /> Found
                                                                </button>
                                                                <button 
                                                                    className="text-[#F35B04] hover:text-[#d95203] flex items-center" 
                                                                    onClick={() => handleDeleteItem(item.itemId)}
                                                                >
                                                                    <FaTrash className="mr-1" /> Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Found Items Tab */}
                            {activeTab === 'found' && (
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className={`text-2xl font-semibold ${
                                            isDarkMode ? 'text-white' : 'text-[#212529]'
                                        }`}>Found Items</h2>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-4 py-2 bg-[#00AFB9] text-white rounded-lg flex items-center"
                                            onClick={() => navigate('/dashboard/report-found')}
                                        >
                                            <FaPlus className="mr-2" />
                                            Report New Found Item
                                        </motion.button>
                                    </div>

                                    {loading ? (
                                        <div className="flex justify-center py-8">
                                            <Loading size="lg" color="#00AFB9" />
                                        </div>
                                    ) : error ? (
                                        <div className={`border rounded-lg p-4 my-4 ${
                                            isDarkMode 
                                                ? 'bg-red-900/30 border-red-600/30 text-red-300' 
                                                : 'bg-red-50 border-red-200 text-red-700'
                                        }`}>
                                            <p>{error}</p>
                                        </div>
                                    ) : foundItems.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                                                You haven't reported any found items yet.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className={`min-w-full divide-y ${
                                                isDarkMode ? 'divide-gray-700' : 'divide-[#E9ECEF]'
                                            }`}>
                                                <thead className={isDarkMode ? 'bg-gray-700' : 'bg-[#F8F9FA]'}>
                                                <tr>
                                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                        isDarkMode ? 'text-gray-300' : 'text-[#212529]'
                                                    }`}>Item</th>
                                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                        isDarkMode ? 'text-gray-300' : 'text-[#212529]'
                                                    }`}>Location</th>
                                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                        isDarkMode ? 'text-gray-300' : 'text-[#212529]'
                                                    }`}>Date Found</th>
                                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                        isDarkMode ? 'text-gray-300' : 'text-[#212529]'
                                                    }`}>Status</th>
                                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                        isDarkMode ? 'text-gray-300' : 'text-[#212529]'
                                                    }`}>Actions</th>
                                                </tr>
                                                </thead>
                                                <tbody className={`divide-y ${
                                                    isDarkMode 
                                                        ? 'bg-gray-800 divide-gray-700' 
                                                        : 'bg-white divide-[#E9ECEF]'
                                                }`}>
                                                {foundItems.map((item) => (
                                                    <tr key={item.itemId}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center ${
                                                                    isDarkMode ? 'bg-gray-700' : 'bg-[#F8F9FA]'
                                                                }`}>
                                                                    {item.category === 'Keys' && <FaKey className="text-[#00AFB9]" />}
                                                                    {item.category === 'Wallet' && <FaWallet className="text-[#00AFB9]" />}
                                                                    {item.category === 'Electronics' && <FaMobileAlt className="text-[#00AFB9]" />}
                                                                    {item.category === 'Books' && <FaBook className="text-[#00AFB9]" />}
                                                                    {!['Keys', 'Wallet', 'Electronics', 'Books'].includes(item.category) && 
                                                                        <div className="text-[#00AFB9] font-bold">{item.category?.charAt(0)}</div>}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className={`text-sm font-medium ${
                                                                        isDarkMode ? 'text-white' : 'text-[#212529]'
                                                                    }`}>{item.title}</div>
                                                                    <div className={`text-sm ${
                                                                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                                    }`}>{item.category}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                                                            isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                                        }`}>
                                                            {item.location}
                                                        </td>
                                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                                                            isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                                        }`}>
                                                            {new Date(item.createdAt || item.date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                                item.status === 'ACTIVE' ? 'bg-[#FFBE0B]/20 text-[#FFBE0B]' :
                                                                item.status === 'RESOLVED' ? 'bg-[#00AFB9]/20 text-[#00AFB9]' :
                                                                'bg-gray-200 text-gray-600'
                                                            }`}>
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex space-x-3">
                                                                <button 
                                                                    className="text-[#3D348B] hover:text-[#2c2566] flex items-center" 
                                                                    onClick={() => handleEditClick(item)}
                                                                >
                                                                    <FaEdit className="mr-1" /> Edit
                                                                </button>
                                                                <button 
                                                                    className="text-[#00AFB9] hover:text-[#0095a0] flex items-center"
                                                                    onClick={() => handleUpdateStatus(item.itemId, 'CLAIMED')}
                                                                >
                                                                    <FaCheck className="mr-1" /> Returned
                                                                </button>
                                                                <button className="text-[#F35B04] hover:text-[#d95203] flex items-center" onClick={() => handleDeleteItem(item.itemId)}>
                                                                    <FaTrash className="mr-1" /> Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Resolved Items Tab */}
                            {activeTab === 'resolved' && (
                                <div className="p-6">
                                    <h2 className={`text-2xl font-semibold mb-6 ${
                                        isDarkMode ? 'text-white' : 'text-[#212529]'
                                    }`}>Resolved Items</h2>

                                    {loading ? (
                                        <div className="flex justify-center py-8">
                                            <Loading size="lg" color="#3D348B" />
                                        </div>
                                    ) : error ? (
                                        <div className={`border rounded-lg p-4 my-4 ${
                                            isDarkMode 
                                                ? 'bg-red-900/30 border-red-600/30 text-red-300' 
                                                : 'bg-red-50 border-red-200 text-red-700'
                                        }`}>
                                            <p>{error}</p>
                                        </div>
                                    ) : resolvedItems.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                                                You don't have any resolved items yet.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className={`min-w-full divide-y ${
                                                isDarkMode ? 'divide-gray-700' : 'divide-[#E9ECEF]'
                                            }`}>
                                                <thead className={isDarkMode ? 'bg-gray-700' : 'bg-[#F8F9FA]'}>
                                                <tr>
                                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                        isDarkMode ? 'text-gray-300' : 'text-[#212529]'
                                                    }`}>Item</th>
                                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                        isDarkMode ? 'text-gray-300' : 'text-[#212529]'
                                                    }`}>Type</th>
                                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                        isDarkMode ? 'text-gray-300' : 'text-[#212529]'
                                                    }`}>Date</th>
                                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                        isDarkMode ? 'text-gray-300' : 'text-[#212529]'
                                                    }`}>Resolution Date</th>
                                                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                        isDarkMode ? 'text-gray-300' : 'text-[#212529]'
                                                    }`}>Actions</th>
                                                </tr>
                                                </thead>
                                                <tbody className={`divide-y ${
                                                    isDarkMode 
                                                        ? 'bg-gray-800 divide-gray-700' 
                                                        : 'bg-white divide-[#E9ECEF]'
                                                }`}>
                                                {resolvedItems.map((item) => (
                                                    <tr key={item.itemId}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center ${
                                                                    isDarkMode ? 'bg-gray-700' : 'bg-[#F8F9FA]'
                                                                }`}>
                                                                    {item.category === 'Keys' && <FaKey className="text-[#3D348B]" />}
                                                                    {item.category === 'Wallet' && <FaWallet className="text-[#3D348B]" />}
                                                                    {item.category === 'Electronics' && <FaMobileAlt className="text-[#3D348B]" />}
                                                                    {item.category === 'Books' && <FaBook className="text-[#3D348B]" />}
                                                                    {!['Keys', 'Wallet', 'Electronics', 'Books'].includes(item.category) && 
                                                                        <div className="text-[#3D348B] font-bold">{item.category?.charAt(0)}</div>}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className={`text-sm font-medium ${
                                                                        isDarkMode ? 'text-white' : 'text-[#212529]'
                                                                    }`}>{item.title}</div>
                                                                    <div className={`text-sm ${
                                                                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                                    }`}>{item.category}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                                                            isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                                        }`}>
                                                            {item.itemType === 'LOST' ? 'Lost' : 'Found'}
                                                        </td>
                                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                                                            isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                                        }`}>
                                                            {new Date(item.createdAt || item.date).toLocaleDateString()}
                                                        </td>
                                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                                                            isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                                        }`}>
                                                            {item.resolvedAt ? new Date(item.resolvedAt).toLocaleDateString() : 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex space-x-3">
                                                                <button 
                                                                    className="text-[#3D348B] hover:text-[#2c2566] flex items-center"
                                                                    onClick={() => handleViewItem(item.itemId)}
                                                                >
                                                                    <FaEye className="mr-1" /> View
                                                                </button>
                                                                <button 
                                                                    className="text-[#F35B04] hover:text-[#d95203]"
                                                                    onClick={() => handleDeleteItem(item.itemId)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Notification Settings */}
                        <div className={`rounded-xl shadow-lg overflow-hidden ${
                            isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                            <div className="p-6">
                                <h2 className={`text-2xl font-semibold mb-6 ${
                                    isDarkMode ? 'text-white' : 'text-[#212529]'
                                }`}>Notification Settings</h2>

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
                                            <label htmlFor="email-notifications" className={`font-medium ${
                                                isDarkMode ? 'text-white' : 'text-[#212529]'
                                            }`}>
                                                Email Notifications
                                            </label>
                                            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
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
                                            <label htmlFor="similar-items" className={`font-medium ${
                                                isDarkMode ? 'text-white' : 'text-[#212529]'
                                            }`}>
                                                Similar Item Alerts
                                            </label>
                                            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
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
                                            <label htmlFor="status-updates" className={`font-medium ${
                                                isDarkMode ? 'text-white' : 'text-[#212529]'
                                            }`}>
                                                Status Updates
                                            </label>
                                            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
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
                                        onClick={handleSaveSettings}
                                    >
                                        Save Settings
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Edit Item Modal */}
                        {isEditModalOpen && currentItem && (
                            <EditItemModal
                                isOpen={isEditModalOpen}
                                onClose={() => setIsEditModalOpen(false)}
                                item={currentItem}
                                onSave={handleUpdateItem}
                            />
                        )}

                        {/* Confirm Delete Modal */}
                        {isConfirmModalOpen && (
                            <ConfirmModal
                                isOpen={isConfirmModalOpen}
                                onClose={() => setIsConfirmModalOpen(false)}
                                onConfirm={confirmAction}
                                title="Confirm Deletion"
                                message="Are you sure you want to delete this item? This action cannot be undone."
                                confirmText="Delete"
                                cancelText="Cancel"
                            />
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default MyItemsPage;
