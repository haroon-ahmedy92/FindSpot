// src/pages/MyItemsPage.jsx
import React, { useState, useEffect } from 'react';
import { FaMobileAlt, FaWallet, FaKey, FaBook, FaPlus, FaEdit, FaCheck, FaTrash, FaChevronLeft, FaChevronRight, FaEye, FaUndo } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import EditItemModal from '../components/items/EditItemModal';
import ItemService from '../api/itemService';
import Loading from '../components/ui/Loading';
import { useToast } from '../contexts/ToastContext';
import ConfirmModal from '../components/ui/ConfirmModal';

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
    const [justUpdatedItem, setJustUpdatedItem] = useState(false);
    const [initialCountsLoaded, setInitialCountsLoaded] = useState(false);
    
    // Count states for tab headers
    const [lostCount, setLostCount] = useState(0);
    const [foundCount, setFoundCount] = useState(0);
    const [resolvedCount, setResolvedCount] = useState(0);
    
    // Edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    // Confirm modal state
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmItemId, setConfirmItemId] = useState(null);

    // Secondary confirm modal for force remove scenarios
    const [isForceRemoveModalOpen, setIsForceRemoveModalOpen] = useState(false);
    const [forceRemoveItemId, setForceRemoveItemId] = useState(null);

    // Toast context
    const { showSuccess, showError, showInfo } = useToast();

    useEffect(() => {
        // Only fetch if we haven't just updated an item
        if (!justUpdatedItem) {
            // Only fetch counts on first load, not on every tab change
            if (!initialCountsLoaded) {
                fetchAllCounts();
                setInitialCountsLoaded(true);
            }
            fetchItems();
        }
    }, [activeTab, initialCountsLoaded, justUpdatedItem]);

    // Separate useEffect to handle the justUpdatedItem flag reset
    useEffect(() => {
        if (justUpdatedItem) {
            // Reset the flag after a short delay without triggering any API calls
            const timer = setTimeout(() => setJustUpdatedItem(false), 500);
            return () => clearTimeout(timer);
        }
    }, [justUpdatedItem]);

    // New function to fetch counts for all tabs
    const fetchAllCounts = async () => {
        try {
            const params = { page: 0, limit: 1 }; // Only need count, not actual data
            
            // Fetch counts for all tabs simultaneously
            const [lostResponse, foundResponse, resolvedResponse] = await Promise.all([
                ItemService.getMyLostItems({ ...params, status: 'ACTIVE' }),
                ItemService.getMyFoundItems({ ...params, status: 'ACTIVE' }),
                ItemService.getMyResolvedItems(params)
            ]);
            
            // Update counts from API responses
            setLostCount(lostResponse?.totalElements || lostResponse?.content?.length || 0);
            setFoundCount(foundResponse?.totalElements || foundResponse?.content?.length || 0);
            setResolvedCount(resolvedResponse?.totalElements || resolvedResponse?.content?.length || 0);
        } catch (err) {
            console.error('Error fetching counts:', err);
            // Don't show error for counts, just keep them at 0
        }
    };

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
                // Add status filter for active items only
                const lostParams = { ...params, status: 'ACTIVE' };
                const response = await ItemService.getMyLostItems(lostParams);
                console.log('Lost items API response:', response);
                if (response && response.content && response.content.length > 0) {
                    // Map response and filter for ACTIVE status items only
                    const mappedItems = response.content
                        .filter(item => item.status === 'ACTIVE') // Extra filter to ensure only active items
                        .map(item => ({
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
                    // Don't update count here - it's managed separately
                } else {
                    // No active lost items returned from API
                    console.log('No active lost items returned from API');
                    setLostItems([]);
                    // Don't update count here - it's managed separately
                }
            } else if (activeTab === 'found') {
                // Add status filter for active items only
                const foundParams = { ...params, status: 'ACTIVE' };
                const response = await ItemService.getMyFoundItems(foundParams);
                console.log('Found items API response:', response);
                if (response && response.content && response.content.length > 0) {
                    // Map response and filter for ACTIVE status items only
                    const mappedItems = response.content
                        .filter(item => item.status === 'ACTIVE') // Extra filter to ensure only active items
                        .map(item => ({
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
                    // Don't update count here - it's managed separately
                } else {
                    // No active found items returned from API
                    console.log('No active found items returned from API');
                    setFoundItems([]);
                    // Don't update count here - it's managed separately
                }
            } else if (activeTab === 'resolved') {
                // The resolved endpoint should return items with CLAIMED or CLOSED status by default
                const response = await ItemService.getMyResolvedItems(params);
                console.log('Resolved items API response:', response);
                if (response && response.content && response.content.length > 0) {
                    // Map response - resolved endpoint should already filter for resolved items
                    const mappedItems = response.content.map(item => ({
                        itemId: item.id,
                        title: item.title,
                        category: item.category,
                        location: item.location,
                        description: item.fullDescription || item.shortDescription,
                        createdAt: item.reportedDate || item.date,
                        resolvedAt: item.resolvedDate, // Now properly mapped from backend
                        itemType: item.type,
                        status: item.status || 'RESOLVED',
                        additionalDetails: item.additionalDetails || {}
                    }));
                    setResolvedItems(mappedItems);
                    // Don't update count here - it's managed separately
                } else {
                    // No resolved items returned from API
                    console.log('No resolved items returned from API');
                    setResolvedItems([]);
                    // Don't update count here - it's managed separately
                }
            }
        } catch (err) {
            console.error('Error fetching items:', err);
            setError(`Failed to load ${activeTab} items. Please try again.`);
            
            // Clear the arrays on error
            if (activeTab === 'lost') {
                setLostItems([]);
            } else if (activeTab === 'found') {
                setFoundItems([]);
            } else if (activeTab === 'resolved') {
                setResolvedItems([]);
            }
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
            
            // Set flag to prevent useEffect from reloading
            setJustUpdatedItem(true);
            
            // Remove the item from the state regardless of the active tab
            if (activeTab === 'lost') {
                setLostItems(prevItems =>
                    prevItems.filter(item => item.itemId !== itemId)
                );
                setLostCount(prev => Math.max(0, prev - 1));
            } else if (activeTab === 'found') {
                setFoundItems(prevItems =>
                    prevItems.filter(item => item.itemId !== itemId)
                );
                setFoundCount(prev => Math.max(0, prev - 1));
            } else if (activeTab === 'resolved') {
                setResolvedItems(prevItems =>
                    prevItems.filter(item => item.itemId !== itemId)
                );
                setResolvedCount(prev => Math.max(0, prev - 1));
            }
            
            // Show success message using toast
            showSuccess('Item deleted successfully');
        } catch (err) {
            console.error('Error deleting item:', err);
            
            // Show force remove confirmation modal instead of browser confirm
            setForceRemoveItemId(itemId);
            setIsForceRemoveModalOpen(true);
            showError('Failed to communicate with server. You can force remove the item from your list.');
        } finally {
            setActionLoading(false);
            setProcessingItemId(null);
        }
    };

    // Handle force remove confirmation
    const handleForceRemove = (itemId) => {
        // Set flag to prevent useEffect from reloading
        setJustUpdatedItem(true);
        
        // Remove item from UI even if backend failed
        if (activeTab === 'lost') {
            setLostItems(prevItems =>
                prevItems.filter(item => item.itemId !== itemId)
            );
            setLostCount(prev => Math.max(0, prev - 1));
        } else if (activeTab === 'found') {
            setFoundItems(prevItems =>
                prevItems.filter(item => item.itemId !== itemId)
            );
            setFoundCount(prev => Math.max(0, prev - 1));
        } else if (activeTab === 'resolved') {
            setResolvedItems(prevItems =>
                prevItems.filter(item => item.itemId !== itemId)
            );
            setResolvedCount(prev => Math.max(0, prev - 1));
        }
        
        setIsForceRemoveModalOpen(false);
        setForceRemoveItemId(null);
        showInfo('Item removed from your list.');
    };

    // Handle item status update with toast notifications
    const handleUpdateStatus = async (itemId, newStatus) => {
        try {
            setJustUpdatedItem(true);
            
            // Find the item to get its current status
            let itemToUpdate = null;
            let currentStatus = null;
            
            if (lostItems.some(item => item.itemId === itemId)) {
                itemToUpdate = lostItems.find(item => item.itemId === itemId);
                currentStatus = 'lost';
            } else if (foundItems.some(item => item.itemId === itemId)) {
                itemToUpdate = foundItems.find(item => item.itemId === itemId);
                currentStatus = 'found';
            }
            
            if (!itemToUpdate) return;
            
            await ItemService.updateItemStatus(itemId, newStatus);
            
            // Update the state immediately
            if (newStatus === 'CLAIMED' || newStatus === 'CLOSED' || newStatus === 'RESOLVED') {
                const resolvedItem = {
                    ...itemToUpdate,
                    status: newStatus,
                    resolvedAt: new Date().toISOString(),
                    itemType: currentStatus === 'lost' ? 'LOST' : 'FOUND'
                };
                
                // Remove from current arrays and add to resolved
                setLostItems(prevItems => prevItems.filter(item => item.itemId !== itemId));
                setFoundItems(prevItems => prevItems.filter(item => item.itemId !== itemId));
                setResolvedItems(prevItems => [resolvedItem, ...prevItems]);
                
                // Update counts efficiently
                if (currentStatus === 'lost') {
                    setLostCount(prev => Math.max(0, prev - 1));
                    showSuccess('Item marked as found and moved to resolved section');
                } else {
                    setFoundCount(prev => Math.max(0, prev - 1));
                    showSuccess('Item marked as returned and moved to resolved section');
                }
                setResolvedCount(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error updating item status:', error);
            showError('Failed to update item status');
            setJustUpdatedItem(false); // Reset flag on error
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

    // Handle reopening a resolved item
    const handleReopenItem = async (itemId) => {
        try {
            setJustUpdatedItem(true);
            
            // Find the item in resolved items
            const resolvedItem = resolvedItems.find(item => item.itemId === itemId);
            if (!resolvedItem) {
                showError('Item not found in resolved list');
                return;
            }
            
            // Call the new reopen API endpoint
            const response = await ItemService.reopenItem(itemId);
            
            if (response.success) {
                // Remove from resolved items
                setResolvedItems(prevItems => prevItems.filter(item => item.itemId !== itemId));
                
                // Add back to original list based on item type
                const reopenedItem = {
                    ...resolvedItem,
                    status: 'ACTIVE',
                    resolvedAt: null
                };
                
                if (resolvedItem.itemType === 'LOST') {
                    setLostItems(prevItems => [reopenedItem, ...prevItems]);
                    setLostCount(prev => prev + 1);
                    showSuccess('Lost item reopened and moved back to active items');
                } else if (resolvedItem.itemType === 'FOUND') {
                    setFoundItems(prevItems => [reopenedItem, ...prevItems]);
                    setFoundCount(prev => prev + 1);
                    showSuccess('Found item reopened and moved back to active items');
                }
                
                setResolvedCount(prev => Math.max(0, prev - 1));
            } else {
                showError(response.message || 'Failed to reopen item');
                setJustUpdatedItem(false); // Reset flag on error
            }
            
            return response;
        } catch (err) {
            console.error('Error reopening item:', err);
            setJustUpdatedItem(false); // Reset flag on error
            
            // Handle specific error cases
            if (err.response?.status === 400) {
                showError('Cannot reopen this item - it may not be in a resolved state');
            } else if (err.response?.status === 403) {
                showError('You do not have permission to reopen this item');
            } else if (err.response?.status === 404) {
                showError('Item not found');
            } else {
                showError('Failed to reopen item. Please try again.');
            }
            throw err;
        }
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
                                Items I've Lost ({lostCount})
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
                                Items I've Found ({foundCount})
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
                                Resolved ({resolvedCount})
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
                                                                    className="text-[#00AFB9] hover:text-[#0095a0] flex items-center"
                                                                    onClick={() => handleReopenItem(item.itemId)}
                                                                >
                                                                    <FaUndo className="mr-1" /> Reopen
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

                        {/* Force Remove Modal */}
                        {isForceRemoveModalOpen && (
                            <ConfirmModal
                                isOpen={isForceRemoveModalOpen}
                                onClose={() => {
                                    setIsForceRemoveModalOpen(false);
                                    setForceRemoveItemId(null);
                                }}
                                onConfirm={() => handleForceRemove(forceRemoveItemId)}
                                title="Server Error - Force Remove?"
                                message="Failed to communicate with the server. Do you want to remove this item from your list anyway? Note: This will only remove it from your view, not from the server."
                                confirmText="Force Remove"
                                cancelText="Cancel"
                                confirmButtonType="warning"
                            />
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default MyItemsPage;
