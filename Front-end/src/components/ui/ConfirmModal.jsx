import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger' // 'danger', 'warning', 'info'
}) => {
  if (!isOpen) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // Type-based styling
  let headerStyle, confirmBtnStyle, icon;
  
  switch (type) {
    case 'danger':
      headerStyle = 'bg-red-500';
      confirmBtnStyle = 'bg-red-500 hover:bg-red-600';
      icon = <FaExclamationTriangle className="text-white text-xl" />;
      break;
    case 'warning':
      headerStyle = 'bg-yellow-500';
      confirmBtnStyle = 'bg-yellow-500 hover:bg-yellow-600';
      icon = <FaExclamationTriangle className="text-white text-xl" />;
      break;
    default: // info
      headerStyle = 'bg-[#3D348B]';
      confirmBtnStyle = 'bg-[#3D348B] hover:bg-[#332b77]';
      icon = <FaExclamationTriangle className="text-white text-xl" />;
  }

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Blurred backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        ></div>
        
        {/* Modal content - solid, not blurred */}
        <motion.div
          className="bg-white rounded-lg shadow-xl max-w-md w-full z-10 overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`px-6 py-4 flex items-center ${headerStyle}`}>
            <div className="mr-3">
              {icon}
            </div>
            <h3 className="text-lg font-medium text-white">{title}</h3>
          </div>
          
          {/* Body */}
          <div className="px-6 py-4">
            <p className="text-gray-700">{message}</p>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              className={`px-4 py-2 text-white rounded transition-colors ${confirmBtnStyle}`}
              onClick={handleConfirm}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmModal;