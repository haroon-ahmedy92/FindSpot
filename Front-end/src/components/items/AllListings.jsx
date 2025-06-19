import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ItemCard from '../ui/ItemCard';
import ItemService from '../../api/itemService';

const AllListings = ({ type, isDashboard }) => {
    const { type: urlType } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocationFilter] = useState('');
    const [sort, setSort] = useState('recent');
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(6);
    
    // API state
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const locationHook = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { isDarkMode } = useTheme();
    
    // Use refs to track initialization and prevent duplicate calls
    const isInitialized = useRef(false);
    const abortControllerRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // Initialize component state only once
    useEffect(() => {
        if (!isInitialized.current) {
            const typeFromUrl = urlType && urlType !== 'all' ? urlType : '';
            const initialType = type || typeFromUrl;
            setFilterType(initialType);

            const params = new URLSearchParams(locationHook.search);
            const categoryParam = params.get('category');
            if (categoryParam) {
                setCategory(categoryParam);
            }
            
            isInitialized.current = true;
        }
    }, [urlType, type, locationHook.search]);

    // Memoized fetch function to prevent recreation on every render
    const fetchItems = useCallback(async () => {
        if (!isInitialized.current) return;

        // Cancel any pending request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError('');
        
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                ...(category && { category }),
                ...(location && { location }),
                ...(searchTerm && { search: searchTerm })
            };

            let response;
            
            if (filterType === 'lost') {
                response = await ItemService.getLostItems(params);
                response.content = response.content?.map(item => ({
                    ...item,
                    itemType: 'lost'
                })) || [];
            } else if (filterType === 'found') {
                response = await ItemService.getFoundItems(params);
                response.content = response.content?.map(item => ({
                    ...item,
                    itemType: 'found'
                })) || [];
            } else {
                // For "all" items - simplified approach to avoid multiple API calls
                const [lostResponse, foundResponse] = await Promise.all([
                    ItemService.getLostItems({ 
                        page: Math.floor(currentPage / 2), 
                        limit: Math.ceil(itemsPerPage / 2),
                        ...(category && { category }),
                        ...(location && { location }),
                        ...(searchTerm && { search: searchTerm })
                    }),
                    ItemService.getFoundItems({ 
                        page: Math.floor(currentPage / 2), 
                        limit: Math.ceil(itemsPerPage / 2),
                        ...(category && { category }),
                        ...(location && { location }),
                        ...(searchTerm && { search: searchTerm })
                    })
                ]);

                const lostItems = lostResponse.content?.map(item => ({
                    ...item,
                    itemType: 'lost'
                })) || [];
                
                const foundItems = foundResponse.content?.map(item => ({
                    ...item,
                    itemType: 'found'
                })) || [];

                const allItems = [...lostItems, ...foundItems];
                allItems.sort((a, b) => new Date(b.createdAt || b.reportedDate || 0) - new Date(a.createdAt || a.reportedDate || 0));

                response = {
                    content: allItems.slice(0, itemsPerPage),
                    totalPages: Math.max(lostResponse.totalPages || 0, foundResponse.totalPages || 0),
                    totalElements: (lostResponse.totalElements || 0) + (foundResponse.totalElements || 0),
                    number: currentPage,
                    size: itemsPerPage
                };
            }

            // Only update state if the request wasn't aborted
            if (!abortControllerRef.current?.signal.aborted) {
                setItems(response.content || []);
                setTotalPages(response.totalPages || 0);
                setTotalElements(response.totalElements || 0);
            }
            
        } catch (fetchError) {
            // Only set error if request wasn't aborted
            if (!abortControllerRef.current?.signal.aborted) {
                setError(fetchError.message || 'Failed to fetch items');
                console.error('Error fetching items:', fetchError);
            }
        } finally {
            // Only set loading to false if request wasn't aborted
            if (!abortControllerRef.current?.signal.aborted) {
                setLoading(false);
            }
        }
    }, [filterType, category, location, currentPage, itemsPerPage, searchTerm]);

    // Main effect to fetch items when dependencies change
    useEffect(() => {
        if (isInitialized.current) {
            fetchItems();
        }
        
        // Cleanup function
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchItems]);

    // Debounced search effect
    useEffect(() => {
        if (!isInitialized.current) return;

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for search
        searchTimeoutRef.current = setTimeout(() => {
            setCurrentPage(0); // Reset to first page when searching
            // fetchItems will be called automatically due to currentPage change
        }, 500);

        // Cleanup function
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const categories = [
        'Electronics',
        'Documents',
        'Wallet',
        'Keys',
        'Bags',
        'Jewelry',
        'Clothing',
        'Other',
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const motionItemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
    };

    return (
        <section className={`py-10 ${
            isDarkMode 
                ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
                : 'bg-gradient-to-b from-[#F8F9FA] to-white'
        }`}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h2 className={`text-3xl font-bold mb-2 ${
                        isDarkMode ? 'text-white' : 'text-[#212529]'
                    }`}>
                        Browse {filterType === 'lost' ? 'Lost' : filterType === 'found' ? 'Found' : 'All'} Items
                    </h2>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {totalElements > 0 ? `${totalElements} items found` : loading ? 'Searching for items...' : 'No items found'}
                    </p>
                </motion.div>

                {/* Filter and Search Section */}
                <div className={`rounded-lg shadow-md p-6 mb-8 border ${
                    isDarkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-[#E9ECEF]'
                }`}>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Search Input */}
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search items..."
                                    className={`w-full border-2 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-[#3D348B] ${
                                        isDarkMode 
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                            : 'bg-white border-[#E9ECEF] text-gray-900 placeholder-gray-500'
                                    }`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FaSearch className={`absolute right-3 top-3 ${
                                    isDarkMode ? 'text-gray-400' : 'text-[#212529]/60'
                                }`} />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <select
                                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D348B] ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white' 
                                        : 'bg-white border-[#E9ECEF] text-gray-900'
                                }`}
                                value={filterType}
                                onChange={(e) => {
                                    setFilterType(e.target.value);
                                    setCurrentPage(0);
                                    if (!isDashboard) {
                                        navigate(`/listings/${e.target.value || 'all'}${category ? `?category=${encodeURIComponent(category)}` : ''}`);
                                    }
                                }}
                            >
                                <option value="">All Types</option>
                                <option value="lost">Lost Items</option>
                                <option value="found">Found Items</option>
                            </select>

                            <select
                                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D348B] ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white' 
                                        : 'bg-white border-[#E9ECEF] text-gray-900'
                                }`}
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    setCurrentPage(0);
                                    if (!isDashboard) {
                                        navigate(`/listings/${filterType || 'all'}${e.target.value ? `?category=${encodeURIComponent(e.target.value)}` : ''}`);
                                    }
                                }}
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="Location..."
                                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D348B] ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                        : 'bg-white border-[#E9ECEF] text-gray-900 placeholder-gray-500'
                                }`}
                                value={location}
                                onChange={(e) => {
                                    setLocationFilter(e.target.value);
                                    setCurrentPage(0);
                                }}
                            />

                            <select
                                className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D348B] ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white' 
                                        : 'bg-white border-[#E9ECEF] text-gray-900'
                                }`}
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="recent">Most Recent</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className={`p-4 rounded-lg mb-6 border ${
                        isDarkMode 
                            ? 'bg-red-900/30 border-red-600/30 text-red-300' 
                            : 'bg-red-100 text-red-700 border-red-200'
                    }`}>
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <FaSpinner className="animate-spin text-3xl text-[#F35B04]" />
                        <span className={`ml-3 text-lg ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>Loading items...</span>
                    </div>
                )}

                {/* Items Grid */}
                {!loading && (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {items.map((itemData) => (
                            <motion.div
                                key={itemData.id}
                                variants={motionItemVariants}
                            >
                                <ItemCard item={itemData} isDashboard={isDashboard} />
                            </motion.div>
                        ))}
                        {items.length === 0 && !loading && (
                            <div className="col-span-full text-center py-10">
                                <p className={`text-xl mb-2 ${
                                    isDarkMode ? 'text-gray-300' : 'text-[#212529]/60'
                                }`}>No items found</p>
                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                                    Try adjusting your search criteria or{' '}
                                    <button 
                                        onClick={() => {
                                            setSearchTerm('');
                                            setCategory('');
                                            setLocationFilter('');
                                            setCurrentPage(0);
                                        }}
                                        className="text-[#F35B04] hover:underline"
                                    >
                                        clear all filters
                                    </button>
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-center mt-10">
                        <nav className="flex items-center">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                className={`w-10 h-10 flex items-center justify-center rounded-full border mx-1 hover:bg-[#F35B04] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isDarkMode 
                                        ? 'border-gray-600 text-gray-300' 
                                        : 'border-[#E9ECEF] text-[#212529]/60'
                                }`}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                                disabled={currentPage === 0}
                            >
                                <FaChevronLeft />
                            </motion.button>
                            
                            {[...Array(totalPages)].map((_, index) => {
                                const page = index;
                                if (
                                    page === 0 ||
                                    page === totalPages - 1 ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <motion.button
                                            key={page}
                                            whileHover={{ scale: 1.1 }}
                                            className={`w-10 h-10 flex items-center justify-center rounded-full mx-1 ${
                                                currentPage === page
                                                    ? 'bg-[#3D348B] text-white'
                                                    : isDarkMode 
                                                        ? 'border border-gray-600 hover:bg-[#F35B04] hover:text-white text-gray-300' 
                                                        : 'border border-[#E9ECEF] hover:bg-[#F35B04] hover:text-white text-gray-900'
                                            }`}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page + 1}
                                        </motion.button>
                                    );
                                }
                                if (page === currentPage - 2 || page === currentPage + 2) {
                                    return <span key={`ellipsis-${page}`} className={`mx-2 ${
                                        isDarkMode ? 'text-gray-400' : 'text-[#212529]/60'
                                    }`}>...</span>;
                                }
                                return null;
                            })}
                            
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                className={`w-10 h-10 flex items-center justify-center rounded-full border mx-1 hover:bg-[#F35B04] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isDarkMode 
                                        ? 'border-gray-600 text-gray-300' 
                                        : 'border-[#E9ECEF] text-[#212529]/60'
                                }`}
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                                disabled={currentPage === totalPages - 1}
                            >
                                <FaChevronRight />
                            </motion.button>
                        </nav>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AllListings;