import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = ({ className = "" }) => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${
                isDarkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            } ${className}`}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <div className="relative">
                {isDarkMode ? (
                    <FaSun className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
                ) : (
                    <FaMoon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12" />
                )}
            </div>
        </button>
    );
};

export default ThemeToggle;