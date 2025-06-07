import React from 'react';

const Pagination = () => (
    <div className="mt-8 flex justify-between items-center">
        <div className="text-sm text-gray-600">
            Showing <span className="font-medium">1-6</span> of <span className="font-medium">12</span> items
        </div>
        <div className="flex space-x-1">
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 text-gray-600 hover:bg-gray-200">
                <i className="fas fa-chevron-left text-sm"></i>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 text-gray-600 hover:bg-gray-200">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 text-gray-600 hover:bg-gray-200">
                <i className="fas fa-chevron-right text-sm"></i>
            </button>
        </div>
    </div>
);

export default Pagination;