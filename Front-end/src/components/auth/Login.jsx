import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaLock } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuth();
    const { isDarkMode } = useTheme();
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) clearError(); // Clear error when user starts typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.username || !formData.password) {
            // You might want to set a local validation error here
            return;
        }

        try {
            await login(formData);
            navigate('/dashboard'); // Redirect to dashboard on successful login
        } catch (loginError) {
            // Error is already handled by AuthContext
            console.error('Login failed:', loginError);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${
            isDarkMode 
                ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
                : 'bg-gradient-to-b from-[#F8F9FA] to-white'
        }`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
            >
                <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-[#3D348B] to-[#F35B04] p-10 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                    >
                        <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                        <p className="text-white/80 mb-8">
                            Log in to reconnect with our community and manage your lost and found items.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                                    <FaUser />
                                </div>
                                <p className="text-sm">Manage your lost and found items</p>
                            </div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                                    <FaLock />
                                </div>
                                <p className="text-sm">Secure access to your account</p>
                            </div>
                        </div>
                    </motion.div>
                    <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-white/10"></div>
                </div>
                <div className={`w-full md:w-1/2 p-8 md:p-12 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className={`text-3xl font-bold mb-6 ${
                            isDarkMode ? 'text-white' : 'text-[#212529]'
                        }`}>Login</h2>
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-red-100 text-red-700 p-3 rounded-lg mb-4"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <FaUser className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#3D348B]" />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className={`w-full pl-12 pr-4 py-3 border-b-2 focus:outline-none transition-all duration-300 placeholder-gray-400 ${
                                        isDarkMode 
                                            ? 'border-gray-600 text-white bg-transparent focus:border-[#F35B04]' 
                                            : 'border-[#E9ECEF] text-[#212529] focus:border-[#F35B04]'
                                    }`}
                                />
                            </div>
                            <div className="relative">
                                <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#3D348B]" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className={`w-full pl-12 pr-4 py-3 border-b-2 focus:outline-none transition-all duration-300 placeholder-gray-400 ${
                                        isDarkMode 
                                            ? 'border-gray-600 text-white bg-transparent focus:border-[#F35B04]' 
                                            : 'border-[#E9ECEF] text-[#212529] focus:border-[#F35B04]'
                                    }`}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 rounded-full bg-[#F35B04] text-white font-medium hover:bg-gradient-to-r hover:from-[#FFBE0B] hover:to-[#F35B04] transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                            >
                                {isLoading && (
                                    <svg
                                        className="animate-spin mr-2 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                )}
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                        <div className={`mt-6 text-center ${
                            isDarkMode ? 'text-white' : 'text-[#212529]'
                        }`}>
                            <p>
                                Don't have an account?{' '}
                                <Link to="/register" className="text-[#3D348B] hover:text-[#F35B04] transition-colors duration-300">
                                    Sign Up
                                </Link>
                            </p>
                            <Link
                                to="/forgot-password"
                                className={`block mt-2 text-sm hover:text-[#F35B04] transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;