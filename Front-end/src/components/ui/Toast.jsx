import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const toastVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const Toast = ({ 
  id, 
  message, 
  type = 'info', 
  duration = 4000, 
  onClose 
}) => {
  const { isDarkMode } = useTheme();

  // Set timeout to auto-dismiss the toast
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  // Determine toast color and icon based on type and theme
  const toastStyles = {
    success: {
      bgColor: isDarkMode ? 'bg-green-900/80 border-green-700' : 'bg-green-100 border-green-300',
      textColor: isDarkMode ? 'text-green-200' : 'text-green-800',
      icon: <FaCheckCircle className="text-green-500" />
    },
    info: {
      bgColor: isDarkMode ? 'bg-blue-900/80 border-blue-700' : 'bg-blue-100 border-blue-300',
      textColor: isDarkMode ? 'text-blue-200' : 'text-blue-800',
      icon: <FaInfoCircle className="text-blue-500" />
    },
    warning: {
      bgColor: isDarkMode ? 'bg-yellow-900/80 border-yellow-700' : 'bg-yellow-100 border-yellow-300',
      textColor: isDarkMode ? 'text-yellow-200' : 'text-yellow-800',
      icon: <FaExclamationCircle className="text-yellow-500" />
    },
    error: {
      bgColor: isDarkMode ? 'bg-red-900/80 border-red-700' : 'bg-red-100 border-red-300',
      textColor: isDarkMode ? 'text-red-200' : 'text-red-800',
      icon: <FaTimesCircle className="text-red-500" />
    },
    primary: {
      bgColor: isDarkMode ? 'bg-[#3D348B]/30 border-[#3D348B]/50' : 'bg-[#3D348B]/10 border-[#3D348B]/30',
      textColor: isDarkMode ? 'text-blue-200' : 'text-[#3D348B]',
      icon: <FaInfoCircle className="text-[#3D348B]" />
    }
  };

  const style = toastStyles[type] || toastStyles.info;

  return (
    <AnimatePresence>
      <motion.div 
        className={`max-w-md w-full ${style.bgColor} border rounded-lg shadow-lg px-4 py-3 flex items-start backdrop-blur-sm`}
        variants={toastVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2 }}
      >
        <div className="flex-shrink-0 mr-3 mt-0.5">
          {style.icon}
        </div>
        <div className={`flex-1 ${style.textColor}`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button 
          onClick={() => onClose(id)} 
          className={`ml-4 flex-shrink-0 ${style.textColor} hover:opacity-70 focus:outline-none transition-opacity`}
        >
          <span className="sr-only">Close</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

// Toast Container Component
export const ToastContainer = ({ toasts, position = 'bottom-right' }) => {
  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-center': 'top-0 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
  };

  // Create portal at the root of the document
  return createPortal(
    <div className={`fixed z-50 m-4 space-y-2 pointer-events-none ${positionClasses[position]}`}>
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} />
        </div>
      ))}
    </div>,
    document.body
  );
};

export default Toast;