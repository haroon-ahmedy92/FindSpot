import React, { useState } from 'react';
import { FaBookmark, FaRegBookmark, FaSpinner } from 'react-icons/fa';
import UserService from '../../api/userService';

/**
 * A reusable button component for saving/bookmarking items
 * 
 * @param {Object} props Component props
 * @param {number} props.itemId The ID of the item to save
 * @param {boolean} props.initialSaved Whether the item is initially saved
 * @param {function} props.onSaveToggle Callback function when save state changes
 */
const SaveItemButton = ({ itemId, initialSaved = false, onSaveToggle, className = '' }) => {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggleSave = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await UserService.saveItem(itemId);
      const newSavedState = !isSaved;
      setIsSaved(newSavedState);
      
      // Call the callback if provided
      if (onSaveToggle) {
        onSaveToggle(newSavedState);
      }
    } catch (err) {
      console.error(`Error toggling save state for item ${itemId}:`, err);
      setError('Failed to save item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleToggleSave}
        className={`flex items-center space-x-1 p-2 rounded-lg transition-colors ${
          isSaved 
            ? 'text-[#F35B04] hover:text-[#d95203]' 
            : 'text-gray-600 hover:text-[#F35B04]'
        }`}
        disabled={isLoading}
        title={isSaved ? 'Remove from saved items' : 'Save this item'}
      >
        {isLoading ? (
          <FaSpinner className="animate-spin" />
        ) : isSaved ? (
          <FaBookmark />
        ) : (
          <FaRegBookmark />
        )}
        <span className="text-sm font-medium">
          {isSaved ? 'Saved' : 'Save'}
        </span>
      </button>
      
      {error && (
        <div className="absolute top-full mt-1 left-0 bg-red-50 border border-red-200 text-red-600 text-xs p-1 rounded whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
};

export default SaveItemButton;