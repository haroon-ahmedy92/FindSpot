import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ItemCard from '../ui/ItemCard';
import ItemService from '../../api/itemService';

const AllListings = ({ type, isDashboard }) => {
    const { type: urlType } = useParams(); // Read the type from URL params
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocationFilter] = useState('');
    const [sort, setSort] = useState('recent');
    const [currentPage, setCurrentPage] = useState(0); // Backend uses 0-based pagination
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

    // Set filter type based on URL parameter or prop
    useEffect(() => {
        const typeFromUrl = urlType && urlType !== 'all' ? urlType : '';
        const initialType = type || typeFromUrl;
        setFilterType(initialType);
    }, [urlType, type]);

    // Handle category query parameter
    useEffect(() => {
        const params = new URLSearchParams(locationHook.search);
        const categoryParam = params.get('category');
        if (categoryParam) {
            setCategory(categoryParam);
        }
    }, [locationHook.search]);

    // Fetch items when filters change
    useEffect(() => {
        if (isAuthenticated) {
            fetchItems();
        }
    }, [filterType, category, location, currentPage, itemsPerPage, isAuthenticated]);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isAuthenticated) {
                setCurrentPage(0); // Reset to first page when searching
                fetchItems();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchItems = async () => {
        if (!isAuthenticated) return;

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
                // Tag all items as lost type
                response.content = response.content?.map(item => ({
                    ...item,
                    itemType: 'lost'
                })) || [];
            } else if (filterType === 'found') {
                response = await ItemService.getFoundItems(params);
                // Tag all items as found type
                response.content = response.content?.map(item => ({
                    ...item,
                    itemType: 'found'
                })) || [];
            } else {
                // For "all" items, we need to implement proper pagination
                // Since we're combining both lost and found items, we need to handle pagination differently
                
                // First, get the total counts without pagination to calculate total pages
                const [lostCountResponse, foundCountResponse] = await Promise.all([
                    ItemService.getLostItems({ 
                        page: 0, 
                        limit: 1000, // Get a large number to count total items
                        ...(category && { category }),
                        ...(location && { location }),
                        ...(searchTerm && { search: searchTerm })
                    }),
                    ItemService.getFoundItems({ 
                        page: 0, 
                        limit: 1000, // Get a large number to count total items
                        ...(category && { category }),
                        ...(location && { location }),
                        ...(searchTerm && { search: searchTerm })
                    })
                ]);

                // Calculate combined totals
                const combinedTotalElements = (lostCountResponse.totalElements || 0) + (foundCountResponse.totalElements || 0);
                const combinedTotalPages = Math.ceil(combinedTotalElements / itemsPerPage);

                // Get all items and combine them
                const lostItems = lostCountResponse.content?.map(item => ({
                    ...item,
                    itemType: 'lost'
                })) || [];
                
                const foundItems = foundCountResponse.content?.map(item => ({
                    ...item,
                    itemType: 'found'
                })) || [];

                // Combine and sort all items (you might want to implement sorting based on date)
                const allItems = [...lostItems, ...foundItems];
                
                // Sort by creation date (most recent first) - adjust field name as needed
                allItems.sort((a, b) => new Date(b.createdAt || b.reportedDate || 0) - new Date(a.createdAt || a.reportedDate || 0));

                // Apply client-side pagination
                const startIndex = currentPage * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const paginatedItems = allItems.slice(startIndex, endIndex);

                response = {
                    content: paginatedItems,
                    totalPages: combinedTotalPages,
                    totalElements: combinedTotalElements,
                    number: currentPage,
                    size: itemsPerPage
                };
            }

            setItems(response.content || []);
            setTotalPages(response.totalPages || 0);
            setTotalElements(response.totalElements || 0);
            
        } catch (fetchError) {
            setError(fetchError.message || 'Failed to fetch items');
            console.error('Error fetching items:', fetchError);
        } finally {
            setLoading(false);
        }
    };

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

    // Show login message if not authenticated
    if (!isAuthenticated) {
        return (
            <section className="py-10 bg-gradient-to-b from-[#F8F9FA] to-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-[#212529] mb-4">Browse Items</h2>
                    <p className="text-gray-600 mb-6">Please log in to view and browse items.</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="bg-[#F35B04] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#d95203] transition-colors"
                    >
                        Log In
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="py-10 bg-gradient-to-b from-[#F8F9FA] to-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h2 className="text-3xl font-bold text-[#212529] mb-2">
                        Browse {filterType === 'lost' ? 'Lost' : filterType === 'found' ? 'Found' : 'All'} Items
                    </h2>
                    <p className="text-gray-600">
                        {totalElements > 0 ? `${totalElements} items found` : 'Searching for items...'}
                    </p>
                </motion.div>

                {/* Filter and Search Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-[#E9ECEF]">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Search Input */}
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search items..."
                                    className="w-full border-2 border-[#E9ECEF] rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-[#3D348B]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FaSearch className="absolute right-3 top-3 text-[#212529]/60" />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <select
                                className="px-4 py-3 border border-[#E9ECEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D348B]"
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
                                className="px-4 py-3 border border-[#E9ECEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D348B]"
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
                                className="px-4 py-3 border border-[#E9ECEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D348B]"
                                value={location}
                                onChange={(e) => {
                                    setLocationFilter(e.target.value);
                                    setCurrentPage(0);
                                }}
                            />

                            <select
                                className="px-4 py-3 border border-[#E9ECEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D348B]"
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
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <FaSpinner className="animate-spin text-3xl text-[#F35B04]" />
                        <span className="ml-3 text-lg text-gray-600">Loading items...</span>
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
                            <div className="col-span-full text-center text-[#212529]/60 py-10">
                                <p className="text-xl mb-2">No items found</p>
                                <p className="text-gray-500">
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
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E9ECEF] mx-1 text-[#212529]/60 hover:bg-[#F35B04] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                    : 'border border-[#E9ECEF] hover:bg-[#F35B04] hover:text-white'
                                            }`}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page + 1}
                                        </motion.button>
                                    );
                                }
                                if (page === currentPage - 2 || page === currentPage + 2) {
                                    return <span key={`ellipsis-${page}`} className="mx-2 text-[#212529]/60">...</span>;
                                }
                                return null;
                            })}
                            
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E9ECEF] mx-1 text-[#212529]/60 hover:bg-[#F35B04] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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