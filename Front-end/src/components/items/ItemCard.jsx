import React from 'react';
import Button from '../common/Button';

const ItemCard = ({ title, status, image, description, location, date }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition card">
        <div className="h-40 overflow-hidden bg-gray-100 relative">
            <img src={image} className="w-full h-full object-cover" alt={title} />
            <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs badge-${status}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
        </div>
        <div className={`p-4 ${status === 'resolved' ? 'bg-gray-50' : ''}`}>
            <h4 className="font-semibold text-lg mb-2">{title}</h4>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
            <div className="flex items-center text-sm text-gray-500 mb-2">
                <i className="fas fa-map-marker-alt mr-2"></i>
                <span>{location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-3">
                <i className="far fa-calendar-alt mr-2"></i>
                <span>{status === 'lost' ? 'Lost' : status === 'found' ? 'Found' : 'Resolved'} on: {date}</span>
            </div>
            {status === 'resolved' ? (
                <div className="text-center py-2 text-sm text-accent font-medium">
                    <i className="fas fa-check-circle mr-1"></i> This item has been returned to you
                </div>
            ) : (
                <div className="flex space-x-2">
                    <Button className="flex-1" icon="fa-edit">
                        Edit
                    </Button>
                    <Button variant="accent" className="flex-1" icon="fa-check">
                        Resolve
                    </Button>
                    <Button className="bg-gray-100 hover:bg-danger hover:text-white" icon="fa-trash-alt" />
                </div>
            )}
        </div>
    </div>
);

export default ItemCard;