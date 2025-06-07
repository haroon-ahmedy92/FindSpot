import React, { useState } from 'react';

const ItemFilters = () => {
    const [activeTab, setActiveTab] = useState('all');

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex border-b border-gray-200 mb-4 md:mb-0">
                {[
                    { id: 'all', label: 'All Items (12)' },
                    { id: 'lost', label: 'Lost (7)' },
                    { id: 'found', label: 'Found (5)' },
                    { id: 'resolved', label: 'Resolved (3)' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-2 px-4 font-medium ${activeTab === tab.id ? 'tab-active' : 'text-gray-600 hover:text-primary'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                <div className="relative">
                    <select className="bg-gray-100 rounded-lg py-2 pl-3 pr-8 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>All Categories</option>
                        <option>Electronics</option>
                        <option>Documents</option>
                        <option>Keys</option>
                        <option>Wallets</option>
                        <option>Accessories</option>
                    </select>
                    <i className="fas fa-chevron-down absolute right-3 top-3 text-gray-500 pointer-events-none"></i>
                </div>
                <div className="relative">
                    <select className="bg-gray-100 rounded-lg py-2 pl-3 pr-8 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Sort: Newest First</option>
                        <option>Sort: Oldest First</option>
                        <option>Sort: A-Z</option>
                        <option>Sort: Z-A</option>
                    </select>
                    <i className="fas fa-chevron-down absolute right-3 top-3 text-gray-500 pointer-events-none"></i>
                </div>
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search items..."
                        className="bg-gray-100 rounded-lg py-2 px-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button className="absolute right-2 top-2 text-gray-500 hover:text-primary">
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemFilters;