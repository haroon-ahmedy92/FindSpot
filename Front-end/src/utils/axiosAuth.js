import { useEffect } from 'react';
import { setAuthContext } from '../api/axiosInstance';
import { useAuth } from '../contexts/AuthContext';

// Hook to connect AuthContext with axiosInstance
export const useAxiosAuth = () => {
  const authContext = useAuth();

  useEffect(() => {
    // Set the auth context reference in axiosInstance
    setAuthContext(authContext);
  }, [authContext]);

  return authContext;
};

// Component to initialize the axios-auth connection
export const AxiosAuthProvider = ({ children }) => {
  useAxiosAuth();
  return children;
};