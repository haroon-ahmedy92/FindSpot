import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import ItemCard from '../ui/ItemCard';
import { lostItems } from '../../data/lostItems';
import { foundItems } from '../../data/foundItems';

const AllListings = ({ type, isDashboard }) => { // Added isDashboard prop
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState(type);
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('recent');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const location = useLocation();
    const navigate = useNavigate();

    // Handle category query parameter
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');
        if (categoryParam) {
            setCategory(categoryParam);
        }
    }, [location.search]);

    const items =
        filterType === 'lost'
            ? lostItems
            : filterType === 'found'
                ? foundItems
                : [...lostItems, ...foundItems];

    const filteredItems = items
        .filter(
            (item) =>
                (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (category ? item.category === category : true)
        )
        .sort((a, b) => {
            if (sort === 'recent') {
                return new Date(b.date) - new Date(a.date);
            }
            return new Date(a.date) - new Date(b.date);
        });

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const categories = [
        'Electronics',
        'Documents',
        'Wallets & Purses',
        'Keys',
        'Bags & Backpacks',
        'Accessories',
        'Books',
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

    const motionItemVariants = { // Renamed from 'item' to 'motionItemVariants'
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
    };

    return (
        <section className="py-10 bg-gradient-to-b from-[#F8F9FA] to-white">
            <div className="container mx-auto px-4">
                <motion.h2
                    className="text-3xl font-bold text-[#212529] mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Browse {filterType === 'lost' ? 'Lost' : filterType === 'found' ? 'Found' : 'All'} Items
                </motion.h2>

                {/* Filter and Search Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-[#E9ECEF]">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
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

                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:items-center gap-4">
                            <select
                                className="px-4 py-3 border border-[#E9ECEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D348B]"
                                value={filterType}
                                onChange={(e) => {
                                    setFilterType(e.target.value);
                                    navigate(`/listings/${e.target.value || 'all'}${category ? `?category=${encodeURIComponent(category)}` : ''}`);
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
                                    navigate(`/listings/${filterType || 'all'}${e.target.value ? `?category=${encodeURIComponent(e.target.value)}` : ''}`);
                                }}
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>

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

                {/* Items Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {paginatedItems.map((itemData, index) => ( // item renamed to itemData, index added
                        <motion.div
                            key={index} // Key changed to map index
                            variants={motionItemVariants} // Variants prop now correctly refers to the renamed definition
                        >
                            <ItemCard item={itemData} isDashboard={isDashboard} />
                        </motion.div>
                    ))}
                    {paginatedItems.length === 0 && (
                        <div className="col-span-full text-center text-[#212529]/60 py-10">
                            No items found for the selected category.
                        </div>
                    )}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-10">
                        <nav className="flex items-center">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E9ECEF] mx-1 text-[#212529]/60 hover:bg-[#F35B04] hover:text-white"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <FaChevronLeft />
                            </motion.button>
                            {[...Array(totalPages)].map((_, index) => {
                                const page = index + 1;
                                if (
                                    page === 1 ||
                                    page === totalPages ||
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
                                            {page}
                                        </motion.button>
                                    );
                                }
                                if (page === currentPage - 2 || page === currentPage + 2) {
                                    // Ensure unique keys for ellipsis by adding a prefix/suffix
                                    return <span key={`ellipsis-${page}`} className="mx-2 text-[#212529]/60">...</span>;
                                }
                                return null;
                            })}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E9ECEF] mx-1 text-[#212529]/60 hover:bg-[#F35B04] hover:text-white"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
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