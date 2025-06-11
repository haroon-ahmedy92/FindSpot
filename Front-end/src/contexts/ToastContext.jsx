import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer } from '../components/ui/Toast';

// Create context
const ToastContext = createContext(null);

// Toast provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a toast
  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = uuidv4();
    
    setToasts(prevToasts => [
      ...prevToasts,
      { 
        id, 
        message, 
        type, 
        duration,
        onClose: removeToast
      }
    ]);
    
    return id;
  }, []);

  // Remove a toast
  const removeToast = useCallback(id => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Convenience methods for different toast types
  const showSuccess = useCallback((message, duration) => {
    return addToast(message, 'success', duration);
  }, [addToast]);

  const showError = useCallback((message, duration) => {
    return addToast(message, 'error', duration);
  }, [addToast]);

  const showInfo = useCallback((message, duration) => {
    return addToast(message, 'info', duration);
  }, [addToast]);

  const showWarning = useCallback((message, duration) => {
    return addToast(message, 'warning', duration);
  }, [addToast]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        showSuccess,
        showError,
        showInfo,
        showWarning
      }}
    >
      {children}
      <ToastContainer toasts={toasts} position="top-right" />
    </ToastContext.Provider>
  );
};

// Hook for using the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === null) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;